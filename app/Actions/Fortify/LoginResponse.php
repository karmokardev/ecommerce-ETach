<?php

namespace App\Actions\Fortify;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = $request->user();

        // Admin goes to dashboard
        if ($user && $user->hasRole('admin')) {
            return redirect()->intended('/dashboard');
        }

        // Regular users go to landing page
        return redirect()->intended('/');
    }
}
