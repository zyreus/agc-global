<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
        ]);

        NewsletterSubscriber::query()->updateOrCreate(
            ['email' => strtolower(trim($data['email']))],
            [
                'name' => isset($data['name']) ? trim($data['name']) : null,
                'subscribed_at' => now(),
            ]
        );

        return response()->json([
            'ok' => true,
            'message' => 'You are now subscribed to AGC updates.',
        ]);
    }
}

