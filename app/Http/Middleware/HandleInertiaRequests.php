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
            'settings' => [
                'logo' => \App\Models\Setting::get('logo', '/fabicon.png'),
                'favicon' => \App\Models\Setting::get('favicon', '/favicon.ico'),
                'favicon_svg' => \App\Models\Setting::get('favicon_svg', '/favicon.svg'),
                'apple_touch_icon' => \App\Models\Setting::get('apple_touch_icon', '/apple-touch-icon.png'),
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
