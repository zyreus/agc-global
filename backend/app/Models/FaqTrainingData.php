<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FaqTrainingData extends Model
{
    protected $table = 'faq_training_data';

    protected $fillable = [
        'category',
        'title',
        'question',
        'answer',
        'keywords',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
