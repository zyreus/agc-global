<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignAutomation extends Model
{
    protected $table = 'campaign_automations';

    protected $fillable = [
        'name',
        'brevo_template_id',
        'brevo_list_id',
        'trigger',
        'segment_filter',
        'schedule_config',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'segment_filter' => 'array',
        'schedule_config' => 'array',
    ];
}
