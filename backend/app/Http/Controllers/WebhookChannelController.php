<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Placeholders for Meta Messenger / WhatsApp webhooks — verify tokens via env before production.
 */
class WebhookChannelController extends Controller
{
    public function messengerVerify(Request $request): JsonResponse|string
    {
        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');
        $expected = (string) config('services.channels.messenger_verify_token');
        if ($mode === 'subscribe' && $expected !== '' && $token === $expected) {
            return response($challenge ?? '', 200)->header('Content-Type', 'text/plain');
        }

        return response()->json(['ok' => false], 403);
    }

    public function messengerEvent(Request $request): JsonResponse
    {
        // TODO: validate X-Hub-Signature-256, map sender to session_id, forward to ChatbotAiPipeline / queue.
        return response()->json(['ok' => true]);
    }

    public function whatsappVerify(Request $request): JsonResponse|string
    {
        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');
        $expected = (string) config('services.channels.whatsapp_verify_token');
        if ($mode === 'subscribe' && $expected !== '' && $token === $expected) {
            return response($challenge ?? '', 200)->header('Content-Type', 'text/plain');
        }

        return response()->json(['ok' => false], 403);
    }

    public function whatsappEvent(Request $request): JsonResponse
    {
        return response()->json(['ok' => true]);
    }
}
