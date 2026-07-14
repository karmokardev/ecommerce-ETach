<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;
use App\Models\Detail;
use App\Models\Address;
use App\Models\Contact;
use App\Models\Identity;
use App\Models\Profession;
use App\Models\Education;
use App\Models\Membership;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['username', 'phone', 'password', 'status'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable, HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function detail()
    {
        return $this->hasOne(Detail::class);
    }

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function contactPeople()
    {
        return $this->hasManyThrough(ContactPerson::class, Contact::class);
    }

    public function identity()
    {
        return $this->hasOne(Identity::class);
    }

    public function profession()
    {
        return $this->hasOne(Profession::class);
    }

    public function education()
    {
        return $this->hasOne(Education::class);
    }

    public function membership()
    {
        return $this->hasOne(Membership::class);
    }
}
