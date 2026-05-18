<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerformanceLog extends Model
{
    protected $fillable = ['event', 'actor', 'meta'];

    protected $casts = [
        'meta' => 'array',
    ];
}
