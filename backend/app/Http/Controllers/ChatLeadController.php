<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatLead;
use App\Models\ChatbotConversation;
use App\Models\CustomerProfile;
use App\Services\Brevo\BrevoClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatLeadController extends Controller
{
    public function store(Request $request, BrevoClient $brevo): JsonResponse
    {
        $data = $request->validate([
            'session_id' => ['required', 'string', 'max:120'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:60'],
            'company' => ['nullable', 'string', 'max:120'],
            'concern' => ['nullable', 'string', 'max:2000'],
            'marketing_opt_in' => ['nullable', 'boolean'],
            'gdpr_consent' => ['nullable', 'boolean'],
        ]);

        ChatLead::query()->create([
            'session_id' => $data['session_id'],
            'name' => trim($data['name']),
            'email' => strtolower(trim($data['email'])),
            'phone' => isset($data['phone']) ? trim($data['phone']) : null,
            'company' => isset($data['company']) ? trim($data['company']) : null,
            'concern' => isset($data['concern']) ? trim($data['concern']) : null,
        ]);

        ChatConversation::query()->updateOrCreate(
            ['session_id' => $data['session_id']],
            ['last_message_at' => now()]
        );

        $marketing = (bool) ($data['marketing_opt_in'] ?? false);
        $gdpr = !empty($data['gdpr_consent']) ? now() : null;

        $profile = CustomerProfile::upsertFromLead(
            $data['session_id'],
            $data['email'],
            $data['name'],
            $data['phone'] ?? null,
            $marketing,
            $gdpr
        );

        ChatbotConversation::query()->updateOrCreate(
            ['session_id' => $data['session_id']],
            [
                'customer_profile_id' => $profile->id,
                'segment' => 'lead',
            ]
        );

        if ($brevo->isConfigured()) {
            $listId = config('services.brevo.default_list_id');
            $brevo->upsertContact($data['email'], [
                'FIRSTNAME' => trim($data['name']),
            ], is_numeric($listId) ? (int) $listId : null);

            $notify = (string) config('services.brevo.team_notify_email');
            if ($notify !== '') {
                $html = '<p>New chat lead from AGC website.</p>'
                    . '<p><strong>Name:</strong> ' . e(trim($data['name'])) . '</p>'
                    . '<p><strong>Email:</strong> ' . e(strtolower(trim($data['email']))) . '</p>'
                    . '<p><strong>Session:</strong> ' . e($data['session_id']) . '</p>'
                    . (isset($data['concern']) ? '<p><strong>Concern:</strong><br>' . nl2br(e($data['concern'])) . '</p>' : '');
                $brevo->sendTransactionalEmail(
                    $notify,
                    'AGC Team',
                    'New lead: ' . trim($data['name']),
                    $html
                );
            }
        }

        return response()->json(['ok' => true]);
    }
}
