<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class FilamentAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('FILAMENT_ADMIN_EMAIL', 'admin@agc.test');
        $password = env('FILAMENT_ADMIN_PASSWORD', 'Admin123!');

        User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => env('FILAMENT_ADMIN_NAME', 'Admin'),
                'password' => Hash::make($password),
            ]
        );
    }
}

