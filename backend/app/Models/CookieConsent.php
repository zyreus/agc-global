<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CookieConsent extends Model
{
    protected $fillable = [
        'visitor_id',
        'consent_version',
        'action',
        'categories',
        'region',
        'ip_hash',
        'user_agent',
    ];

    protected $casts = [
        'categories' => 'array',
    ];
}
