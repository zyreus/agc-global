<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatbotConversation extends Model
{
    protected $fillable = [
        'session_id',
        'channel',
        'customer_profile_id',
        'segment',
        'last_detected_intent',
        'escalation_requested_at',
        'metadata',
    ];

    protected $casts = [
        'escalation_requested_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function customerProfile(): BelongsTo
    {
        return $this->belongsTo(CustomerProfile::class);
    }
}
