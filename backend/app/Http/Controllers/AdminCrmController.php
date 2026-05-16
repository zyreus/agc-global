<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatLead;
use App\Models\ChatMessage;
use App\Models\ChatbotMessage;
use App\Models\CustomerIntent;
use App\Models\EscalationLog;
use App\Models\FeedbackEntry;
use App\Models\SupportTicket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminCrmController extends Controller
{
    public function conversations(Request $request): JsonResponse
    {
        $data = $request->validate([
            'status' => ['nullable', 'string', 'in:open,in_progress,closed'],
            'archived' => ['nullable', 'string', 'in:0,1'],
        ]);

        $q = ChatConversation::query();
        if (!empty($data['status'])) $q->where('status', $data['status']);
        if (isset($data['archived'])) {
            $data['archived'] === '1' ? $q->whereNotNull('archived_at') : $q->whereNull('archived_at');
        } else {
            $q->whereNull('archived_at');
        }

        $items = $q->orderByDesc('last_message_at')->orderByDesc('id')->limit(200)->get();

        // Attach light preview (last message + counts) without heavy joins
        $sessionIds = $items->pluck('session_id')->all();
        $counts = ChatMessage::query()
            ->select('session_id', DB::raw('COUNT(*) as cnt'))
            ->whereIn('session_id', $sessionIds)
            ->groupBy('session_id')
            ->pluck('cnt', 'session_id');

        $last = ChatMessage::query()
            ->whereIn('session_id', $sessionIds)
            ->orderByDesc('id')
            ->get(['session_id', 'role', 'message', 'created_at'])
            ->groupBy('session_id')
            ->map(fn ($g) => $g->first());

        $result = $items->map(function (ChatConversation $c) use ($counts, $last) {
            $l = $last->get($c->session_id);
            return [
                'session_id' => $c->session_id,
                'status' => $c->status,
                'archived_at' => $c->archived_at,
                'last_message_at' => $c->last_message_at,
                'message_count' => (int)($counts[$c->session_id] ?? 0),
                'last_message' => $l ? [
                    'role' => $l->role,
                    'message' => $l->message,
                    'created_at' => $l->created_at,
                ] : null,
            ];
        });

        return response()->json(['conversations' => $result]);
    }

    public function conversation(string $sessionId): JsonResponse
    {
        $conv = ChatConversation::query()->where('session_id', $sessionId)->first();

        $messages = ChatMessage::query()
            ->where('session_id', $sessionId)
            ->orderBy('id')
            ->get(['id', 'role', 'message', 'created_at']);

        $lead = ChatLead::query()->where('session_id', $sessionId)->latest('id')->first();
        $feedback = FeedbackEntry::query()->where('conversation_id', $sessionId)->latest('id')->first();

        return response()->json([
            'conversation' => $conv ? [
                'session_id' => $conv->session_id,
                'status' => $conv->status,
                'archived_at' => $conv->archived_at,
                'last_message_at' => $conv->last_message_at,
            ] : [
                'session_id' => $sessionId,
                'status' => 'open',
                'archived_at' => null,
                'last_message_at' => null,
            ],
            'messages' => $messages,
            'lead' => $lead,
            'feedback' => $feedback,
        ]);
    }

    public function reply(Request $request, string $sessionId): JsonResponse
    {
        $data = $request->validate([
            'mode' => ['required', 'string', 'in:human,ai'],
            'message' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($data['mode'] === 'human') {
            $text = trim((string)($data['message'] ?? ''));
            if ($text === '') return response()->json(['message' => 'Message is required'], 422);

            ChatMessage::create([
                'session_id' => $sessionId,
                'role' => 'admin',
                'message' => $text,
            ]);

            ChatConversation::query()->updateOrCreate(
                ['session_id' => $sessionId],
                ['last_message_at' => now()]
            );

            return response()->json(['ok' => true]);
        }

        // AI mode: take last user message if message not provided
        $prompt = trim((string)($data['message'] ?? ''));
        if ($prompt === '') {
            $lastUser = ChatMessage::query()
                ->where('session_id', $sessionId)
                ->where('role', 'user')
                ->latest('id')
                ->first();
            $prompt = $lastUser?->message ?? '';
        }
        if ($prompt === '') return response()->json(['message' => 'No user message to respond to'], 422);

        $ai = app(AiChatController::class);
        $structured = $ai->draftAssistantForSession($sessionId, $prompt);
        $assistantReply = $structured['reply'];
        if (!empty($structured['escalate'])) {
            $assistantReply .= "\n\nI've escalated this thread for specialist follow-up.";
        }

        $assistantRow = ChatMessage::create([
            'session_id' => $sessionId,
            'role' => 'assistant',
            'message' => $assistantReply,
        ]);

        $ai->persistAdminAssistantAnalytics($sessionId, (int) $assistantRow->id, $structured, 'website');

        ChatConversation::query()->updateOrCreate(
            ['session_id' => $sessionId],
            ['last_message_at' => now()]
        );

        return response()->json(['ok' => true, 'reply' => $assistantReply]);
    }

    public function setStatus(Request $request, string $sessionId): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:open,in_progress,closed'],
        ]);

        $conv = ChatConversation::query()->updateOrCreate(
            ['session_id' => $sessionId],
            ['status' => $data['status']]
        );

        return response()->json(['conversation' => $conv]);
    }

    public function archive(Request $request, string $sessionId): JsonResponse
    {
        $data = $request->validate([
            'archived' => ['required', 'boolean'],
        ]);

        $conv = ChatConversation::query()->updateOrCreate(
            ['session_id' => $sessionId],
            ['archived_at' => $data['archived'] ? now() : null]
        );

        return response()->json(['conversation' => $conv]);
    }

    public function destroy(string $sessionId): JsonResponse
    {
        ChatMessage::query()->where('session_id', $sessionId)->delete();
        ChatConversation::query()->where('session_id', $sessionId)->delete();
        ChatLead::query()->where('session_id', $sessionId)->delete();
        FeedbackEntry::query()->where('conversation_id', $sessionId)->delete();
        CustomerIntent::query()->where('session_id', $sessionId)->delete();
        EscalationLog::query()->where('session_id', $sessionId)->delete();
        SupportTicket::query()->where('session_id', $sessionId)->delete();
        \App\Models\ChatbotConversation::query()->where('session_id', $sessionId)->delete();

        return response()->json(['ok' => true]);
    }

    public function leads(Request $request): JsonResponse
    {
        $data = $request->validate([
            'status' => ['nullable', 'string', 'in:open,in_progress,closed'],
            'archived' => ['nullable', 'string', 'in:0,1'],
        ]);

        $q = ChatLead::query();
        if (!empty($data['status'])) $q->where('status', $data['status']);
        if (isset($data['archived'])) {
            $data['archived'] === '1' ? $q->whereNotNull('archived_at') : $q->whereNull('archived_at');
        } else {
            $q->whereNull('archived_at');
        }

        $items = $q->latest('id')->limit(500)->get();
        return response()->json(['leads' => $items]);
    }

    public function leadArchive(Request $request, ChatLead $lead): JsonResponse
    {
        $data = $request->validate(['archived' => ['required', 'boolean']]);
        $lead->update(['archived_at' => $data['archived'] ? now() : null]);
        return response()->json(['lead' => $lead->fresh()]);
    }

    public function leadStatus(Request $request, ChatLead $lead): JsonResponse
    {
        $data = $request->validate(['status' => ['required', 'string', 'in:open,in_progress,closed']]);
        $lead->update(['status' => $data['status']]);
        return response()->json(['lead' => $lead->fresh()]);
    }

    public function chatbotAnalytics(): JsonResponse
    {
        $intentBreakdown = CustomerIntent::query()
            ->select('intent_label', DB::raw('COUNT(*) as cnt'))
            ->groupBy('intent_label')
            ->orderByDesc('cnt')
            ->pluck('cnt', 'intent_label');

        $tagged = (int) ChatbotMessage::query()->count();
        $uncertain = (int) ChatbotMessage::query()->where('uncertain', true)->count();
        $escalations = (int) EscalationLog::query()->count();
        $escalateFlagged = (int) ChatbotMessage::query()->where('escalate_triggered', true)->count();

        $userMsgs = (int) ChatMessage::query()->where('role', 'user')->count();
        $adminMsgs = (int) ChatMessage::query()->where('role', 'admin')->count();
        $leads = (int) ChatLead::query()->whereNull('archived_at')->count();

        $accuracyProxy = $tagged > 0 ? round(100 * (1 - ($uncertain / $tagged)), 2) : null;
        $takeoverRate = $userMsgs > 0 ? round(100 * ($adminMsgs / max($userMsgs, 1)), 2) : 0;
        $conversionRate = $userMsgs > 0 ? round(100 * ($leads / max($userMsgs, 1)), 2) : 0;

        $csat = FeedbackEntry::query()->avg('rating');

        return response()->json([
            'intent_breakdown' => $intentBreakdown,
            'totals' => [
                'tagged_assistant_messages' => $tagged,
                'uncertain_replies' => $uncertain,
                'escalation_events' => $escalations,
                'escalate_flags' => $escalateFlagged,
                'user_messages' => $userMsgs,
                'admin_messages' => $adminMsgs,
                'active_leads' => $leads,
            ],
            'kpis' => [
                'response_grounding_score' => $accuracyProxy,
                'customer_satisfaction_avg' => $csat !== null ? round((float) $csat, 2) : null,
                'conversion_rate_percent' => $conversionRate,
                'agent_takeover_rate_percent' => $takeoverRate,
            ],
        ]);
    }

    public function feedback(): JsonResponse
    {
        $items = FeedbackEntry::query()->latest('id')->limit(500)->get();
        return response()->json(['feedback' => $items]);
    }
}

