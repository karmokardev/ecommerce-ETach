import { Head, router } from '@inertiajs/react';
import { User } from '@/types';
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface UsersProps {
    users: any;
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Users({ users, filters }: UsersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);

    const handleEdit = (userId: number) => {
        router.get(`/users/${userId}/edit`);
    };

    const handleDeleteClick = (userId: number) => {
        setUserToDelete(userId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            router.delete(`/users/${userToDelete}`, {
                onSuccess: () => {
                    toast.success('User deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete user');
                },
            });
        }
        setDeleteModalOpen(false);
        setUserToDelete(null);
    };

    const handleStatusChange = (userId: number, newStatus: string) => {
        router.patch(`/users/${userId}/status`, { status: newStatus }, {
            onSuccess: () => {
                toast.success('User status updated successfully');
            },
            onError: () => {
                toast.error('Failed to update user status');
            },
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/users', { search: searchTerm, per_page: filters.per_page }, { preserveState: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/users', { 
            search: filters.search, 
            per_page: filters.per_page,
            page 
        }, { preserveState: true });
    };

    return (
        <>
            <Head title="Users Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Users Management</h1>

                {/* Search Bar */}
                <div className="">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by..."
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                            Search
                        </button>
                    </form>
                </div>
                </div>

                {/* Users DataTable */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {users.data && users.data.length > 0 ? (
                                    users.data.map((userItem: any) => (
                                        <tr key={userItem.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{userItem.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{userItem.username || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{userItem.email || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{userItem.phone || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {userItem.roles && userItem.roles.length > 0
                                                    ? userItem.roles.map((role: any) => role.name).join(', ')
                                                    : 'No Role'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <select
                                                    value={userItem.status || 'active'}
                                                    onChange={(e) => handleStatusChange(userItem.id, e.target.value)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                                                        userItem.status === 'active' ? 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground' :
                                                        userItem.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                        'bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-neutral-300'
                                                    }`}
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="suspended">Suspended</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleEdit(userItem.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteClick(userItem.id)}
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
                                        <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {users.from} to {users.to} of {users.total} users
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(users.current_page - 1)}
                                    disabled={users.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {users.current_page} of {users.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(users.current_page + 1)}
                                    disabled={users.current_page === users.last_page}
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
                        setUserToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete User"
                    message="Are you sure you want to delete this user? This action cannot be undone."
                />
            </div>
        </>
    );
}
