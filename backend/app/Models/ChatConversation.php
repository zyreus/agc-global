<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatConversation extends Model
{
    protected $fillable = [
        'session_id',
        'status',
        'archived_at',
        'last_message_at',
    ];

    protected $casts = [
        'archived_at' => 'datetime',
        'last_message_at' => 'datetime',
    ];
}

