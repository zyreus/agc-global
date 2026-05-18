<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\ChatConversation;
use App\Models\ChatLead;
use App\Models\ChatMessage;
use App\Models\FeedbackEntry;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminPortalController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        // Align dashboard stats with Chat & CRM:
        // - only active (not archived) conversations
        // - only incoming customer messages (role = user)
        $activeSessionIds = ChatConversation::query()
            ->whereNull('archived_at')
            ->pluck('session_id');

        $totalSessions = $activeSessionIds->count();

        $totalMessages = ChatMessage::query()
            ->whereIn('session_id', $activeSessionIds)
            ->where('role', 'user')
            ->count();

        $messagesToday = ChatMessage::query()
            ->whereIn('session_id', $activeSessionIds)
            ->where('role', 'user')
            ->whereDate('created_at', now()->toDateString())
            ->count();

        $recentMessages = ChatMessage::query()
            ->whereIn('session_id', $activeSessionIds)
            ->where('role', 'user')
            ->latest()
            ->limit(20)
            ->get(['id', 'session_id', 'role', 'message', 'created_at']);

        return response()->json([
            'stats' => [
                'total_messages' => $totalMessages,
                'total_sessions' => $totalSessions,
                'messages_today' => $messagesToday,
                'total_leads' => ChatLead::query()->count(),
                'total_feedback' => FeedbackEntry::query()->count(),
                'total_announcements' => Announcement::query()->count(),
                'total_subscribers' => NewsletterSubscriber::query()->count(),
                'published_careers' => Announcement::query()
                    ->where('is_published', true)
                    ->where('type', Announcement::TYPE_CAREER)
                    ->count(),
                'published_news' => Announcement::query()
                    ->where('is_published', true)
                    ->where('type', Announcement::TYPE_NEWS)
                    ->count(),
            ],
            'recent_messages' => $recentMessages,
        ]);
    }
}
