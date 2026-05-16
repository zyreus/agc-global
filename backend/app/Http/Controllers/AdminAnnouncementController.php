<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAnnouncementController extends Controller
{
    public function index(): JsonResponse
    {
        $announcements = Announcement::query()
            ->latest('published_at')
            ->latest('id')
            ->get(['id', 'title', 'content', 'is_published', 'published_at', 'created_at']);

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
            'is_published' => (bool)($data['is_published'] ?? true),
            'published_at' => now(),
        ]);

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
            'is_published' => (bool)($data['is_published'] ?? true),
            'published_at' => $announcement->published_at ?? now(),
        ]);

        return response()->json(['announcement' => $announcement->fresh()]);
    }

    public function destroy(Announcement $announcement): JsonResponse
    {
        $announcement->delete();
        return response()->json(['ok' => true]);
    }
}

