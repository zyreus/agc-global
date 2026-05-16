<?php

namespace App\Http\Controllers;

use App\Models\ChatbotMessage;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Models\EscalationLog;
use App\Models\FeedbackEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPortalController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        // Align dashboard stats with Chat & CRM:
        // - only active (not archived) conversations
        // - only incoming customer messages (role = user)
        $activeSessionIds = ChatConversation::query()
            ->whereNull('archived_at')
            ->pluck('session_id');

        $totalSessions = $activeSessionIds->count();

        $totalMessages = ChatMessage::query()
            ->whereIn('session_id', $activeSessionIds)
            ->where('role', 'user')
            ->count();

        $messagesToday = ChatMessage::query()
            ->whereIn('session_id', $activeSessionIds)
            ->where('role', 'user')
            ->whereDate('created_at', now()->toDateString())
            ->count();

        $recentMessages = ChatMessage::query()
            ->whereIn('session_id', $activeSessionIds)
            ->where('role', 'user')
            ->latest()
            ->limit(20)
            ->get(['id', 'session_id', 'role', 'message', 'created_at']);

        $botTagged = (int) ChatbotMessage::query()->count();
        $botUncertain = (int) ChatbotMessage::query()->where('uncertain', true)->count();
        $escalations = (int) EscalationLog::query()->count();
        $csat = FeedbackEntry::query()->avg('rating');

        return response()->json([
            'stats' => [
                'total_messages' => $totalMessages,
                'total_sessions' => $totalSessions,
                'messages_today' => $messagesToday,
            ],
            'chatbot' => [
                'tagged_replies' => $botTagged,
                'uncertain_replies' => $botUncertain,
                'escalation_events' => $escalations,
                'satisfaction_avg' => $csat !== null ? round((float) $csat, 2) : null,
            ],
            'recent_messages' => $recentMessages,
        ]);
    }
}
