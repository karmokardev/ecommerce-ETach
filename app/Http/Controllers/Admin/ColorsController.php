<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Color;
use App\Models\PresetColor;
use Illuminate\Http\Request;

class ColorsController extends Controller
{
    public function index()
    {
        $colors = Color::firstOrCreate([], [
            'primary_color' => '#10b981',
            'secondary_color' => '#d946ef',
        ]);

        $presetColors = PresetColor::orderBy('sort_order')
            ->get(['id', 'name', 'value', 'is_active']);

        return inertia('admin/color/index', [
            'colors' => $colors,
            'presetColors' => $presetColors,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'primary_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'secondary_color' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $colors = Color::first();
        if ($colors) {
            $colors->update($validated);
        } else {
            Color::create($validated);
        }

        return back()->with('success', 'Colors updated successfully');
    }
}