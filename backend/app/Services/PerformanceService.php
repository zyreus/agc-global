<?php

namespace App\Services;

use App\Models\CookieConsent;
use App\Models\PerformanceLog;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class PerformanceService
{
    public static function log(string $event, ?string $actor = null, ?array $meta = null): void
    {
        try {
            PerformanceLog::query()->create([
                'event' => $event,
                'actor' => $actor,
                'meta' => $meta,
            ]);
        } catch (\Throwable) {
            // Non-blocking audit trail
        }
    }

    public function metrics(): array
    {
        $cacheDriver = config('cache.default');
        $sessionDriver = config('session.driver');

        return [
            'environment' => config('app.env'),
            'cache' => [
                'driver' => $cacheDriver,
                'stores' => array_keys(config('cache.stores', [])),
            ],
            'session' => [
                'driver' => $sessionDriver,
                'lifetime_minutes' => (int) config('session.lifetime'),
                'secure' => (bool) config('session.secure'),
                'same_site' => config('session.same_site'),
            ],
            'consent' => $this->consentSummary(),
            'storage' => [
                'framework_cache_bytes' => $this->dirSize(storage_path('framework/cache')),
                'framework_views_bytes' => $this->dirSize(storage_path('framework/views')),
                'bootstrap_cache_bytes' => $this->dirSize(base_path('bootstrap/cache')),
            ],
            'recent_events' => PerformanceLog::query()
                ->orderByDesc('id')
                ->limit(15)
                ->get(['id', 'event', 'actor', 'meta', 'created_at']),
        ];
    }

    public function consentSummary(): array
    {
        try {
            $total = CookieConsent::query()->count();
            $last7 = CookieConsent::query()->where('created_at', '>=', now()->subDays(7))->count();
            $byAction = CookieConsent::query()
                ->selectRaw('action, COUNT(*) as total')
                ->groupBy('action')
                ->pluck('total', 'action');

            return [
                'total' => $total,
                'last_7_days' => $last7,
                'by_action' => $byAction,
            ];
        } catch (\Throwable) {
            return ['total' => 0, 'last_7_days' => 0, 'by_action' => []];
        }
    }

    public function clearCaches(array $targets, ?string $actor = null): array
    {
        $results = [];

        if (in_array('application', $targets, true) || in_array('all', $targets, true)) {
            Artisan::call('cache:clear');
            $results['application'] = 'cleared';
        }

        if (in_array('config', $targets, true) || in_array('all', $targets, true)) {
            Artisan::call('config:clear');
            $results['config'] = 'cleared';
        }

        if (in_array('route', $targets, true) || in_array('all', $targets, true)) {
            Artisan::call('route:clear');
            $results['route'] = 'cleared';
        }

        if (in_array('view', $targets, true) || in_array('all', $targets, true)) {
            Artisan::call('view:clear');
            $results['view'] = 'cleared';
        }

        Cache::forget('announcements.public');
        Cache::forget('cookie_settings.public');

        self::log('cache_cleared', $actor, ['targets' => $targets, 'results' => $results]);

        return $results;
    }

    public function optimizeCaches(?string $actor = null): array
    {
        $results = [];

        if (config('app.env') === 'production') {
            Artisan::call('config:cache');
            $results['config'] = 'cached';
            Artisan::call('route:cache');
            $results['route'] = 'cached';
            Artisan::call('view:cache');
            $results['view'] = 'cached';
        } else {
            $results['note'] = 'Skipped config/route/view cache in non-production environment.';
        }

        Artisan::call('cache:clear');
        $results['application'] = 'cleared and ready for warm';

        self::log('cache_optimized', $actor, $results);

        return $results;
    }

    public function warmCaches(?string $actor = null): array
    {
        app(CookieSettingsService::class)->get();

        try {
            \App\Models\Announcement::query()
                ->where('is_published', true)
                ->orderByDesc('published_at')
                ->limit(24)
                ->get();
            Cache::put('announcements.warmed', true, 60);
        } catch (\Throwable) {
            // Table may not exist during setup
        }

        self::log('cache_warmed', $actor);

        return ['status' => 'warmed'];
    }

    protected function dirSize(string $path): int
    {
        if (! File::isDirectory($path)) {
            return 0;
        }

        $bytes = 0;
        foreach (File::allFiles($path) as $file) {
            $bytes += $file->getSize();
        }

        return $bytes;
    }
}
