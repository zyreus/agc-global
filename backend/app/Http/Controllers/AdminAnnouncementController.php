<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminAnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        $announcements = Announcement::query()
            ->latest('published_at')
            ->latest('id')
            ->get(['id', 'title', 'content', 'type', 'is_published', 'published_at', 'created_at']);

        return response()->json(['announcements' => $announcements]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'content' => ['required', 'string', 'max:4000'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $announcement = Announcement::query()->create([
            'title' => trim($data['title']),
            'content' => trim($data['content']),
            'type' => Announcement::TYPE_NEWS,
            'is_published' => (bool)($data['is_published'] ?? true),
            'published_at' => now(),
        ]);

        $this->bustAnnouncementCache();

        return response()->json(['announcement' => $announcement], 201);
    }

    public function update(Request $request, Announcement $announcement): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'content' => ['required', 'string', 'max:4000'],
            'is_published' => ['nullable', 'boolean'],
        ]);

        $announcement->update([
            'title' => trim($data['title']),
            'content' => trim($data['content']),
            'type' => Announcement::TYPE_NEWS,
            'is_published' => (bool)($data['is_published'] ?? true),
            'published_at' => $announcement->published_at ?? now(),
        ]);

        $this->bustAnnouncementCache();

        return response()->json(['announcement' => $announcement->fresh()]);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();
        $this->bustAnnouncementCache();

        return response()->json(['ok' => true]);
    }

    protected function bustAnnouncementCache(): void
    {
        Cache::forget('announcements.public.news');
        Cache::forget('announcements.public.all');
        Cache::forget('announcements.public.career');
    }
}

