<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ======================
        // 1. SINGLE ADMIN
        // ======================
        $admin = User::factory()->create([
            'username' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('12345678'),
        ]);

        $admin->assignRole('admin');

        // ======================
        // 2. REGULAR USERS (10 users)
        // ======================
        for ($i = 1; $i <= 10; $i++) {
            $user = User::factory()->create([
                'username' => 'User ' . $i,
                'email' => 'user' . $i . '@gmail.com',
                'password' => bcrypt('12345678'),
            ]);

            $user->assignRole('user');
        }
    }
}
