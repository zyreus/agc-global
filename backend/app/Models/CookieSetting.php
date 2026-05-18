<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CookieSetting extends Model
{
    protected $fillable = ['settings'];

    protected $casts = [
        'settings' => 'array',
    ];
}
