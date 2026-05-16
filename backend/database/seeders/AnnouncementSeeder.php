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
                'title' => 'AGC Project Consultation Slots Open',
                'content' => 'We are accepting new project consultations for web applications, API integrations, and business systems this month.',
            ],
            [
                'title' => 'System Maintenance Advisory',
                'content' => 'Scheduled maintenance window every Sunday 1:00 AM to 3:00 AM PHT for infrastructure updates and security checks.',
            ],
            [
                'title' => 'Digital Transformation Workshops',
                'content' => 'AGC now offers short workshops on process automation, reporting dashboards, and scalable system planning.',
            ],
        ];

        foreach ($items as $item) {
            Announcement::query()->create([
                'title' => $item['title'],
                'content' => $item['content'],
                'is_published' => true,
                'published_at' => now(),
            ]);
        }
    }
}

