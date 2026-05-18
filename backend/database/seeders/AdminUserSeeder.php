<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'username' => env('ADMIN_USERNAME', 'AGCTekadmin'),
                'email' => env('ADMIN_EMAIL'),
                'password' => env('ADMIN_PASSWORD', 'ACTek_@dm1n'),
            ],
        ];

        if (app()->environment('local')) {
            $accounts[] = [
                'username' => 'admin',
                'email' => 'admin@agc.local',
                'password' => 'admin123',
            ];
        }

        foreach ($accounts as $account) {
            AdminUser::query()->updateOrCreate(
                ['username' => $account['username']],
                [
                    'email' => $account['email'] ?: null,
                    'password' => Hash::make($account['password']),
                ]
            );
        }
    }
}

