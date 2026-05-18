<?php

namespace App\Console\Commands;

use App\Models\CookieConsent;
use Illuminate\Console\Command;

class PurgeExpiredConsents extends Command
{
    protected $signature = 'agc:purge-consents';

    protected $description = 'Remove cookie consent audit logs older than retention policy';

    public function handle(): int
    {
        $days = (int) config('cookies.compliance.retention_days', 730);
        $cutoff = now()->subDays($days);

        $deleted = CookieConsent::query()
            ->where('created_at', '<', $cutoff)
            ->delete();

        $this->info("Purged {$deleted} consent log(s) older than {$days} days.");

        return self::SUCCESS;
    }
}
