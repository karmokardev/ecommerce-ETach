<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $query = Permission::query();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $permissions = $query->paginate($perPage);

        return Inertia::render('admin/permission/index', [
            'permissions' => $permissions,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/permission/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name',
        ]);

        Permission::create(['name' => $request->name, 'guard_name' => 'web']);

        return redirect()->route('permissions')->with('success', 'Permission created successfully.');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('admin/permission/edit', [
            'permission' => $permission,
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update(['name' => $request->name]);

        return redirect()->route('permissions')->with('success', 'Permission updated successfully.');
    }

    public function destroy(Permission $permission)
    {
        $permission->delete();

        return redirect()->route('permissions')->with('success', 'Permission deleted successfully.');
    }
}
