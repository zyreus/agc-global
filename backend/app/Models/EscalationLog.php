<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EscalationLog extends Model
{
    protected $fillable = [
        'session_id',
        'reason',
        'triggered_by',
        'context',
    ];

    protected $casts = [
        'context' => 'array',
    ];
}
