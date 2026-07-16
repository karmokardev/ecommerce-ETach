import { Head, router } from '@inertiajs/react';
import { User } from '@/types';
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import Pagination from '@/components/Pagination';
import { toast } from 'sonner';

interface UsersProps {
    users: any;
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Users({ users, filters }: UsersProps) {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const itemsPerPage = 10;

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

    // Initialize filtered users with all users
    useEffect(() => {
        setFilteredUsers(users.data || []);
    }, [users.data]);

    // Filter users by status
    useEffect(() => {
        if (statusFilter) {
            const filtered = (users.data || []).filter((user: any) => user.status === statusFilter);
            setFilteredUsers(filtered);
            setCurrentPage(1);
        } else {
            setFilteredUsers(users.data || []);
        }
    }, [statusFilter, users.data]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return (
        <>
            <Head title="Users Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Users Management</h1>

                {/* Search Bar */}
                <div className="flex items-center gap-4">
                    <SearchBar
                        data={users.data || []}
                        searchFields={['username', 'email', 'phone']}
                        onFilteredDataChange={(filtered) => {
                            setFilteredUsers(filtered);
                            setCurrentPage(1);
                        }}
                        placeholder="Search users..."
                        className="w-96"
                    />
                    <StatusFilter
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                            { value: 'suspended', label: 'Suspended' },
                        ]}
                        className="w-48"
                    />
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
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((userItem: any) => (
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
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        totalItems={filteredUsers.length}
                        itemName="users"
                    />
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
