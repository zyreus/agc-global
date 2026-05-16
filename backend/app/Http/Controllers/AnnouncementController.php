<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        $announcements = Announcement::query()
            ->where('is_published', true)
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(6)
            ->get(['id', 'title', 'content', 'published_at']);

        return response()->json([
            'announcements' => $announcements,
        ]);
    }
}

