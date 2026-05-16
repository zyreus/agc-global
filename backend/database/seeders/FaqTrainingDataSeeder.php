<?php

namespace Database\Seeders;

use App\Models\CampaignAutomation;
use App\Models\FaqTrainingData;
use Illuminate\Database\Seeder;

class FaqTrainingDataSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'category' => 'policy',
                'title' => 'Payments',
                'question' => 'How do I make a payment for AGC services?',
                'answer' => 'Project billing is agreed in your statement of work or contract. For payment methods, currency, and schedules, a billing specialist will confirm details with you during onboarding. I can connect you with our team if you share your project reference.',
                'keywords' => 'payment,invoice,billing,pay',
                'priority' => 20,
            ],
            [
                'category' => 'policy',
                'title' => 'Loans & financing',
                'question' => 'Do you offer loans or consumer financing?',
                'answer' => 'AGC provides technology and business solutions; we do not originate loans or provide regulated financial advice. For financing questions related to a vendor arrangement, a specialist can review your situation and suggest appropriate next steps.',
                'keywords' => 'loan,financing,mortgage,credit',
                'priority' => 30,
            ],
            [
                'category' => 'support',
                'title' => 'Human support',
                'question' => 'Can I speak to a person?',
                'answer' => 'Yes. Use the “Talk to Representative” option in the chat widget, or email agc.billing2026@gmail.com or call +63 9190675099 with your request.',
                'keywords' => 'human,agent,person,live',
                'priority' => 25,
            ],
            [
                'category' => 'services',
                'title' => 'Services overview',
                'question' => 'What does AGC build?',
                'answer' => 'AGC delivers IT solutions & system development, software development (including Laravel/PHP and UI/UX), business solutions (automation, data, analytics), and security & maintenance.',
                'keywords' => 'services,build,development',
                'priority' => 10,
            ],
        ];

        foreach ($items as $row) {
            FaqTrainingData::query()->firstOrCreate(
                ['question' => $row['question']],
                array_merge($row, ['is_active' => true])
            );
        }

        CampaignAutomation::query()->firstOrCreate(
            ['name' => 'Lead nurture (configure Brevo template)'],
            [
                'trigger' => 'lead_submitted',
                'brevo_template_id' => null,
                'brevo_list_id' => null,
                'segment_filter' => ['segment' => 'lead'],
                'schedule_config' => ['note' => 'Wire to Brevo automation after template ID is set'],
                'is_active' => false,
            ]
        );
    }
}
