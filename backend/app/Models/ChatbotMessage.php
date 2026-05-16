<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatbotMessage extends Model
{
    protected $fillable = [
        'session_id',
        'chat_message_id',
        'detected_intent',
        'intent_confidence',
        'uncertain',
        'escalate_triggered',
        'model_used',
        'response_tokens',
    ];

    protected $casts = [
        'uncertain' => 'boolean',
        'escalate_triggered' => 'boolean',
    ];

    public function chatMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class);
    }
}
