<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteSettingsController extends Controller
{
    /**
     * Display all site settings
     */
    public function index()
    {
        $settings = Setting::all()->keyBy('key');
        
        return inertia('admin/settings/general/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Store a new setting
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:settings,key',
            'value' => 'required|string',
            'type' => 'required|in:text,number,boolean,json,image,file,textarea',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $validated['status'] = $validated['status'] ?? 'active';

        Setting::create($validated);

        return back()->with('success', 'Setting created successfully.');
    }

    /**
     * Update a setting
     */
    public function update(Request $request, string $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        $validated = $request->validate([
            'value' => 'required|string',
            'type' => 'sometimes|in:text,number,boolean,json,image,file,textarea',
            'status' => 'sometimes|in:active,inactive',
        ]);

        // Handle image upload if type is image
        if ($setting->type === 'image' || (isset($validated['type']) && $validated['type'] === 'image')) {
            if ($request->hasFile('value')) {
                $this->deleteOldImage($key);
                $path = $request->file('value')->store('settings', 'public');
                $validated['value'] = '/storage/' . $path;
            }
        }

        // Handle file upload if type is file
        if ($setting->type === 'file' || (isset($validated['type']) && $validated['type'] === 'file')) {
            if ($request->hasFile('value')) {
                $this->deleteOldImage($key);
                $path = $request->file('value')->store('settings', 'public');
                $validated['value'] = '/storage/' . $path;
            }
        }

        $setting->update($validated);

        return back()->with('success', 'Setting updated successfully.');
    }

    /**
     * Delete a setting
     */
    public function destroy(string $key)
    {
        $setting = Setting::where('key', $key)->firstOrFail();

        // Delete image file if exists
        if ($setting->type === 'image' && str_starts_with($setting->value, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $setting->value);
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $setting->delete();

        return back()->with('success', 'Setting deleted successfully.');
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

    /**
     * Display typography settings
     */
    public function typography()
    {
        $defaultSettings = [
            'bangla' => [
                'font_family' => "'Hind Siliguri', sans-serif",
                'font_size' => '16px',
                'font_weight' => '400',
                'color' => '#1a1a1a',
                'line_height' => '1.6',
                'letter_spacing' => '0px',
            ],
            'english' => [
                'font_family' => "'Inter', sans-serif",
                'font_size' => '16px',
                'font_weight' => '400',
                'color' => '#333333',
                'line_height' => '1.5',
                'letter_spacing' => '0px',
            ],
        ];

        $savedSettings = Setting::where('key', 'typography_settings')->first();
        $settings = $savedSettings ? json_decode($savedSettings->value, true) : $defaultSettings;
        
        return inertia('admin/settings/typography/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update typography settings
     */
    public function updateTypography(Request $request)
    {
        $validated = $request->validate([
            'font_settings' => 'required|array',
            'font_settings.bangla' => 'required|array',
            'font_settings.bangla.font_family' => 'required|string',
            'font_settings.bangla.font_size' => 'required|string',
            'font_settings.bangla.font_weight' => 'required|string',
            'font_settings.bangla.color' => 'required|string',
            'font_settings.bangla.line_height' => 'required|string',
            'font_settings.bangla.letter_spacing' => 'required|string',
            'font_settings.english' => 'required|array',
            'font_settings.english.font_family' => 'required|string',
            'font_settings.english.font_size' => 'required|string',
            'font_settings.english.font_weight' => 'required|string',
            'font_settings.english.color' => 'required|string',
            'font_settings.english.line_height' => 'required|string',
            'font_settings.english.letter_spacing' => 'required|string',
        ]);

        Setting::updateOrCreate(
            ['key' => 'typography_settings'],
            [
                'value' => json_encode($validated['font_settings']),
                'type' => 'json',
                'status' => 'active',
            ]
        );

        return back()->with('success', 'Typography settings updated successfully.');
    }

    /**
     * Display footer settings
     */
    public function footer()
    {
        $settings = [
            'company_name' => Setting::get('footer_company_name', 'HRidoy'),
            'company_tagline' => Setting::get('footer_company_tagline'),
            'company_description' => Setting::get('footer_company_description', 'Nexuas Driving Instructor Foundation is dedicated to promoting safe driving skills and responsible road behavior. Learn safe, drive safe, save lives—empowering individuals for a safer and smarter driving future.'),
            'email' => Setting::get('footer_email', 'presidenthridoy@gmail.com'),
            'phone' => Setting::get('footer_phone', '+880 1794 587824'),
            'address' => Setting::get('footer_address', 'Flat 5-A, house 763B Monipur, Borobag, Mirpur-2, Dhaka-1216.'),
            'social_links' => json_decode(Setting::get('footer_social_links', '[]'), true) ?: [],
            'sections' => json_decode(Setting::get('footer_sections', '[]'), true) ?: [],
            
            'copyright' => [
                'developer_name' => Setting::get('footer_developer_name', 'Ongsho'),
                'developer_link' => Setting::get('footer_developer_link', 'https://ongsho.com/'),
            ],
            'logo' => Setting::get('footer_logo', '/logo.png'),
        ];
        
        return inertia('admin/settings/footer/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update footer settings
     */
    public function updateFooter(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'company_tagline' => 'nullable|string|max:255',
            'company_description' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'social_links' => 'nullable|array',
            'social_links.*.platform' => 'nullable|string|max:255',
            'social_links.*.href' => 'nullable|url|max:255',
            'sections' => 'nullable|array',
            'sections.*.title' => 'nullable|string|max:255',
            'sections.*.links' => 'nullable|array',
            'sections.*.links.*.label' => 'nullable|string|max:255',
            'sections.*.links.*.href' => 'nullable|string|max:255',
            'copyright' => 'nullable|array',
            'copyright.developer_name' => 'nullable|string|max:255',
            'copyright.developer_link' => 'nullable|url|max:255',
            'logo' => 'nullable|string|max:255',
        ]);

        // Save each setting
        Setting::updateOrCreate(
            ['key' => 'footer_company_name'],
            ['value' => $validated['company_name'] ?? 'HRidoy', 'type' => 'text', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_company_tagline'],
            ['value' => $validated['company_tagline'] ?? '', 'type' => 'text', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_company_description'],
            ['value' => $validated['company_description'] ?? 'Nexuas Driving Instructor Foundation is dedicated to promoting safe driving skills and responsible road behavior. Learn safe, drive safe, save lives—empowering individuals for a safer and smarter driving future.', 'type' => 'textarea', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_email'],
            ['value' => $validated['email'] ?? 'presidenthridoy@gmail.com', 'type' => 'text', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_phone'],
            ['value' => $validated['phone'] ?? '+880 1794 587824', 'type' => 'text', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_address'],
            ['value' => $validated['address'] ?? 'Flat 5-A, house 763B Monipur, Borobag, Mirpur-2, Dhaka-1216.', 'type' => 'textarea', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_social_links'],
            ['value' => json_encode($validated['social_links'] ?? []), 'type' => 'json', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_sections'],
            ['value' => json_encode($validated['sections'] ?? []), 'type' => 'json', 'status' => 'active']
        );

        // Copyright settings
        Setting::updateOrCreate(
            ['key' => 'footer_developer_name'],
            ['value' => $validated['copyright']['developer_name'] ?? 'Ongsho', 'type' => 'text', 'status' => 'active']
        );

        Setting::updateOrCreate(
            ['key' => 'footer_developer_link'],
            ['value' => $validated['copyright']['developer_link'] ?? 'https://ongsho.com/', 'type' => 'text', 'status' => 'active']
        );

        // Logo setting
        Setting::updateOrCreate(
            ['key' => 'footer_logo'],
            ['value' => $validated['logo'] ?? '/logo.png', 'type' => 'text', 'status' => 'active']
        );

        return back()->with('success', 'Footer settings updated successfully.');
    }

    /**
     * Display hero settings
     */
    public function hero()
    {
        $sliderImagesJson = Setting::get('hero_slider_images', '[]');
        $sliderImages = json_decode($sliderImagesJson, true) ?: [];
        
        $settings = [
            'slider_images' => $sliderImages,
            'slider_enabled' => Setting::get('hero_slider_enabled', 'false'),
            'auto_slide_interval' => (int) Setting::get('hero_auto_slide_interval', 3000),
        ];
        
        return inertia('admin/settings/hero/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update hero settings
     */
    public function updateHero(Request $request)
    {
        $sliderEnabled = $request->input('slider_enabled');
        $autoSlideInterval = $request->input('auto_slide_interval');
        $sliderImagesJson = $request->input('slider_images');

        // Save slider enabled
        if ($sliderEnabled !== null) {
            Setting::updateOrCreate(
                ['key' => 'hero_slider_enabled'],
                ['value' => $sliderEnabled, 'type' => 'boolean', 'status' => 'active']
            );
        }

        // Save auto slide interval
        if ($autoSlideInterval !== null) {
            Setting::updateOrCreate(
                ['key' => 'hero_auto_slide_interval'],
                ['value' => $autoSlideInterval, 'type' => 'number', 'status' => 'active']
            );
        }

        // Save slider images
        if ($sliderImagesJson !== null) {
            Setting::updateOrCreate(
                ['key' => 'hero_slider_images'],
                ['value' => $sliderImagesJson, 'type' => 'json', 'status' => 'active']
            );
        }

        return back()->with('success', 'Hero settings updated successfully.');
    }

    /**
     * Upload hero slider image
     */
    public function uploadHeroImage(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $path = $request->file('image')->store('hero-slider', 'public');
        $imageUrl = '/storage/' . $path;

        return response()->json([
            'image_url' => $imageUrl,
        ]);
    }

    /**
     * Delete hero banner image
     */
    public function deleteHeroBannerImage()
    {
        $this->deleteOldHeroBannerImage();
        
        $setting = Setting::where('key', 'hero_banner_image')->first();
        if ($setting) {
            $setting->delete();
        }

        return back()->with('success', 'Banner image deleted successfully.');
    }

    /**
     * Delete old hero banner image file
     */
    private function deleteOldHeroBannerImage(): void
    {
        $oldValue = Setting::get('hero_banner_image');
        
        if ($oldValue && str_starts_with($oldValue, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $oldValue);
            
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
    }
}
