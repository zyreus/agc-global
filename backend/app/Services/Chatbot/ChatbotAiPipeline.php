<?php

namespace App\Services\Chatbot;

use App\Models\ChatbotConversation;
use App\Models\ChatbotMessage;
use App\Models\ChatMessage;
use App\Models\CustomerIntent;
use App\Models\EscalationLog;
use App\Models\FaqTrainingData;
use App\Models\SupportTicket;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

final class ChatbotAiPipeline
{
    public function activeFaqBlock(): string
    {
        $rows = FaqTrainingData::query()
            ->where('is_active', true)
            ->orderByDesc('priority')
            ->orderBy('id')
            ->limit(40)
            ->get(['category', 'question', 'answer']);

        if ($rows->isEmpty()) {
            return '';
        }

        $lines = ["### Curated FAQ / policy (use verbatim when applicable)"];
        foreach ($rows as $row) {
            $lines[] = '- Q: ' . trim($row->question);
            $lines[] = '  A: ' . trim($row->answer) . ' [' . $row->category . ']';
        }

        return implode("\n", $lines);
    }

    /**
     * @return array<int, array{role:string, content:string}>
     */
    public function openAiHistoryForSession(string $sessionId): array
    {
        return ChatMessage::query()
            ->where('session_id', $sessionId)
            ->latest('id')
            ->limit(10)
            ->get(['role', 'message'])
            ->reverse()
            ->values()
            ->map(function (ChatMessage $chatMessage) {
                return [
                    'role' => in_array($chatMessage->role, ['assistant', 'admin'], true) ? 'assistant' : 'user',
                    'content' => $chatMessage->message,
                ];
            })
            ->all();
    }

    /**
     * @param array<int, array{role:string, content:string}> $history
     * @return array{reply:string, intent:string, intent_confidence:float, uncertain:bool, escalate:bool, raw_model?:string}
     */
    public function runStructuredModel(string $sessionId, string $userMessage, array $history, string $systemPrompt): array
    {
        $key = config('services.openai.key');
        if (!is_string($key) || $key === '') {
            return $this->fallbackStructured($userMessage);
        }

        $lastTurn = $history[count($history) - 1] ?? null;
        $alreadyHasUserBubble = is_array($lastTurn)
            && ($lastTurn['role'] ?? '') === 'user'
            && ($lastTurn['content'] ?? '') === $userMessage;

        $messages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $history,
            $alreadyHasUserBubble ? [] : [['role' => 'user', 'content' => $userMessage]]
        );

        $model = (string) config('services.openai.model', 'gpt-4o-mini');

        try {
            $response = Http::withToken($key)
                ->acceptJson()
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.35,
                ]);

            if (!$response->successful()) {
                return $this->fallbackStructured($userMessage);
            }

            $content = data_get($response->json(), 'choices.0.message.content');
            if (!is_string($content) || $content === '') {
                return $this->fallbackStructured($userMessage);
            }

            $parsed = $this->parseStructuredJson($content);
            if ($parsed === null) {
                return [
                    'reply' => trim($content),
                    'intent' => 'general',
                    'intent_confidence' => 0.4,
                    'uncertain' => true,
                    'escalate' => false,
                    'raw_model' => $model,
                ];
            }

            $parsed['reply'] = trim((string) ($parsed['reply'] ?? ''));
            if ($parsed['reply'] === '') {
                return $this->fallbackStructured($userMessage);
            }

            $parsed['intent'] = $this->normalizeIntent((string) ($parsed['intent'] ?? 'general'));
            $parsed['intent_confidence'] = min(1, max(0, (float) ($parsed['intent_confidence'] ?? 0.5)));
            $parsed['uncertain'] = (bool) ($parsed['uncertain'] ?? false);
            $parsed['escalate'] = (bool) ($parsed['escalate'] ?? false);
            $parsed['raw_model'] = $model;

            $parsed = $this->applyRuleEscalation($userMessage, $parsed);

            return $parsed;
        } catch (\Throwable $e) {
            return $this->fallbackStructured($userMessage);
        }
    }

    /**
     * @param array{reply:string, intent:string, intent_confidence:float, uncertain:bool, escalate:bool, raw_model?:string} $structured
     */
    public function persistTurn(
        string $sessionId,
        string $channel,
        ?int $userMessageId,
        int $assistantMessageId,
        array $structured
    ): void {
        $convPayload = [
            'channel' => $channel,
            'last_detected_intent' => $structured['intent'],
        ];
        if ($structured['escalate']) {
            $convPayload['escalation_requested_at'] = now();
        }

        ChatbotConversation::query()->updateOrCreate(
            ['session_id' => $sessionId],
            $convPayload
        );

        if ($userMessageId) {
            CustomerIntent::query()->create([
                'session_id' => $sessionId,
                'chat_message_id' => $userMessageId,
                'intent_label' => $structured['intent'],
                'confidence' => $structured['intent_confidence'],
                'source' => 'openai',
                'created_at' => now(),
            ]);
        }

        ChatbotMessage::query()->create([
            'session_id' => $sessionId,
            'chat_message_id' => $assistantMessageId,
            'detected_intent' => $structured['intent'],
            'intent_confidence' => $structured['intent_confidence'],
            'uncertain' => $structured['uncertain'],
            'escalate_triggered' => $structured['escalate'],
            'model_used' => $structured['raw_model'] ?? null,
            'response_tokens' => null,
        ]);

        if ($structured['escalate']) {
            EscalationLog::query()->create([
                'session_id' => $sessionId,
                'reason' => 'Model or rules requested human assistance (intent: ' . $structured['intent'] . ').',
                'triggered_by' => 'ai',
                'context' => [
                    'uncertain' => $structured['uncertain'],
                    'confidence' => $structured['intent_confidence'],
                ],
            ]);

            $openTicket = SupportTicket::query()
                ->where('session_id', $sessionId)
                ->whereIn('status', ['open', 'pending'])
                ->exists();

            if (!$openTicket) {
                SupportTicket::query()->create([
                    'session_id' => $sessionId,
                    'customer_profile_id' => null,
                    'subject' => 'Chat escalation: ' . $structured['intent'],
                    'priority' => in_array($structured['intent'], ['loan_payment', 'billing'], true) ? 'high' : 'normal',
                    'status' => 'open',
                    'channel' => $channel,
                    'metadata' => ['source' => 'chatbot_escalation'],
                ]);
            }
        }
    }

    /**
     * @return array{reply:string, intent:string, intent_confidence:float, uncertain:bool, escalate:bool}|null
     */
    private function parseStructuredJson(string $content): ?array
    {
        $trim = trim($content);
        if (strpos($trim, '```') === 0) {
            $trim = preg_replace('/^```[a-zA-Z0-9]*\s*/', '', $trim) ?? $trim;
            $trim = preg_replace('/\s*```$/', '', $trim) ?? $trim;
        }
        $start = strpos($trim, '{');
        $end = strrpos($trim, '}');
        if ($start === false || $end === false || $end <= $start) {
            return null;
        }
        $json = substr($trim, $start, $end - $start + 1);
        $data = json_decode($json, true);
        if (!is_array($data)) {
            return null;
        }

        return [
            'reply' => (string) ($data['reply'] ?? ''),
            'intent' => (string) ($data['intent'] ?? 'general'),
            'intent_confidence' => (float) ($data['intent_confidence'] ?? 0.5),
            'uncertain' => (bool) ($data['uncertain'] ?? false),
            'escalate' => (bool) ($data['escalate'] ?? false),
        ];
    }

    private function normalizeIntent(string $intent): string
    {
        $allowed = [
            'sales', 'support', 'billing', 'technical', 'loan_payment',
            'feedback', 'human_handoff', 'general', 'other',
        ];
        $intent = strtolower(trim($intent));
        return in_array($intent, $allowed, true) ? $intent : 'general';
    }

    /**
     * @param array{reply:string, intent:string, intent_confidence:float, uncertain:bool, escalate:bool, raw_model?:string} $parsed
     * @return array{reply:string, intent:string, intent_confidence:float, uncertain:bool, escalate:bool, raw_model?:string}
     */
    private function applyRuleEscalation(string $userMessage, array $parsed): array
    {
        $lower = Str::lower($userMessage);
        if (str_contains($lower, 'human') || str_contains($lower, 'agent') || str_contains($lower, 'representative')) {
            $parsed['intent'] = 'human_handoff';
            $parsed['escalate'] = true;
        }
        if (str_contains($lower, 'loan') || str_contains($lower, 'mortgage') || str_contains($lower, 'financing')) {
            $parsed['intent'] = 'loan_payment';
            $parsed['escalate'] = true;
            $parsed['uncertain'] = true;
        }
        if (str_contains($lower, 'payment dispute') || str_contains($lower, 'chargeback')) {
            $parsed['intent'] = 'billing';
            $parsed['escalate'] = true;
        }
        if ($parsed['intent_confidence'] < 0.45) {
            $parsed['uncertain'] = true;
        }

        return $parsed;
    }

    /**
     * @return array{reply:string, intent:string, intent_confidence:float, uncertain:bool, escalate:bool}
     */
    private function fallbackStructured(string $userMessage): array
    {
        $message = Str::lower($userMessage);
        $reply = 'Thank you for messaging AGC. We provide end-to-end technology and business solutions. Share what you want to build or improve, and I will guide your next step.';
        $intent = 'general';
        $escalate = false;

        if (str_contains($message, 'price') || str_contains($message, 'cost') || str_contains($message, 'quote')) {
            $reply = 'Thanks for your interest. AGC can provide a tailored quote based on scope and timeline. Share your project requirements and we can arrange a consultation.';
            $intent = 'sales';
        } elseif (str_contains($message, 'service') || str_contains($message, 'offer')) {
            $reply = 'AGC offers IT solutions, software development, business process automation, and security/maintenance services. Tell me your goal and I can suggest the best fit.';
            $intent = 'support';
        } elseif (str_contains($message, 'contact') || str_contains($message, 'email') || str_contains($message, 'phone')) {
            $reply = 'You can contact AGC via email at agc.billing2026@gmail.com, phone at +63 9190675099, or visit https://www.amalgatedcomputek.com. I can also help draft your inquiry.';
            $intent = 'support';
        }

        if (str_contains($message, 'loan') || str_contains($message, 'agent')) {
            $escalate = true;
            $intent = str_contains($message, 'loan') ? 'loan_payment' : 'human_handoff';
        }

        return [
            'reply' => $reply,
            'intent' => $intent,
            'intent_confidence' => 0.55,
            'uncertain' => $escalate,
            'escalate' => $escalate,
        ];
    }
}
