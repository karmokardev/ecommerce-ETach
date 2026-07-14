<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->hasRole('admin')) {
            return inertia('dashboard', [
                'user' => $user,
                'role' => 'admin',
                'users' => User::with('roles')->get(),
                'stats' => [
                    'admin' => User::role('admin')->count(),
                    'user' => User::role('user')->count(),
                ]
            ]);
        }

        // Default for regular users
        return inertia('dashboard', [
            'user' => $user,
            'role' => 'user',
        ]);
    }

    public function users()
    {
        $users = User::with('roles')->get();

        return inertia('users', [
            'users' => $users,
        ]);
    }
}
