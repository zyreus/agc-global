<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
use App\Services\Chatbot\ChatbotAiPipeline;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AiChatController extends Controller
{
    /** @var ChatbotAiPipeline */
    protected $pipeline;

    public function __construct(ChatbotAiPipeline $pipeline)
    {
        $this->pipeline = $pipeline;
    }

    public function respond(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1200'],
            'session_id' => ['nullable', 'string', 'max:120'],
            'channel' => ['nullable', 'string', 'max:32'],
        ]);

        $sessionId = $data['session_id'] ?? (string) Str::uuid();
        $userMessage = trim($data['message']);
        $channel = strtolower((string) ($data['channel'] ?? 'website'));
        if (!in_array($channel, ['website', 'messenger', 'whatsapp', 'sms', 'email'], true)) {
            $channel = 'website';
        }

        $userRow = ChatMessage::create([
            'session_id' => $sessionId,
            'role' => 'user',
            'message' => $userMessage,
        ]);

        ChatConversation::query()->updateOrCreate(
            ['session_id' => $sessionId],
            ['last_message_at' => now()]
        );

        $system = $this->pipeline->composeSystemPrompt();
        $history = $this->pipeline->openAiHistoryForSession($sessionId);
        $structured = $this->pipeline->runStructuredModel($sessionId, $userMessage, $history, $system);

        if (!empty($structured['escalate'])) {
            $structured['reply'] .= "\n\nI've flagged this conversation for a live specialist. Our team can review it in the admin CRM and follow up.";
        }

        $assistantRow = ChatMessage::create([
            'session_id' => $sessionId,
            'role' => 'assistant',
            'message' => $structured['reply'],
        ]);

        ChatConversation::query()->where('session_id', $sessionId)->update(['last_message_at' => now()]);

        $this->pipeline->persistTurn($sessionId, $channel, (int) $userRow->id, (int) $assistantRow->id, $structured);

        return response()->json([
            'session_id' => $sessionId,
            'reply' => $structured['reply'],
            'intent' => $structured['intent'],
            'intent_confidence' => $structured['intent_confidence'],
            'escalate' => (bool) $structured['escalate'],
            'uncertain' => (bool) $structured['uncertain'],
        ]);
    }

    /**
     * Draft an assistant reply for an existing session (admin CRM). Does not persist messages.
     *
     * @return array{reply:string, intent:string, intent_confidence:float, uncertain:bool, escalate:bool, raw_model?:string}
     */
    public function draftAssistantForSession(string $sessionId, string $prompt): array
    {
        $system = $this->pipeline->composeSystemPrompt();
        $history = $this->pipeline->openAiHistoryForSession($sessionId);

        return $this->pipeline->runStructuredModel($sessionId, trim($prompt), $history, $system);
    }

    /**
     * Persist analytics after an admin-posted assistant message is stored.
     */
    public function persistAdminAssistantAnalytics(string $sessionId, int $assistantMessageId, array $structured, string $channel = 'website'): void
    {
        $lastUserId = ChatMessage::query()
            ->where('session_id', $sessionId)
            ->where('role', 'user')
            ->where('id', '<', $assistantMessageId)
            ->latest('id')
            ->value('id');

        $this->pipeline->persistTurn(
            $sessionId,
            $channel,
            $lastUserId ? (int) $lastUserId : null,
            $assistantMessageId,
            $structured
        );
    }
}
