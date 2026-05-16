<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedbackEntry extends Model
{
    protected $fillable = [
        'conversation_id',
        'rating',
        'name',
        'email',
        'comment',
    ];
}

