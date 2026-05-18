<?php

namespace App\Console\Commands;

use App\Services\PerformanceService;
use Illuminate\Console\Command;

class WarmApplicationCache extends Command
{
    protected $signature = 'agc:cache-warm';

    protected $description = 'Warm public caches (cookie config, announcements)';

    public function handle(PerformanceService $performance): int
    {
        $results = $performance->warmCaches('scheduler');
        $this->info('Cache warm complete: '.json_encode($results));

        return self::SUCCESS;
    }
}
