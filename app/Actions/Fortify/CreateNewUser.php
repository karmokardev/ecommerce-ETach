<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        // Generate username from name if not provided
        $username = $input['username'] ?? strtolower(str_replace(' ', '', $input['name']));

        return User::create([
            'name' => $input['name'],
            'username' => $username,
            'email' => $input['email'],
            'password' => $input['password'],
            'status' => 'active',
        ]);
    }
}
