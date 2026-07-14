<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // User management permissions
        Permission::firstOrCreate(['name' => 'view users', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'create users', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'edit users', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'delete users', 'guard_name' => 'web']);

        // Role management permissions
        Permission::firstOrCreate(['name' => 'view roles', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'create roles', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'edit roles', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'delete roles', 'guard_name' => 'web']);

        // Permission management permissions
        Permission::firstOrCreate(['name' => 'view permissions', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'create permissions', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'edit permissions', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'delete permissions', 'guard_name' => 'web']);

        // Post management permissions
        Permission::firstOrCreate(['name' => 'view posts', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'create posts', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'edit posts', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'delete posts', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'publish posts', 'guard_name' => 'web']);

        // Settings permissions
        Permission::firstOrCreate(['name' => 'view settings', 'guard_name' => 'web']);
        Permission::firstOrCreate(['name' => 'edit settings', 'guard_name' => 'web']);

        // Dashboard access
        Permission::firstOrCreate(['name' => 'access dashboard', 'guard_name' => 'web']);
    }
}
