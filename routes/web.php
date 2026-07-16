<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ColorsController;
use App\Http\Controllers\Admin\PresetColorController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SiteSettingsController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\AttributeController;
use App\Http\Controllers\Admin\AttributeValueController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\StockAdjustmentController;
use App\Http\Controllers\Admin\StockTransferController;
use App\Http\Controllers\Frontand\HomeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MembershipController;
use App\Http\Controllers\Admin\MembershipApprovalController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::get('/', [HomeController::class, 'index'])->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::inertia('dashboard', 'dashboard')->name('dashboard');
// });
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // users - admin only
    Route::middleware(['admin'])->group(function () {
        Route::get('/users', [UsersController::class, 'index'])->name('users');
        Route::get('/users/{user}/edit', [UsersController::class, 'edit'])->name('users.edit');
        Route::put('/users/{user}', [UsersController::class, 'update'])->name('users.update');
        Route::patch('/users/{user}/status', [UsersController::class, 'updateStatus'])->name('users.status');
        Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');

        // roles - admin only
        Route::get('/roles', [RoleController::class, 'index'])->name('roles');
        Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
        Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
        Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('roles.edit');
        Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update');
        Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');

        // permissions - admin only
        Route::get('/permissions', [PermissionController::class, 'index'])->name('permissions');
        Route::get('/permissions/create', [PermissionController::class, 'create'])->name('permissions.create');
        Route::post('/permissions', [PermissionController::class, 'store'])->name('permissions.store');
        Route::get('/permissions/{permission}/edit', [PermissionController::class, 'edit'])->name('permissions.edit');
        Route::put('/permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
        Route::delete('/permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');

        // colors - admin only
        Route::get('/colors', [ColorsController::class, 'index'])->name('colors');
        Route::put('/colors', [ColorsController::class, 'update'])->name('colors.update');
        
        // preset colors - admin only
        Route::post('/preset-colors', [PresetColorController::class, 'store'])->name('preset-colors.store');
        Route::delete('/preset-colors/{presetColor}', [PresetColorController::class, 'destroy'])->name('preset-colors.destroy');

        // settings - admin only
        Route::get('/admin/settings/general', [SiteSettingsController::class, 'index'])->name('admin.settings.general');
        Route::post('/admin/settings/general', [SiteSettingsController::class, 'store'])->name('admin.settings.general.store');
        Route::put('/admin/settings/general/{key}', [SiteSettingsController::class, 'update'])->name('admin.settings.general.update');
        Route::delete('/admin/settings/general/{key}', [SiteSettingsController::class, 'destroy'])->name('admin.settings.general.destroy');

        Route::get('/admin/settings/logo-favicon', [SettingController::class, 'index'])->name('admin.settings.logo-favicon');
        Route::post('/admin/settings/logo-favicon', [SettingController::class, 'update'])->name('admin.settings.logo-favicon.update');
        Route::post('/admin/settings/logo-favicon/{key}', [SettingController::class, 'updateSetting'])->name('admin.settings.logo-favicon.update.setting');
        Route::delete('/admin/settings/logo-favicon/{key}', [SettingController::class, 'destroy'])->name('admin.settings.logo-favicon.destroy');

        Route::get('/admin/settings/typography', [SiteSettingsController::class, 'typography'])->name('admin.settings.typography');
        Route::post('/admin/settings/typography', [SiteSettingsController::class, 'updateTypography'])->name('admin.settings.typography.update');

        // categories - admin only
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
        Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
        Route::post('/categories/bulk-delete', [CategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');
        Route::post('/categories/bulk-status', [CategoryController::class, 'bulkUpdateStatus'])->name('categories.bulk-status');
        Route::patch('/categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');
        Route::post('/categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
        
        // Category API endpoints
        Route::get('/api/categories/tree', [CategoryController::class, 'tree'])->name('api.categories.tree');
        Route::get('/api/categories/dropdown', [CategoryController::class, 'dropdown'])->name('api.categories.dropdown');
        Route::get('/api/categories/statistics', [CategoryController::class, 'statistics'])->name('api.categories.statistics');

        // brands - admin only
        Route::get('/brands', [BrandController::class, 'index'])->name('brands.index');
        Route::get('/brands/create', [BrandController::class, 'create'])->name('brands.create');
        Route::post('/brands', [BrandController::class, 'store'])->name('brands.store');
        Route::get('/brands/{brand}', [BrandController::class, 'show'])->name('brands.show');
        Route::get('/brands/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit');
        Route::put('/brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
        Route::delete('/brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');
        Route::post('/brands/bulk-delete', [BrandController::class, 'bulkDelete'])->name('brands.bulk-delete');
        Route::post('/brands/bulk-status', [BrandController::class, 'bulkUpdateStatus'])->name('brands.bulk-status');
        Route::patch('/brands/{brand}/toggle-status', [BrandController::class, 'toggleStatus'])->name('brands.toggle-status');
        Route::post('/brands/reorder', [BrandController::class, 'reorder'])->name('brands.reorder');

        // Brand API endpoints
        Route::get('/api/brands/dropdown', [BrandController::class, 'dropdown'])->name('api.brands.dropdown');
        Route::get('/api/brands/statistics', [BrandController::class, 'statistics'])->name('api.brands.statistics');

        // attributes - admin only
        Route::get('/attributes', [AttributeController::class, 'index'])->name('attributes.index');
        Route::get('/attributes/create', [AttributeController::class, 'create'])->name('attributes.create');
        Route::post('/attributes', [AttributeController::class, 'store'])->name('attributes.store');
        Route::get('/attributes/{attribute}', [AttributeController::class, 'show'])->name('attributes.show');
        Route::get('/attributes/{attribute}/edit', [AttributeController::class, 'edit'])->name('attributes.edit');
        Route::put('/attributes/{attribute}', [AttributeController::class, 'update'])->name('attributes.update');
        Route::delete('/attributes/{attribute}', [AttributeController::class, 'destroy'])->name('attributes.destroy');
        Route::post('/attributes/bulk-delete', [AttributeController::class, 'bulkDelete'])->name('attributes.bulk-delete');
        Route::post('/attributes/bulk-status', [AttributeController::class, 'bulkUpdateStatus'])->name('attributes.bulk-status');
        Route::patch('/attributes/{attribute}/toggle-status', [AttributeController::class, 'toggleStatus'])->name('attributes.toggle-status');
        Route::post('/attributes/reorder', [AttributeController::class, 'reorder'])->name('attributes.reorder');

        // Attribute API endpoints
        Route::get('/api/attributes/dropdown', [AttributeController::class, 'dropdown'])->name('api.attributes.dropdown');
        Route::get('/api/attributes/statistics', [AttributeController::class, 'statistics'])->name('api.attributes.statistics');

        // Attribute values overview
        Route::get('/attribute-values', [AttributeController::class, 'valuesOverview'])->name('attribute-values.overview');

        // attribute values - admin only
        Route::get('/attributes/{attribute}/values', [AttributeValueController::class, 'index'])->name('attributes.values.index');
        Route::get('/attributes/{attribute}/values/create', [AttributeValueController::class, 'create'])->name('attributes.values.create');
        Route::post('/attributes/{attribute}/values', [AttributeValueController::class, 'store'])->name('attributes.values.store');
        Route::get('/attributes/{attribute}/values/{attributeValue}', [AttributeValueController::class, 'show'])->name('attributes.values.show');
        Route::get('/attributes/{attribute}/values/{attributeValue}/edit', [AttributeValueController::class, 'edit'])->name('attributes.values.edit');
        Route::put('/attributes/{attribute}/values/{attributeValue}', [AttributeValueController::class, 'update'])->name('attributes.values.update');
        Route::delete('/attributes/{attribute}/values/{attributeValue}', [AttributeValueController::class, 'destroy'])->name('attributes.values.destroy');
        Route::post('/attributes/{attribute}/values/bulk-delete', [AttributeValueController::class, 'bulkDelete'])->name('attributes.values.bulk-delete');
        Route::post('/attributes/{attribute}/values/bulk-status', [AttributeValueController::class, 'bulkUpdateStatus'])->name('attributes.values.bulk-status');
        Route::patch('/attributes/{attribute}/values/{attributeValue}/toggle-status', [AttributeValueController::class, 'toggleStatus'])->name('attributes.values.toggle-status');
        Route::post('/attributes/{attribute}/values/reorder', [AttributeValueController::class, 'reorder'])->name('attributes.values.reorder');

        // Attribute Value API endpoints
        Route::get('/api/attributes/{attribute}/values/dropdown', [AttributeValueController::class, 'dropdown'])->name('api.attributes.values.dropdown');
        Route::get('/api/attributes/{attribute}/values/statistics', [AttributeValueController::class, 'statistics'])->name('api.attributes.values.statistics');

        // products - admin only
        Route::get('/products', [ProductController::class, 'index'])->name('products.index');
        Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])->name('products.store');
        Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::post('/products/bulk-delete', [ProductController::class, 'bulkDelete'])->name('products.bulk-delete');
        Route::post('/products/bulk-status', [ProductController::class, 'bulkUpdateStatus'])->name('products.bulk-status');
        Route::patch('/products/{product}/toggle-status', [ProductController::class, 'toggleStatus'])->name('products.toggle-status');
        Route::patch('/products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
        Route::delete('/products/images/{image}', [ProductController::class, 'deleteImage'])->name('products.delete-image');
        Route::post('/products/reorder-images', [ProductController::class, 'reorderImages'])->name('products.reorder-images');

        // Product API endpoints
        Route::get('/api/products/dropdown', [ProductController::class, 'dropdown'])->name('api.products.dropdown');

        // product variants - admin only
        Route::get('/product-variants/low-stock', [ProductVariantController::class, 'lowStockReport'])->name('product-variants.low-stock');
        Route::get('/product-variants', [ProductVariantController::class, 'index'])->name('product-variants.index');
        Route::get('/product-variants/create', [ProductVariantController::class, 'create'])->name('product-variants.create');
        Route::post('/product-variants', [ProductVariantController::class, 'store'])->name('product-variants.store');
        Route::get('/product-variants/{variant}', [ProductVariantController::class, 'show'])->name('product-variants.show');
        Route::get('/product-variants/{variant}/edit', [ProductVariantController::class, 'edit'])->name('product-variants.edit');
        Route::put('/product-variants/{variant}', [ProductVariantController::class, 'update'])->name('product-variants.update');
        Route::delete('/product-variants/{variant}', [ProductVariantController::class, 'destroy'])->name('product-variants.destroy');
        Route::post('/product-variants/bulk-delete', [ProductVariantController::class, 'bulkDelete'])->name('product-variants.bulk-delete');
        Route::post('/product-variants/bulk-status', [ProductVariantController::class, 'bulkUpdateStatus'])->name('product-variants.bulk-status');
        Route::patch('/product-variants/{variant}/toggle-status', [ProductVariantController::class, 'toggleStatus'])->name('product-variants.toggle-status');

        // Product Variant API endpoints
        Route::get('/api/products/{product}/variants', [ProductVariantController::class, 'byProduct'])->name('api.products.variants');

        // suppliers - admin only
        Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
        Route::get('/suppliers/create', [SupplierController::class, 'create'])->name('suppliers.create');
        Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
        Route::get('/suppliers/{supplier}', [SupplierController::class, 'show'])->name('suppliers.show');
        Route::get('/suppliers/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit');
        Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
        Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');
        Route::post('/suppliers/bulk-delete', [SupplierController::class, 'bulkDelete'])->name('suppliers.bulk-delete');
        Route::post('/suppliers/bulk-status', [SupplierController::class, 'bulkUpdateStatus'])->name('suppliers.bulk-status');
        Route::patch('/suppliers/{supplier}/toggle-status', [SupplierController::class, 'toggleStatus'])->name('suppliers.toggle-status');

        // Supplier API endpoints
        Route::get('/api/suppliers/dropdown', [SupplierController::class, 'dropdown'])->name('api.suppliers.dropdown');

        // warehouses - admin only
        Route::get('/warehouses', [WarehouseController::class, 'index'])->name('warehouses.index');
        Route::get('/warehouses/create', [WarehouseController::class, 'create'])->name('warehouses.create');
        Route::post('/warehouses', [WarehouseController::class, 'store'])->name('warehouses.store');
        Route::get('/warehouses/{warehouse}', [WarehouseController::class, 'show'])->name('warehouses.show');
        Route::get('/warehouses/{warehouse}/edit', [WarehouseController::class, 'edit'])->name('warehouses.edit');
        Route::put('/warehouses/{warehouse}', [WarehouseController::class, 'update'])->name('warehouses.update');
        Route::delete('/warehouses/{warehouse}', [WarehouseController::class, 'destroy'])->name('warehouses.destroy');
        Route::post('/warehouses/bulk-delete', [WarehouseController::class, 'bulkDelete'])->name('warehouses.bulk-delete');
        Route::post('/warehouses/bulk-status', [WarehouseController::class, 'bulkUpdateStatus'])->name('warehouses.bulk-status');
        Route::patch('/warehouses/{warehouse}/toggle-status', [WarehouseController::class, 'toggleStatus'])->name('warehouses.toggle-status');

        // Warehouse API endpoints
        Route::get('/api/warehouses/dropdown', [WarehouseController::class, 'dropdown'])->name('api.warehouses.dropdown');

        // purchases - admin only
        Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
        Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
        Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');
        Route::get('/purchases/{purchase}', [PurchaseController::class, 'show'])->name('purchases.show');
        Route::get('/purchases/{purchase}/edit', [PurchaseController::class, 'edit'])->name('purchases.edit');
        Route::put('/purchases/{purchase}', [PurchaseController::class, 'update'])->name('purchases.update');
        Route::delete('/purchases/{purchase}', [PurchaseController::class, 'destroy'])->name('purchases.destroy');
        Route::post('/purchases/{purchase}/complete', [PurchaseController::class, 'complete'])->name('purchases.complete');

        // Purchase API endpoints
        Route::get('/api/purchases/variants', [PurchaseController::class, 'variants'])->name('api.purchases.variants');

        // stock adjustments - admin only
        Route::get('/stock-adjustments', [StockAdjustmentController::class, 'index'])->name('stock-adjustments.index');
        Route::get('/stock-adjustments/create', [StockAdjustmentController::class, 'create'])->name('stock-adjustments.create');
        Route::post('/stock-adjustments', [StockAdjustmentController::class, 'store'])->name('stock-adjustments.store');
        Route::get('/stock-adjustments/{adjustment}', [StockAdjustmentController::class, 'show'])->name('stock-adjustments.show');
        Route::delete('/stock-adjustments/{adjustment}', [StockAdjustmentController::class, 'destroy'])->name('stock-adjustments.destroy');

        // Stock Adjustment API endpoints
        Route::get('/api/stock-adjustments/variants', [StockAdjustmentController::class, 'variants'])->name('api.stock-adjustments.variants');

        // stock transfers - admin only
        Route::get('/stock-transfers', [StockTransferController::class, 'index'])->name('stock-transfers.index');
        Route::get('/stock-transfers/create', [StockTransferController::class, 'create'])->name('stock-transfers.create');
        Route::post('/stock-transfers', [StockTransferController::class, 'store'])->name('stock-transfers.store');
        Route::get('/stock-transfers/{transfer}', [StockTransferController::class, 'show'])->name('stock-transfers.show');
        Route::get('/stock-transfers/{transfer}/edit', [StockTransferController::class, 'edit'])->name('stock-transfers.edit');
        Route::put('/stock-transfers/{transfer}', [StockTransferController::class, 'update'])->name('stock-transfers.update');
        Route::delete('/stock-transfers/{transfer}', [StockTransferController::class, 'destroy'])->name('stock-transfers.destroy');
        Route::post('/stock-transfers/{transfer}/complete', [StockTransferController::class, 'complete'])->name('stock-transfers.complete');

        // Stock Transfer API endpoints
        Route::get('/api/stock-transfers/variants', [StockTransferController::class, 'variants'])->name('api.stock-transfers.variants');
    });

});





Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

require __DIR__ . '/settings.php';
