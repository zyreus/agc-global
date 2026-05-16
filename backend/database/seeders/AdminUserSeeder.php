<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $username = env('ADMIN_USERNAME', 'AGCTekadmin');
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD', 'ACTek_@dm1n');

        AdminUser::query()->updateOrCreate(
            ['username' => $username],
            [
                'email' => $email ?: null,
                'password' => Hash::make($password),
            ]
        );
    }
}

