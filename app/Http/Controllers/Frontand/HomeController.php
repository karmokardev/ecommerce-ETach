<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;
use App\Models\Setting;

class HomeController extends Controller
{
    public function index()
    {
        $sliderImagesJson = Setting::get('hero_slider_images', '[]');
        $sliderImages = json_decode($sliderImagesJson, true) ?: [];
        
        $heroSettings = [
            'slider_images' => $sliderImages,
            'slider_enabled' => Setting::get('hero_slider_enabled', 'false'),
            'auto_slide_interval' => (int) Setting::get('hero_auto_slide_interval', 3000),
        ];

        return inertia('home', [
            'heroSettings' => $heroSettings,
        ]);
    }
}
