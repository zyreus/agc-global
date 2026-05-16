<?php

namespace App\Http\Controllers;

use App\Models\ChatConversation;
use App\Models\ChatMessage;
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
            ],
            'recent_messages' => $recentMessages,
        ]);
    }
}
