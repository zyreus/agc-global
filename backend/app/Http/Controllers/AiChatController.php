<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\ChatConversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AiChatController extends Controller
{
    public function respond(Request $request): JsonResponse
    {
        $data = $request->validate([
            'message' => ['required', 'string', 'max:1200'],
            'session_id' => ['nullable', 'string', 'max:120'],
        ]);

        $sessionId = $data['session_id'] ?? (string) Str::uuid();
        $userMessage = trim($data['message']);

        ChatMessage::create([
            'session_id' => $sessionId,
            'role' => 'user',
            'message' => $userMessage,
        ]);

        ChatConversation::query()->updateOrCreate(
            ['session_id' => $sessionId],
            ['last_message_at' => now()]
        );

        $assistantReply = $this->generateReply($sessionId, $userMessage);

        ChatMessage::create([
            'session_id' => $sessionId,
            'role' => 'assistant',
            'message' => $assistantReply,
        ]);

        ChatConversation::query()->where('session_id', $sessionId)->update(['last_message_at' => now()]);

        return response()->json([
            'session_id' => $sessionId,
            'reply' => $assistantReply,
        ]);
    }

    private function generateReply(string $sessionId, string $userMessage): string
    {
        $openAiKey = config('services.openai.key');

        if ($openAiKey) {
            try {
                $history = ChatMessage::query()
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

                $systemPrompt = <<<PROMPT
You are AGC Assistant for Amalgated Global Computek (AGC). Your answers must match the public AGC website: stay factual, use only the information below plus the current conversation, and do not invent services, partners, certifications, or policies not stated here.

Role:
- Help website visitors with AGC inquiries.
- Be concise, professional, and friendly.
- Ask 1-2 clarifying questions when requirements are unclear.
- End with a clear next step when possible.

AGC Knowledge (from the public site):
- Company: Amalgated Global Computek (AGC)
- Positioning: technologies and business solutions; bridging technology and business efficiency.
- Tagline: "Your Goals. Our Solutions." (footer also describes "Technologies & Business Solutions.")
- Hero focus: IT + business, end-to-end delivery, tailored and scalable solutions; serving startups, enterprises, and government institutions.
- About (summary): experienced team delivering high-quality digital solutions for productivity and innovation; every business has unique goals—turning goals into reality through smart, scalable solutions.
- What we deliver: modern scalable systems on trusted stacks; solutions tailored to operations and workflows; end-to-end support from planning to maintenance.
- Mission: provide innovative and reliable technology solutions so businesses achieve their goals efficiently and effectively.
- Vision: become a leading provider of integrated technology and business solutions recognized for excellence, innovation, and customer satisfaction.
- Core services:
  1) IT Solutions & System Development — custom web applications, business management systems, API development & integration, cloud-based solutions
  2) Software Development — Laravel & PHP development, frontend UI/UX design, mobile-friendly applications, system optimization
  3) Business Solutions — process automation, data management systems, reporting & analytics, digital transformation consulting
  4) Security & Maintenance — system security implementation, regular maintenance & support, backup & recovery solutions
- Contact:
  - Email: agc.billing2026@gmail.com
  - Phone: +63 9190675099
  - Website: https://www.amalgatedcomputek.com

Rules:
- Do not invent prices; for pricing, request project scope and recommend consultation.
- If asked unrelated or unsafe requests, politely decline and redirect to AGC support topics.
- If user asks to connect with staff, collect name, email, and concern in the reply template.
PROMPT;

                $lastTurn = $history[count($history) - 1] ?? null;
                $alreadyHasUserBubble = is_array($lastTurn)
                    && ($lastTurn['role'] ?? '') === 'user'
                    && ($lastTurn['content'] ?? '') === $userMessage;

                $messages = array_merge(
                    [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt,
                        ],
                    ],
                    $history,
                    $alreadyHasUserBubble
                        ? []
                        : [
                            [
                                'role' => 'user',
                                'content' => $userMessage,
                            ],
                        ]
                );

                $response = Http::withToken($openAiKey)
                    ->acceptJson()
                    ->post('https://api.openai.com/v1/chat/completions', [
                        'model' => config('services.openai.model', 'gpt-4o-mini'),
                        'messages' => $messages,
                        'temperature' => 0.4,
                    ]);

                if ($response->successful()) {
                    $content = data_get($response->json(), 'choices.0.message.content');
                    if (is_string($content) && $content !== '') {
                        return trim($content);
                    }
                }
            } catch (\Throwable $exception) {
                // Fallback to local response below.
            }
        }

        return $this->fallbackReply($userMessage);
    }

    private function fallbackReply(string $userMessage): string
    {
        $message = Str::lower($userMessage);

        if (str_contains($message, 'price') || str_contains($message, 'cost') || str_contains($message, 'quote')) {
            return 'Thanks for your interest. AGC can provide a tailored quote based on scope and timeline. Share your project requirements and we can arrange a consultation.';
        }

        if (str_contains($message, 'service') || str_contains($message, 'offer')) {
            return 'AGC offers IT solutions, software development, business process automation, and security/maintenance services. Tell me your goal and I can suggest the best fit.';
        }

        if (str_contains($message, 'contact') || str_contains($message, 'email') || str_contains($message, 'phone')) {
            return 'You can contact AGC via email at agc.billing2026@gmail.com, phone at +63 9190675099, or visit https://www.amalgatedcomputek.com. I can also help draft your inquiry.';
        }

        return 'Thank you for messaging AGC. We provide end-to-end technology and business solutions. Share what you want to build or improve, and I will guide your next step.';
    }
}
