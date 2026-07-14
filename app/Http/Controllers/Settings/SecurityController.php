<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class SecurityController extends Controller
{
    /**
     * Show the user's security settings form.
     */
    public function edit()
    {
        $user = Auth::user();

        return inertia('settings/security', [
            'user' => $user,
            'hasTwoFactorEnabled' => ! is_null($user->two_factor_secret),
            'hasPasskeys' => $user->passkeys()->count() > 0,
        ]);
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request)
    {
        $validated = $request->validateWithBag('updatePassword', [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => $validated['password'],
        ]);

        return back()->with('status', 'password-updated');
    }
}
