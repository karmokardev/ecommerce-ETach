import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface PermissionsProps {
    permissions: any;
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Permissions({ permissions, filters }: PermissionsProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);

    const handleEdit = (permissionId: number) => {
        router.get(`/permissions/${permissionId}/edit`);
    };

    const handleDeleteClick = (permissionId: number) => {
        setPermissionToDelete(permissionId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (permissionToDelete) {
            router.delete(`/permissions/${permissionToDelete}`, {
                onSuccess: () => {
                    toast.success('Permission deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete permission');
                },
            });
        }
        setDeleteModalOpen(false);
        setPermissionToDelete(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/permissions', { search: searchTerm, per_page: filters.per_page }, { preserveState: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/permissions', {
            search: filters.search,
            per_page: filters.per_page,
            page
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Permissions Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Permissions Management</h1>

                    {/* Search Bar */}
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search permissions..."
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                        <button
                            onClick={() => router.get('/permissions/create')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <FaPlus className="w-4 h-4" />
                            Create Permission
                        </button>
                    </div>
                </div>

                {/* Permissions DataTable */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guard</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {permissions.data && permissions.data.length > 0 ? (
                                    permissions.data.map((permission: any) => (
                                        <tr key={permission.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{permission.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{permission.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{permission.guard_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleEdit(permission.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(permission.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No permissions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {permissions.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {permissions.from} to {permissions.to} of {permissions.total} permissions
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(permissions.current_page - 1)}
                                    disabled={permissions.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {permissions.current_page} of {permissions.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(permissions.current_page + 1)}
                                    disabled={permissions.current_page === permissions.last_page}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Delete Modal */}
                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setPermissionToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Permission"
                    message="Are you sure you want to delete this permission? This action cannot be undone."
                />
            </div>
        </>
    );
}
