<?php

namespace App\Http\Controllers;

use App\Models\FeedbackEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'conversation_id' => ['required', 'string', 'max:120'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'comment' => ['required', 'string', 'max:2000'],
        ]);

        FeedbackEntry::create($data);

        return response()->json(['ok' => true]);
    }
}

