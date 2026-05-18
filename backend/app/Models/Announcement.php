<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    public const TYPE_NEWS = 'news';

    /** @deprecated Legacy DB values only; new records use {@see TYPE_NEWS}. */
    public const TYPE_CAREER = 'career';

    protected $fillable = [
        'title',
        'content',
        'type',
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];
}

