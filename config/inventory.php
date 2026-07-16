<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Inventory Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration settings for the inventory management system.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Low Stock Threshold
    |--------------------------------------------------------------------------
    |
    | The default threshold for low stock alerts. Variants with stock below
    | this value will be flagged as low stock.
    |
    */
    'low_stock_threshold' => env('INVENTORY_LOW_STOCK_THRESHOLD', 5),

    /*
    |--------------------------------------------------------------------------
    | Allow Negative Stock
    |--------------------------------------------------------------------------
    |
    | Whether to allow stock to go negative. This is generally not recommended
    | as it can lead to overselling. Set to false to prevent negative stock.
    |
    */
    'allow_negative_stock' => env('INVENTORY_ALLOW_NEGATIVE_STOCK', false),

    /*
    |--------------------------------------------------------------------------
    | Auto Generate SKU
    |--------------------------------------------------------------------------
    |
    | Whether to automatically generate SKUs for product variants if not provided.
    |
    */
    'auto_generate_sku' => env('INVENTORY_AUTO_GENERATE_SKU', false),

    /*
    |--------------------------------------------------------------------------
    | SKU Prefix
    |--------------------------------------------------------------------------
    |
    | The prefix to use when auto-generating SKUs.
    |
    */
    'sku_prefix' => env('INVENTORY_SKU_PREFIX', 'SKU-'),

    /*
    |--------------------------------------------------------------------------
    | Stock Movement Types
    |--------------------------------------------------------------------------
    |
    | The different types of stock movements that can occur in the system.
    |
    */
    'movement_types' => [
        'PURCHASE' => 'Purchase',
        'SALE' => 'Sale',
        'RETURN' => 'Return',
        'ADJUSTMENT' => 'Adjustment',
        'TRANSFER_IN' => 'Transfer In',
        'TRANSFER_OUT' => 'Transfer Out',
    ],

    /*
    |--------------------------------------------------------------------------
    | Stock Movement Effects
    |--------------------------------------------------------------------------
    |
    | Whether each movement type increases or decreases stock.
    |
    */
    'movement_effects' => [
        'PURCHASE' => 'increase',
        'SALE' => 'decrease',
        'RETURN' => 'increase',
        'ADJUSTMENT' => 'variable',
        'TRANSFER_IN' => 'increase',
        'TRANSFER_OUT' => 'decrease',
    ],
];
