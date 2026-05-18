<?php

namespace Database\Seeders;

use App\Models\Announcement;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'type' => 'news',
                'title' => 'Software Developer (Mid-level)',
                'content' => 'We are expanding our delivery team for Laravel, React, and API integration work. Reach out via the contact form with subject “Project inquiry” for partnership and engagement models.',
            ],
            [
                'type' => 'news',
                'title' => 'AGC Project Consultation Slots Open',
                'content' => 'We are accepting new project consultations for web applications, API integrations, and business systems this month.',
            ],
            [
                'type' => 'news',
                'title' => 'System Maintenance Advisory',
                'content' => 'Scheduled maintenance window every Sunday 1:00 AM to 3:00 AM PHT for infrastructure updates and security checks.',
            ],
        ];

        foreach ($items as $item) {
            Announcement::query()->create([
                'title' => $item['title'],
                'content' => $item['content'],
                'type' => $item['type'],
                'is_published' => true,
                'published_at' => now(),
            ]);
        }
    }
}

