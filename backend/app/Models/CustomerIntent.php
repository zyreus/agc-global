<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerIntent extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'session_id',
        'chat_message_id',
        'intent_label',
        'confidence',
        'source',
        'created_at',
    ];

    public function chatMessage(): BelongsTo
    {
        return $this->belongsTo(ChatMessage::class);
    }
}
