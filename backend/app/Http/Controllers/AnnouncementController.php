<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\JsonResponse;

class AnnouncementController extends Controller
{
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $type = $request->query('type');
        if ($type !== null && ! in_array($type, [Announcement::TYPE_NEWS, Announcement::TYPE_CAREER], true)) {
            return response()->json(['message' => 'Invalid announcement type.'], 422);
        }

        $announcements = Announcement::query()
            ->where('is_published', true)
            ->when($type, fn ($q) => $q->where('type', $type))
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit($type ? 12 : 24)
            ->get(['id', 'title', 'content', 'type', 'published_at']);

        return response()->json([
            'announcements' => $announcements,
        ]);
    }
}

