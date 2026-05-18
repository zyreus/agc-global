<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class AnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        $ttl = (int) config('performance.public_cache.announcements_ttl', 300);
        $cacheKey = 'announcements.public.news';

        $announcements = Cache::remember($cacheKey, $ttl, function () {
            return Announcement::query()
                ->where('is_published', true)
                ->where('type', Announcement::TYPE_NEWS)
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->limit(24)
                ->get(['id', 'title', 'content', 'type', 'published_at']);
        });

        return response()->json([
            'announcements' => $announcements,
        ]);
    }
}

