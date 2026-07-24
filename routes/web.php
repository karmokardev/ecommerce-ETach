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
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\OrderReturnController;
use App\Http\Controllers\Admin\ReportsController;
use App\Http\Controllers\Admin\ShippingMethodController;
use App\Http\Controllers\Admin\ShippingZoneController;
use App\Http\Controllers\Admin\ShipmentController;
use App\Http\Controllers\Admin\PosController;
use App\Http\Controllers\Admin\ProductReturnController;
use App\Http\Controllers\Admin\DueCollectionController;
use App\Http\Controllers\Admin\CustomerAccountController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\FlashSaleController;
use App\Http\Controllers\Admin\ProductReviewController;
use App\Http\Controllers\Admin\EmailCampaignController;
use App\Http\Controllers\Admin\WishlistController as AdminWishlistController;
use App\Http\Controllers\Admin\CartController as AdminCartController;
use App\Http\Controllers\Frontand\HomeController;
use App\Http\Controllers\Frontand\WishlistController as FrontendWishlistController;
use App\Http\Controllers\Frontand\CartController;
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
        Route::get('/stock-adjustments/{adjustment}/edit', [StockAdjustmentController::class, 'edit'])->name('stock-adjustments.edit');
        Route::put('/stock-adjustments/{adjustment}', [StockAdjustmentController::class, 'update'])->name('stock-adjustments.update');
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

        // orders - admin only
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
        Route::delete('/orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
        Route::patch('/orders/{order}/payment-status', [OrderController::class, 'updatePaymentStatus'])->name('orders.payment-status');
        Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice'])->name('orders.invoice');
        Route::get('/orders/{order}/packing-slip', [OrderController::class, 'packingSlip'])->name('orders.packing-slip');

        // Order API endpoints
        Route::get('/api/orders/products', [OrderController::class, 'products'])->name('api.orders.products');
        Route::get('/api/orders/variants/{variant}', [OrderController::class, 'variantDetails'])->name('api.orders.variants.details');
        Route::get('/api/orders/statistics', [OrderController::class, 'statistics'])->name('api.orders.statistics');

        // order returns - admin only
        Route::get('/order-returns', [OrderReturnController::class, 'index'])->name('order-returns.index');
        Route::get('/order-returns/{return}', [OrderReturnController::class, 'show'])->name('order-returns.show');
        Route::post('/order-returns/{return}/approve', [OrderReturnController::class, 'approve'])->name('order-returns.approve');
        Route::post('/order-returns/{return}/reject', [OrderReturnController::class, 'reject'])->name('order-returns.reject');
        Route::post('/order-returns/{return}/complete', [OrderReturnController::class, 'complete'])->name('order-returns.complete');
        Route::delete('/order-returns/{return}', [OrderReturnController::class, 'destroy'])->name('order-returns.destroy');

        // shipping methods - admin only
        Route::get('/shipping/methods', [ShippingMethodController::class, 'index'])->name('shipping.methods.index');
        Route::get('/shipping/methods/create', [ShippingMethodController::class, 'create'])->name('shipping.methods.create');
        Route::post('/shipping/methods', [ShippingMethodController::class, 'store'])->name('shipping.methods.store');
        Route::get('/shipping/methods/{method}/edit', [ShippingMethodController::class, 'edit'])->name('shipping.methods.edit');
        Route::put('/shipping/methods/{method}', [ShippingMethodController::class, 'update'])->name('shipping.methods.update');
        Route::delete('/shipping/methods/{method}', [ShippingMethodController::class, 'destroy'])->name('shipping.methods.destroy');
        Route::patch('/shipping/methods/{method}/toggle-active', [ShippingMethodController::class, 'toggleActive'])->name('shipping.methods.toggle-active');

        // Shipping Method API endpoints
        Route::get('/api/shipping/methods/active', [ShippingMethodController::class, 'active'])->name('api.shipping.methods.active');
        Route::post('/api/shipping/methods/calculate-cost', [ShippingMethodController::class, 'calculateCost'])->name('api.shipping.methods.calculate-cost');

        // shipping zones - admin only
        Route::get('/shipping/zones', [ShippingZoneController::class, 'index'])->name('shipping.zones.index');
        Route::get('/shipping/zones/create', [ShippingZoneController::class, 'create'])->name('shipping.zones.create');
        Route::post('/shipping/zones', [ShippingZoneController::class, 'store'])->name('shipping.zones.store');
        Route::put('/shipping/zones/{zone}', [ShippingZoneController::class, 'update'])->name('shipping.zones.update');
        Route::delete('/shipping/zones/{zone}', [ShippingZoneController::class, 'destroy'])->name('shipping.zones.destroy');
        Route::patch('/shipping/zones/{zone}/toggle-active', [ShippingZoneController::class, 'toggleActive'])->name('shipping.zones.toggle-active');

        // Shipping Zone API endpoints
        Route::get('/api/shipping/zones/active', [ShippingZoneController::class, 'active'])->name('api.shipping.zones.active');
        Route::get('/api/shipping/zones/find-by-district', [ShippingZoneController::class, 'findByDistrict'])->name('api.shipping.zones.find-by-district');
        Route::post('/api/shipping/zones/calculate-rate', [ShippingZoneController::class, 'calculateRate'])->name('api.shipping.zones.calculate-rate');

        // shipments - admin only
        Route::get('/shipments', [ShipmentController::class, 'index'])->name('shipments.index');
        Route::get('/shipments/create', [ShipmentController::class, 'create'])->name('shipments.create');
        Route::post('/shipments', [ShipmentController::class, 'store'])->name('shipments.store');
        Route::get('/shipments/{shipment}', [ShipmentController::class, 'show'])->name('shipments.show');
        Route::patch('/shipments/{shipment}/status', [ShipmentController::class, 'updateStatus'])->name('shipments.status');
        Route::post('/shipments/{shipment}/sync-courier', [ShipmentController::class, 'syncWithCourier'])->name('shipments.sync-courier');

        // Shipment API endpoints
        Route::post('/api/shipments/track', [ShipmentController::class, 'track'])->name('api.shipments.track');
        Route::get('/api/shipments/statistics', [ShipmentController::class, 'statistics'])->name('api.shipments.statistics');

        // reports - admin only
        Route::get('/reports/sales', [ReportsController::class, 'sales'])->name('reports.sales');
        Route::get('/reports/due', [ReportsController::class, 'due'])->name('reports.due');
        Route::get('/reports/returns', [ReportsController::class, 'returns'])->name('reports.returns');
        Route::get('/reports/collections', [ReportsController::class, 'collections'])->name('reports.collections');

        // POS - admin only
        Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
        Route::post('/pos', [PosController::class, 'store'])->name('pos.store');
        Route::get('/pos/orders', [PosController::class, 'orders'])->name('pos.orders');
        Route::get('/pos/{order}', [PosController::class, 'show'])->name('pos.show');
        Route::post('/pos/{order}/cancel', [PosController::class, 'cancel'])->name('pos.cancel');
        Route::post('/pos/{order}/hold', [PosController::class, 'hold'])->name('pos.hold');
        Route::post('/pos/{order}/resume', [PosController::class, 'resume'])->name('pos.resume');
        Route::post('/pos/payment', [PosController::class, 'processPayment'])->name('pos.payment');

        // POS API endpoints
        Route::get('/api/pos/variant/{variant}', [PosController::class, 'variantDetails'])->name('api.pos.variant');
        Route::get('/api/pos/search', [PosController::class, 'searchProducts'])->name('api.pos.search');
        Route::get('/api/pos/statistics', [PosController::class, 'statistics'])->name('api.pos.statistics');

        // Product Returns - admin only
        Route::get('/product-returns', [ProductReturnController::class, 'index'])->name('product-returns.index');
        Route::get('/product-returns/create', [ProductReturnController::class, 'create'])->name('product-returns.create');
        Route::post('/product-returns', [ProductReturnController::class, 'store'])->name('product-returns.store');
        Route::get('/product-returns/{return}', [ProductReturnController::class, 'show'])->name('product-returns.show');
        Route::post('/product-returns/{return}/approve', [ProductReturnController::class, 'approve'])->name('product-returns.approve');
        Route::post('/product-returns/{return}/reject', [ProductReturnController::class, 'reject'])->name('product-returns.reject');
        Route::post('/product-returns/{return}/complete', [ProductReturnController::class, 'complete'])->name('product-returns.complete');

        // Product Return API endpoints
        Route::get('/api/product-returns/order-details', [ProductReturnController::class, 'orderDetails'])->name('api.product-returns.order-details');
        Route::get('/api/product-returns/statistics', [ProductReturnController::class, 'statistics'])->name('api.product-returns.statistics');

        // Due Collections - admin only
        Route::get('/due-collections', [DueCollectionController::class, 'index'])->name('due-collections.index');
        Route::get('/due-collections/create', [DueCollectionController::class, 'create'])->name('due-collections.create');
        Route::post('/due-collections', [DueCollectionController::class, 'store'])->name('due-collections.store');
        Route::get('/due-collections/{collection}', [DueCollectionController::class, 'show'])->name('due-collections.show');

        // Due Collection API endpoints
        Route::get('/api/due-collections/customer-due-details', [DueCollectionController::class, 'customerDueDetails'])->name('api.due-collections.customer-due-details');
        Route::get('/api/due-collections/statistics', [DueCollectionController::class, 'statistics'])->name('api.due-collections.statistics');
        Route::get('/api/due-collections/due-customers', [DueCollectionController::class, 'dueCustomers'])->name('api.due-collections.due-customers');

        // Customer Accounts - admin only
        Route::get('/customer-accounts', [CustomerAccountController::class, 'index'])->name('customer-accounts.index');
        Route::get('/customer-accounts/create', [CustomerAccountController::class, 'create'])->name('customer-accounts.create');
        Route::post('/customer-accounts', [CustomerAccountController::class, 'store'])->name('customer-accounts.store');
        Route::get('/customer-accounts/{account}', [CustomerAccountController::class, 'show'])->name('customer-accounts.show');
        Route::get('/customer-accounts/{account}/edit', [CustomerAccountController::class, 'edit'])->name('customer-accounts.edit');
        Route::put('/customer-accounts/{account}', [CustomerAccountController::class, 'update'])->name('customer-accounts.update');
        Route::patch('/customer-accounts/{account}/toggle-status', [CustomerAccountController::class, 'toggleStatus'])->name('customer-accounts.toggle-status');

        // Customer Account API endpoints
        Route::get('/api/customer-accounts/statistics', [CustomerAccountController::class, 'statistics'])->name('api.customer-accounts.statistics');
        Route::get('/api/customer-accounts/{account}/transactions', [CustomerAccountController::class, 'transactions'])->name('api.customer-accounts.transactions');

        // Customers - admin only
        Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
        Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
        Route::get('/customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
        Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
        Route::post('/customers/{customer}/create-account', [CustomerController::class, 'createAccount'])->name('customers.create-account');

        // Customer API endpoints
        Route::get('/api/customers/statistics', [CustomerController::class, 'statistics'])->name('api.customers.statistics');
        Route::get('/api/customers/dropdown', [CustomerController::class, 'dropdown'])->name('api.customers.dropdown');

        // Coupons - admin only
        Route::get('/coupons', [CouponController::class, 'index'])->name('coupons.index');
        Route::get('/coupons/create', [CouponController::class, 'create'])->name('coupons.create');
        Route::post('/coupons', [CouponController::class, 'store'])->name('coupons.store');
        Route::get('/coupons/{coupon}', [CouponController::class, 'show'])->name('coupons.show');
        Route::get('/coupons/{coupon}/edit', [CouponController::class, 'edit'])->name('coupons.edit');
        Route::put('/coupons/{coupon}', [CouponController::class, 'update'])->name('coupons.update');
        Route::delete('/coupons/{coupon}', [CouponController::class, 'destroy'])->name('coupons.destroy');
        Route::patch('/coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])->name('coupons.toggle-status');

        // Flash Sales - admin only
        Route::get('/flash-sales', [FlashSaleController::class, 'index'])->name('flash-sales.index');
        Route::get('/flash-sales/create', [FlashSaleController::class, 'create'])->name('flash-sales.create');
        Route::post('/flash-sales', [FlashSaleController::class, 'store'])->name('flash-sales.store');
        Route::get('/flash-sales/{flashSale}', [FlashSaleController::class, 'show'])->name('flash-sales.show');
        Route::get('/flash-sales/{flashSale}/edit', [FlashSaleController::class, 'edit'])->name('flash-sales.edit');
        Route::put('/flash-sales/{flashSale}', [FlashSaleController::class, 'update'])->name('flash-sales.update');
        Route::delete('/flash-sales/{flashSale}', [FlashSaleController::class, 'destroy'])->name('flash-sales.destroy');
        Route::patch('/flash-sales/{flashSale}/toggle-status', [FlashSaleController::class, 'toggleStatus'])->name('flash-sales.toggle-status');
        Route::post('/flash-sales/{flashSale}/add-product', [FlashSaleController::class, 'addProduct'])->name('flash-sales.add-product');
        Route::delete('/flash-sales/{flashSale}/products/{flashSaleProduct}', [FlashSaleController::class, 'removeProduct'])->name('flash-sales.remove-product');

        // Product Reviews - admin only
        Route::get('/reviews', [ProductReviewController::class, 'index'])->name('reviews.index');
        Route::get('/reviews/{review}', [ProductReviewController::class, 'show'])->name('reviews.show');
        Route::post('/reviews/{review}/approve', [ProductReviewController::class, 'approve'])->name('reviews.approve');
        Route::post('/reviews/{review}/reject', [ProductReviewController::class, 'reject'])->name('reviews.reject');
        Route::delete('/reviews/{review}', [ProductReviewController::class, 'destroy'])->name('reviews.destroy');
        Route::post('/reviews/{review}/mark-helpful', [ProductReviewController::class, 'markHelpful'])->name('reviews.mark-helpful');

        // Email Campaigns - admin only
        Route::get('/email-campaigns', [EmailCampaignController::class, 'index'])->name('email-campaigns.index');
        Route::get('/email-campaigns/create', [EmailCampaignController::class, 'create'])->name('email-campaigns.create');
        Route::post('/email-campaigns', [EmailCampaignController::class, 'store'])->name('email-campaigns.store');
        Route::get('/email-campaigns/{campaign}', [EmailCampaignController::class, 'show'])->name('email-campaigns.show');
        Route::get('/email-campaigns/{campaign}/edit', [EmailCampaignController::class, 'edit'])->name('email-campaigns.edit');
        Route::put('/email-campaigns/{campaign}', [EmailCampaignController::class, 'update'])->name('email-campaigns.update');
        Route::delete('/email-campaigns/{campaign}', [EmailCampaignController::class, 'destroy'])->name('email-campaigns.destroy');
        Route::post('/email-campaigns/{campaign}/send', [EmailCampaignController::class, 'send'])->name('email-campaigns.send');
        Route::post('/email-campaigns/{campaign}/cancel', [EmailCampaignController::class, 'cancel'])->name('email-campaigns.cancel');

        // Wishlists - admin only
        Route::get('/wishlists', [AdminWishlistController::class, 'index'])->name('wishlists.index');
        Route::get('/wishlists/{wishlist}', [AdminWishlistController::class, 'show'])->name('wishlists.show');
        Route::delete('/wishlists/{wishlist}', [AdminWishlistController::class, 'destroy'])->name('wishlists.destroy');
        Route::post('/wishlists/bulk-delete', [AdminWishlistController::class, 'bulkDelete'])->name('wishlists.bulk-delete');

        // Wishlist API endpoints
        Route::get('/api/wishlists/statistics', [AdminWishlistController::class, 'statistics'])->name('api.wishlists.statistics');

        // Carts - admin only
        Route::get('/carts', [AdminCartController::class, 'index'])->name('carts.index');
        Route::get('/carts/{cart}', [AdminCartController::class, 'show'])->name('carts.show');
        Route::delete('/carts/{cart}', [AdminCartController::class, 'destroy'])->name('carts.destroy');
        Route::post('/carts/bulk-delete', [AdminCartController::class, 'bulkDelete'])->name('carts.bulk-delete');
        Route::post('/carts/{cart}/clear', [AdminCartController::class, 'clearCart'])->name('carts.clear');
        Route::delete('/carts/{cart}/items/{item}', [AdminCartController::class, 'deleteItem'])->name('carts.delete-item');
        Route::put('/carts/{cart}/items/{item}', [AdminCartController::class, 'updateItem'])->name('carts.update-item');

        // Cart API endpoints
        Route::get('/api/carts/statistics', [AdminCartController::class, 'statistics'])->name('api.carts.statistics');
        Route::get('/api/carts/{cart}', [AdminCartController::class, 'showApi'])->name('api.carts.show');
    });

});





Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Frontend Wishlist Routes (authenticated users)
Route::middleware(['auth'])->group(function () {
    Route::get('/wishlist', [FrontendWishlistController::class, 'index'])->name('wishlist.index');
    Route::post('/wishlist', [FrontendWishlistController::class, 'store'])->name('wishlist.store');
    Route::delete('/wishlist/{id}', [FrontendWishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::post('/wishlist/check', [FrontendWishlistController::class, 'check'])->name('wishlist.check');
    Route::get('/wishlist/count', [FrontendWishlistController::class, 'count'])->name('wishlist.count');
    Route::post('/wishlist/{id}/move-to-cart', [FrontendWishlistController::class, 'moveToCart'])->name('wishlist.move-to-cart');
    Route::post('/wishlist/clear', [FrontendWishlistController::class, 'clear'])->name('wishlist.clear');
});

// Frontend Cart Routes (both authenticated and guest users)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
Route::put('/cart/{id}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');
Route::get('/cart/show', [CartController::class, 'show'])->name('cart.show');
Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
Route::post('/cart/merge', [CartController::class, 'merge'])->name('cart.merge')->middleware('auth');

require __DIR__ . '/settings.php';
