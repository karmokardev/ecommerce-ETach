<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\ColorsController;
use App\Http\Controllers\Admin\PresetColorController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\SiteSettingsController;
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
    });

});





Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

require __DIR__ . '/settings.php';
