<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $colors = \App\Models\Color::first();

        // Get wishlist count for authenticated users
        $wishlistCount = 0;
        if ($request->user()) {
            $wishlistCount = \App\Models\Wishlist::where('user_id', $request->user()->id)->count();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'colors' => [
                'primary' => $colors?->primary_color ?? '#10b981',
                'secondary' => $colors?->secondary_color ?? '#d946ef',
            ],
            'wishlist' => [
                'count' => $wishlistCount,
            ],
            'settings' => [
                'logo' => \App\Models\Setting::get('logo', '/fabicon.png'),
                'favicon' => \App\Models\Setting::get('favicon', '/favicon.ico'),
                'favicon_svg' => \App\Models\Setting::get('favicon_svg', '/favicon.svg'),
                'apple_touch_icon' => \App\Models\Setting::get('apple_touch_icon', '/apple-touch-icon.png'),
                'footer' => [
                    'company_name' => \App\Models\Setting::get('footer_company_name', 'HRidoy'),
                    'company_tagline' => \App\Models\Setting::get('footer_company_tagline'),
                    'company_description' => \App\Models\Setting::get('footer_company_description', 'Nexuas Driving Instructor Foundation is dedicated to promoting safe driving skills and responsible road behavior. Learn safe, drive safe, save lives—empowering individuals for a safer and smarter driving future.'),
                    'email' => \App\Models\Setting::get('footer_email', 'presidenthridoy@gmail.com'),
                    'phone' => \App\Models\Setting::get('footer_phone', '+880 1794 587824'),
                    'address' => \App\Models\Setting::get('footer_address', 'Flat 5-A, house 763B Monipur, Borobag, Mirpur-2, Dhaka-1216.'),
                    'social_links' => json_decode(\App\Models\Setting::get('footer_social_links', '[]'), true) ?: [],
                    'sections' => json_decode(\App\Models\Setting::get('footer_sections', '[]'), true) ?: [],
                    'copyright' => [
                        'developer_name' => \App\Models\Setting::get('footer_developer_name', 'Ongsho'),
                        'developer_link' => \App\Models\Setting::get('footer_developer_link', 'https://ongsho.com/'),
                    ],
                    'logo' => \App\Models\Setting::get('footer_logo', '/logo.png'),
                ],
            ],
        ];
    }

    public function rootView(Request $request): string
    {
        $colors = \App\Models\Color::first();
        \Illuminate\Support\Facades\View::share('colors', [
            'primary' => $colors?->primary_color ?? '#10b981',
            'secondary' => $colors?->secondary_color ?? '#d946ef',
        ]);

        \Illuminate\Support\Facades\View::share('settings', [
            'logo' => \App\Models\Setting::get('logo', '/fabicon.png'),
            'favicon' => \App\Models\Setting::get('favicon', '/favicon.ico'),
            'favicon_svg' => \App\Models\Setting::get('favicon_svg', '/favicon.svg'),
            'apple_touch_icon' => \App\Models\Setting::get('apple_touch_icon', '/apple-touch-icon.png'),
        ]);

        return parent::rootView($request);
    }
}
