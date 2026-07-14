import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: Permission[];
}

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface RolesProps {
    roles: any;
    permissions: Permission[];
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Roles({ roles, permissions, filters }: RolesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const handleEdit = (roleId: number) => {
        router.get(`/roles/${roleId}/edit`);
    };

    const handleDeleteClick = (roleId: number) => {
        setRoleToDelete(roleId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (roleToDelete) {
            router.delete(`/roles/${roleToDelete}`, {
                onSuccess: () => {
                    toast.success('Role deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete role');
                },
            });
        }
        setDeleteModalOpen(false);
        setRoleToDelete(null);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/roles', { search: searchTerm, per_page: filters.per_page }, { preserveState: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/roles', {
            search: filters.search,
            per_page: filters.per_page,
            page
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Roles Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Roles Management</h1>

                    {/* Search Bar */}
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search roles..."
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
                            onClick={() => router.get('/roles/create')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <FaPlus className="w-4 h-4" />
                            Create Role
                        </button>
                    </div>
                </div>

                {/* Roles DataTable */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guard</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissions</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {roles.data && roles.data.length > 0 ? (
                                    roles.data.map((role: any) => (
                                        <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{role.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{role.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{role.guard_name}</td>
                                            <td className="px-6 py-4 max-w-xs text-sm text-gray-500 dark:text-gray-400">
                                                <div className="line-clamp-2 overflow-hidden text-ellipsis">
                                                    {role.permissions && role.permissions.length > 0
                                                        ? role.permissions.map((perm: any) => perm.name).join(', ')
                                                        : 'No Permissions'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleEdit(role.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(role.id)}
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
                                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No roles found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {roles.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {roles.from} to {roles.to} of {roles.total} roles
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(roles.current_page - 1)}
                                    disabled={roles.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {roles.current_page} of {roles.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(roles.current_page + 1)}
                                    disabled={roles.current_page === roles.last_page}
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
                        setRoleToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Role"
                    message="Are you sure you want to delete this role? This action cannot be undone."
                />
            </div>
        </>
    );
}
