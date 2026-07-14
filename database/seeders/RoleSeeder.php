<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        // Assign all permissions to admin role
        $permissions = Permission::all();
        $adminRole->syncPermissions($permissions);

        // Assign basic permissions to user role
        $userRole->givePermissionTo([
            'view posts',
            'create posts',
            'edit posts',
            'delete posts',
        ]);
    }
}
