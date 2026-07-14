<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    $membershipType = \App\Models\MembershipType::first();
    if (!$membershipType) {
        echo "No membership type found. Creating one...\n";
        $membershipType = \App\Models\MembershipType::create(['name' => 'general']);
    }
    echo "Using membership type ID: " . $membershipType->id . "\n";

    $user = \App\Models\User::create([
        'username' => 'testuser_' . time(),
        'email' => 'test' . time() . '@example.com',
        'phone' => '01' . rand(700000000, 999999999),
        'password' => bcrypt('password123'),
        'status' => 'active',
    ]);
    $user->assignRole('member');
    echo "User created: " . $user->id . "\n";

    $detail = \App\Models\Detail::create([
        'user_id' => $user->id,
        'full_name' => 'Test User',
        'date_of_birth' => '1990-01-01',
        'gender' => 'male',
    ]);
    echo "Detail created: " . $detail->id . "\n";

    $address = \App\Models\Address::create([
        'user_id' => $user->id,
    ]);
    echo "Address created: " . $address->id . "\n";

    $emergencyContact = \App\Models\Contact::create([
        'user_id' => $user->id,
        'identifier' => 'em_phone',
        'value' => '01798765432',
    ]);
    echo "Emergency contact created: " . $emergencyContact->id . "\n";

    \App\Models\ContactPerson::create([
        'address_id' => $address->id,
        'contact_id' => $emergencyContact->id,
        'name' => 'Emergency Contact',
    ]);
    echo "Contact person created\n";

    $identity = \App\Models\Identity::create([
        'user_id' => $user->id,
        'type' => 'driving_licence',
        'number' => 'TEST' . time(),
    ]);
    echo "Identity created: " . $identity->id . "\n";

    $membership = \App\Models\Membership::create([
        'user_id' => $user->id,
        'membership_type_id' => $membershipType->id,
        'identity_number' => 'TEST' . time(),
        'joining_date' => now(),
        'status' => 'active',
        'approval_status' => 'pending',
    ]);
    echo "Membership created: " . $membership->id . "\n";

    echo "SUCCESS: Test registration completed!\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ':' . $e->getLine() . "\n";
}
