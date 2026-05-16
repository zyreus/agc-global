<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;

class AdminNewsletterController extends Controller
{
    public function index(): JsonResponse
    {
        $subscribers = NewsletterSubscriber::query()
            ->latest('subscribed_at')
            ->latest('id')
            ->get(['id', 'name', 'email', 'subscribed_at', 'created_at']);

        return response()->json(['subscribers' => $subscribers]);
    }

    public function destroy(NewsletterSubscriber $subscriber): JsonResponse
    {
        $subscriber->delete();
        return response()->json(['ok' => true]);
    }
}

