<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PresetColor;

class PresetColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['name' => 'Blue', 'value' => '#3b82f6', 'sort_order' => 1],
            ['name' => 'Green', 'value' => '#10b981', 'sort_order' => 2],
            ['name' => 'Purple', 'value' => '#8b5cf6', 'sort_order' => 3],
            ['name' => 'Pink', 'value' => '#ec4899', 'sort_order' => 4],
            ['name' => 'Red', 'value' => '#ef4444', 'sort_order' => 5],
            ['name' => 'Orange', 'value' => '#f97316', 'sort_order' => 6],
            ['name' => 'Yellow', 'value' => '#eab308', 'sort_order' => 7],
            ['name' => 'Teal', 'value' => '#14b8a6', 'sort_order' => 8],
            ['name' => 'Indigo', 'value' => '#6366f1', 'sort_order' => 9],
            ['name' => 'Rose', 'value' => '#f43f5e', 'sort_order' => 10],
            ['name' => 'Cyan', 'value' => '#06b6d4', 'sort_order' => 11],
            ['name' => 'Emerald', 'value' => '#10b981', 'sort_order' => 12],
            ['name' => 'Lime', 'value' => '#84cc16', 'sort_order' => 13],
            ['name' => 'Amber', 'value' => '#f59e0b', 'sort_order' => 14],
            ['name' => 'Violet', 'value' => '#7c3aed', 'sort_order' => 15],
            ['name' => 'Fuchsia', 'value' => '#d946ef', 'sort_order' => 16],
            ['name' => 'Slate', 'value' => '#64748b', 'sort_order' => 17],
            ['name' => 'Zinc', 'value' => '#71717a', 'sort_order' => 18],
            ['name' => 'Neutral', 'value' => '#737373', 'sort_order' => 19],
            ['name' => 'Stone', 'value' => '#78716c', 'sort_order' => 20],
            ['name' => 'Sky', 'value' => '#0ea5e9', 'sort_order' => 21],
            ['name' => 'Coral', 'value' => '#ff6b6b', 'sort_order' => 22],
            ['name' => 'Mint', 'value' => '#4ade80', 'sort_order' => 23],
            ['name' => 'Lavender', 'value' => '#a78bfa', 'sort_order' => 24],
            ['name' => 'Peach', 'value' => '#fb923c', 'sort_order' => 25],
            ['name' => 'Gold', 'value' => '#fbbf24', 'sort_order' => 26],
            ['name' => 'Silver', 'value' => '#9ca3af', 'sort_order' => 27],
            ['name' => 'Maroon', 'value' => '#c026d3', 'sort_order' => 28],
            ['name' => 'Olive', 'value' => '#65a30d', 'sort_order' => 29],
            ['name' => 'Navy', 'value' => '#1e3a8a', 'sort_order' => 30],
            ['name' => 'Brown', 'value' => '#92400e', 'sort_order' => 31],
        ];

        foreach ($colors as $color) {
            PresetColor::create($color);
        }
    }
}
