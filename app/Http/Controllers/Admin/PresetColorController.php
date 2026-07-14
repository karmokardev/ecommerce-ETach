<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PresetColor;
use Illuminate\Http\Request;

class PresetColorController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'value' => ['required', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ]);

        $maxSortOrder = PresetColor::max('sort_order') ?? 0;
        
        PresetColor::create([
            'name' => $validated['name'],
            'value' => $validated['value'],
            'sort_order' => $maxSortOrder + 1,
        ]);

        return back()->with('success', 'Preset color added successfully');
    }

    public function destroy(PresetColor $presetColor)
    {
        $presetColor->delete();
        return back()->with('success', 'Preset color deleted successfully');
    }
}
