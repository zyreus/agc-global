<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatLead extends Model
{
    protected $fillable = [
        'session_id',
        'name',
        'email',
        'phone',
        'company',
        'concern',
        'status',
        'archived_at',
    ];

    protected $casts = [
        'archived_at' => 'datetime',
    ];
}

