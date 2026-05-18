<?php

namespace App\Http\Controllers;

use App\Models\CookieConsent;
use App\Services\CookieSettingsService;
use App\Services\PerformanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPerformanceController extends Controller
{
    public function __construct(
        protected PerformanceService $performance,
        protected CookieSettingsService $cookieSettings
    ) {}

    public function overview(): JsonResponse
    {
        return response()->json([
            'metrics' => $this->performance->metrics(),
            'cookie_settings' => $this->cookieSettings->get(),
        ]);
    }

    public function updateCookieSettings(Request $request): JsonResponse
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
            'settings.banner' => ['sometimes', 'array'],
            'settings.categories' => ['sometimes', 'array'],
            'settings.compliance' => ['sometimes', 'array'],
            'settings.consent_version' => ['sometimes', 'string', 'max:20'],
        ]);

        $actor = $request->user()?->email ?? $request->user()?->username ?? 'admin';

        $merged = $this->cookieSettings->update($data['settings'], $actor);

        return response()->json([
            'ok' => true,
            'settings' => $merged,
        ]);
    }

    public function clearCache(Request $request): JsonResponse
    {
        $data = $request->validate([
            'targets' => ['required', 'array'],
            'targets.*' => ['string', 'in:application,config,route,view,all'],
        ]);

        $actor = $request->user()?->email ?? $request->user()?->username ?? 'admin';
        $results = $this->performance->clearCaches($data['targets'], $actor);

        return response()->json([
            'ok' => true,
            'results' => $results,
        ]);
    }

    public function optimizeCache(Request $request): JsonResponse
    {
        $actor = $request->user()?->email ?? $request->user()?->username ?? 'admin';
        $results = $this->performance->optimizeCaches($actor);

        return response()->json([
            'ok' => true,
            'results' => $results,
        ]);
    }

    public function warmCache(Request $request): JsonResponse
    {
        $actor = $request->user()?->email ?? $request->user()?->username ?? 'admin';
        $results = $this->performance->warmCaches($actor);

        return response()->json([
            'ok' => true,
            'results' => $results,
        ]);
    }

    public function consentLogs(Request $request): JsonResponse
    {
        $perPage = min(100, max(10, (int) $request->query('per_page', 25)));

        $logs = CookieConsent::query()
            ->orderByDesc('id')
            ->paginate($perPage, [
                'id',
                'visitor_id',
                'action',
                'categories',
                'region',
                'consent_version',
                'created_at',
            ]);

        return response()->json($logs);
    }
}
