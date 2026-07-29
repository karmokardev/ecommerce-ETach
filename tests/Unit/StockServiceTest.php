<?php

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Warehouse;
use App\Services\StockService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

beforeEach(function () {
    // Create a warehouse
    $this->warehouse = Warehouse::factory()->create();
    
    // Create a product
    $this->product = Product::factory()->create();
    
    // Create a variant with initial stock
    $this->variant = ProductVariant::factory()->create([
        'product_id' => $this->product->id,
        'current_stock' => 10,
    ]);
    
    $this->stockService = new StockService();
});

test('it prevents overselling with concurrent sales', function () {
    $initialStock = $this->variant->current_stock;
    expect($initialStock)->toBe(10);

    // Simulate two concurrent sales
    $exceptionThrown = false;
    $successfulSaleCount = 0;

    try {
        // First sale: 7 items
        DB::transaction(function () use (&$successfulSaleCount) {
            $this->stockService->processSale(
                $this->variant,
                7,
                $this->warehouse
            );
            $successfulSaleCount++;
        });

        // Second sale: 5 items (should fail because only 3 left)
        DB::transaction(function () use (&$successfulSaleCount) {
            $this->stockService->processSale(
                $this->variant,
                5,
                $this->warehouse
            );
            $successfulSaleCount++;
        });
    } catch (\Exception $e) {
        $exceptionThrown = true;
    }

    // Verify only one sale succeeded
    expect($successfulSaleCount)->toBe(1);
    expect($exceptionThrown)->toBe(true);

    // Refresh variant from database
    $this->variant->refresh();
    
    // Verify stock is not negative
    expect($this->variant->current_stock)->toBeGreaterThanOrEqual(0);
    expect($this->variant->current_stock)->toBe(3);
});

test('it allows multiple concurrent sales within stock limit', function () {
    $initialStock = $this->variant->current_stock;
    expect($initialStock)->toBe(10);

    // Two concurrent sales: 3 items each
    DB::transaction(function () {
        $this->stockService->processSale(
            $this->variant,
            3,
            $this->warehouse
        );
    });

    DB::transaction(function () {
        $this->stockService->processSale(
            $this->variant,
            3,
            $this->warehouse
        );
    });

    // Refresh variant from database
    $this->variant->refresh();
    
    // Verify stock is correct: 10 - 3 - 3 = 4
    expect($this->variant->current_stock)->toBe(4);
});

test('it handles concurrent purchase and sale', function () {
    $initialStock = $this->variant->current_stock;
    expect($initialStock)->toBe(10);

    // Purchase: add 5 items
    DB::transaction(function () {
        $this->stockService->increaseStock(
            $this->variant,
            5,
            $this->warehouse,
            'PURCHASE'
        );
    });

    // Sale: subtract 7 items
    DB::transaction(function () {
        $this->stockService->processSale(
            $this->variant,
            7,
            $this->warehouse
        );
    });

    // Refresh variant from database
    $this->variant->refresh();
    
    // Verify stock is correct: 10 + 5 - 7 = 8
    expect($this->variant->current_stock)->toBe(8);
});

test('it records stock movement history', function () {
    $this->stockService->processSale(
        $this->variant,
        3,
        $this->warehouse
    );

    $movements = $this->variant->stockMovements;
    
    expect($movements)->toHaveCount(1);
    expect($movements->first()->type)->toBe('SALE');
    expect($movements->first()->quantity)->toBe(-3);
    expect($movements->first()->before_stock)->toBe(10);
    expect($movements->first()->after_stock)->toBe(7);
});
