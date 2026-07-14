<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    /**
     * Display all settings
     */
    public function index()
    {
        return inertia('admin/settings/logo-favicon/index', [
            'settings' => [
                'logo' => Setting::get('logo', '/fabicon.png'),
                'favicon' => Setting::get('favicon', '/favicon.ico'),
                'favicon_svg' => Setting::get('favicon_svg', '/favicon.svg'),
                'apple_touch_icon' => Setting::get('apple_touch_icon', '/apple-touch-icon.png'),
            ]
        ]);
    }

    /**
     * Update settings (bulk update)
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'logo' => 'nullable|image|mimes:png,jpg,jpeg,svg|max:2048',
            'favicon' => 'nullable|image|mimes:ico,png|max:1024',
            'favicon_svg' => 'nullable|image|mimes:svg|max:1024',
            'apple_touch_icon' => 'nullable|image|mimes:png|max:2048',
        ]);

        // Upload and update logo
        if ($request->hasFile('logo')) {
            $this->deleteOldImage('logo');
            $logoPath = $request->file('logo')->store('settings', 'public');
            Setting::set('logo', '/storage/' . $logoPath, 'image');
        }

        // Upload and update favicon
        if ($request->hasFile('favicon')) {
            $this->deleteOldImage('favicon');
            $faviconPath = $request->file('favicon')->store('settings', 'public');
            Setting::set('favicon', '/storage/' . $faviconPath, 'image');
        }

        // Upload and update favicon svg
        if ($request->hasFile('favicon_svg')) {
            $this->deleteOldImage('favicon_svg');
            $faviconSvgPath = $request->file('favicon_svg')->store('settings', 'public');
            Setting::set('favicon_svg', '/storage/' . $faviconSvgPath, 'image');
        }

        // Upload and update apple touch icon
        if ($request->hasFile('apple_touch_icon')) {
            $this->deleteOldImage('apple_touch_icon');
            $appleTouchIconPath = $request->file('apple_touch_icon')->store('settings', 'public');
            Setting::set('apple_touch_icon', '/storage/' . $appleTouchIconPath, 'image');
        }

        return back()->with('success', 'Logo and favicon updated successfully.');
    }

    /**
     * Update individual setting
     */
    public function updateSetting(Request $request, string $key)
    {
        $allowedKeys = ['logo', 'favicon', 'favicon_svg', 'apple_touch_icon'];
        
        if (!in_array($key, $allowedKeys)) {
            return back()->with('error', 'Invalid setting key.');
        }

        $validationRules = [
            'logo' => 'required|image|mimes:png,jpg,jpeg,svg|max:2048',
            'favicon' => 'required|image|mimes:ico,png|max:1024',
            'favicon_svg' => 'required|image|mimes:svg|max:1024',
            'apple_touch_icon' => 'required|image|mimes:png|max:2048',
        ];

        $validated = $request->validate([$key => $validationRules[$key]]);

        if ($request->hasFile($key)) {
            $this->deleteOldImage($key);
            $path = $request->file($key)->store('settings', 'public');
            Setting::set($key, '/storage/' . $path, 'image');
        }

        return back()->with('success', ucfirst(str_replace('_', ' ', $key)) . ' updated successfully.');
    }

    /**
     * Delete individual setting (reset to default)
     */
    public function destroy(string $key)
    {
        $allowedKeys = ['logo', 'favicon', 'favicon_svg', 'apple_touch_icon'];
        
        if (!in_array($key, $allowedKeys)) {
            return back()->with('error', 'Invalid setting key.');
        }

        $this->deleteOldImage($key);

        $defaults = [
            'logo' => '/fabicon.png',
            'favicon' => '/favicon.ico',
            'favicon_svg' => '/favicon.svg',
            'apple_touch_icon' => '/apple-touch-icon.png',
        ];

        Setting::set($key, $defaults[$key], 'image');

        return back()->with('success', ucfirst(str_replace('_', ' ', $key)) . ' reset to default.');
    }

    /**
     * Delete old image file
     */
    private function deleteOldImage(string $key): void
    {
        $oldValue = Setting::get($key);
        
        if ($oldValue && str_starts_with($oldValue, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $oldValue);
            
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }
}
