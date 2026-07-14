<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default logo and favicon settings
        Setting::firstOrCreate(
            ['key' => 'logo'],
            ['value' => '/fabicon.png', 'type' => 'image', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'favicon'],
            ['value' => '/favicon.ico', 'type' => 'image', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'favicon_svg'],
            ['value' => '/favicon.svg', 'type' => 'image', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'apple_touch_icon'],
            ['value' => '/apple-touch-icon.png', 'type' => 'image', 'status' => 'active']
        );

        // General site settings
        Setting::firstOrCreate(
            ['key' => 'site_name'],
            ['value' => 'My Website', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'site_description'],
            ['value' => 'Welcome to my website', 'type' => 'textarea', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'site_keywords'],
            ['value' => 'website, blog, portfolio', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'contact_email'],
            ['value' => 'contact@example.com', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'contact_phone'],
            ['value' => '+1234567890', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'social_facebook'],
            ['value' => 'https://facebook.com', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'social_twitter'],
            ['value' => 'https://twitter.com', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'social_instagram'],
            ['value' => 'https://instagram.com', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'social_linkedin'],
            ['value' => 'https://linkedin.com', 'type' => 'text', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'maintenance_mode'],
            ['value' => 'false', 'type' => 'boolean', 'status' => 'active']
        );

        Setting::firstOrCreate(
            ['key' => 'registration_enabled'],
            ['value' => 'true', 'type' => 'boolean', 'status' => 'active']
        );
    }
}
