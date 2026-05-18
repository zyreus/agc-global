<?php

namespace App\Http\Controllers;

use App\Models\CookieConsent;
use App\Services\CookieSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class CookieConsentController extends Controller
{
    public function __construct(
        protected CookieSettingsService $settings
    ) {}

    public function config(): JsonResponse
    {
        return response()->json([
            'config' => $this->settings->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'visitor_id' => ['required', 'string', 'max:64'],
            'action' => ['required', 'string', 'in:accept_all,reject_all,save_preferences'],
            'categories' => ['required', 'array'],
            'categories.essential' => ['boolean'],
            'categories.functional' => ['boolean'],
            'categories.analytics' => ['boolean'],
            'categories.marketing' => ['boolean'],
            'region' => ['nullable', 'string', 'max:16'],
            'consent_version' => ['nullable', 'string', 'max:20'],
        ]);

        $categories = $this->normalizeCategories($data['categories']);

        if (config('cookies.compliance.log_consents', true)) {
            CookieConsent::query()->create([
                'visitor_id' => $data['visitor_id'],
                'consent_version' => $data['consent_version'] ?? config('cookies.consent_version'),
                'action' => $data['action'],
                'categories' => $categories,
                'region' => $data['region'] ?? 'ALL',
                'ip_hash' => $this->hashIp($request->ip()),
                'user_agent' => Str::limit((string) $request->userAgent(), 500, ''),
            ]);
        }

        $visitorCookie = config('cookies.visitor_cookie', 'agc_visitor_id');
        $minutes = (int) config('cookies.visitor_ttl_days', 365) * 24 * 60;

        $cookie = cookie(
            $visitorCookie,
            $data['visitor_id'],
            $minutes,
            '/',
            config('session.domain'),
            (bool) config('session.secure', false),
            false,
            false,
            config('session.same_site', 'lax')
        );

        return response()
            ->json([
                'ok' => true,
                'categories' => $categories,
                'consent_version' => $data['consent_version'] ?? config('cookies.consent_version'),
            ])
            ->withCookie($cookie);
    }

    protected function normalizeCategories(array $categories): array
    {
        $defaults = config('cookies.categories', []);
        $out = [];

        foreach (array_keys($defaults) as $key) {
            if ($key === 'essential') {
                $out[$key] = true;
                continue;
            }
            $out[$key] = (bool) ($categories[$key] ?? false);
        }

        return $out;
    }

    protected function hashIp(?string $ip): ?string
    {
        if (! $ip) {
            return null;
        }

        return hash('sha256', $ip.config('app.key'));
    }
}
