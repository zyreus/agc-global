<?php

namespace App\Services;

use App\Models\CookieSetting;
use Illuminate\Support\Facades\Cache;

class CookieSettingsService
{
    public function defaults(): array
    {
        return [
            'consent_version' => config('cookies.consent_version'),
            'banner' => config('cookies.banner'),
            'categories' => config('cookies.categories'),
            'compliance' => config('cookies.compliance'),
        ];
    }

    public function get(): array
    {
        $ttl = config('performance.public_cache.cookie_config_ttl', 600);

        return Cache::remember('cookie_settings.public', $ttl, function () {
            $row = CookieSetting::query()->latest('id')->first();

            if (! $row || ! is_array($row->settings)) {
                return $this->defaults();
            }

            return array_replace_recursive($this->defaults(), $row->settings);
        });
    }

    public function update(array $settings, ?string $actor = null): array
    {
        $merged = array_replace_recursive($this->defaults(), $settings);

        CookieSetting::query()->create([
            'settings' => $merged,
        ]);

        Cache::forget('cookie_settings.public');

        PerformanceService::log('cookie_settings_updated', $actor, [
            'consent_version' => $merged['consent_version'] ?? null,
        ]);

        return $merged;
    }
}
