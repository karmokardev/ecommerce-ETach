import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface Supplier {
    id: number;
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    notes: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

interface SuppliersProps {
    suppliers: {
        data: Supplier[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search: string;
        status: string;
        per_page: number;
        page: number;
    };
}

export default function Suppliers({ suppliers, filters }: SuppliersProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);
    const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);

    const handleEdit = (supplierId: number) => {
        router.get(`/suppliers/${supplierId}/edit`);
    };

    const handleView = (supplierId: number) => {
        router.get(`/suppliers/${supplierId}`);
    };

    const handleDeleteClick = (supplierId: number) => {
        setSupplierToDelete(supplierId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (supplierToDelete) {
            router.delete(`/suppliers/${supplierToDelete}`, {
                onSuccess: () => {
                    toast.success('Supplier deleted successfully');
                    setDeleteModalOpen(false);
                    setSupplierToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete supplier');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; page: number; per_page: number }> = {}) => {
        router.get('/suppliers', {
            search: searchTerm,
            status: statusFilter,
            per_page: filters.per_page,
            page: 1,
            ...overrides,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate({ page: 1 });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        navigate({ status: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedSuppliers(suppliers.data.map((sup) => sup.id));
        } else {
            setSelectedSuppliers([]);
        }
    };

    const handleSelectSupplier = (supplierId: number) => {
        if (selectedSuppliers.includes(supplierId)) {
            setSelectedSuppliers(selectedSuppliers.filter(id => id !== supplierId));
        } else {
            setSelectedSuppliers([...selectedSuppliers, supplierId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedSuppliers.length > 0) {
            router.post('/suppliers/bulk-delete', { ids: selectedSuppliers }, {
                onSuccess: () => {
                    toast.success('Suppliers deleted successfully');
                    setSelectedSuppliers([]);
                },
                onError: () => {
                    toast.error('Failed to delete suppliers');
                },
            });
        }
    };

    const handleBulkStatusUpdate = (status: string) => {
        if (selectedSuppliers.length > 0) {
            router.post('/suppliers/bulk-status', { ids: selectedSuppliers, status }, {
                onSuccess: () => {
                    toast.success('Suppliers status updated successfully');
                    setSelectedSuppliers([]);
                },
                onError: () => {
                    toast.error('Failed to update suppliers status');
                },
            });
        }
    };

    const handleToggleStatus = (supplierId: number) => {
        router.patch(`/suppliers/${supplierId}/toggle-status`);
    };

    return (
        <>
            <Head title="Suppliers Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Suppliers Management</h1>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search suppliers..."
                                showSubmitButton={true}
                                submitButtonText="Search"
                                onSubmit={handleSearch}
                            />
                            <StatusFilter
                                value={statusFilter}
                                onChange={handleStatusChange}
                            />
                        </div>
                        <button
                            onClick={() => router.get('/suppliers/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Supplier
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedSuppliers.length > 0 && (
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => handleBulkStatusUpdate('active')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Activate Selected
                        </button>
                        <button
                            onClick={() => handleBulkStatusUpdate('inactive')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Deactivate Selected
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            className="px-4 py-2 bg-gray-800 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-700 transition-colors"
                        >
                            Delete Selected
                        </button>
                    </div>
                )}

                {/* Table View */}
                <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-neutral-800">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedSuppliers.length === suppliers.data.length && suppliers.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {suppliers.data && suppliers.data.length > 0 ? (
                                    suppliers.data.map((supplier) => (
                                        <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSuppliers.includes(supplier.id)}
                                                    onChange={() => handleSelectSupplier(supplier.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{supplier.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {supplier.company || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {supplier.email || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {supplier.phone || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(supplier.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${supplier.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {supplier.status === 'active' ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(supplier.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(supplier.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(supplier.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No suppliers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {suppliers.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {suppliers.from} to {suppliers.to} of {suppliers.total} suppliers
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(suppliers.current_page - 1)}
                                    disabled={suppliers.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {suppliers.current_page} of {suppliers.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(suppliers.current_page + 1)}
                                    disabled={suppliers.current_page === suppliers.last_page}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => {
                        setDeleteModalOpen(false);
                        setSupplierToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Supplier"
                    message="Are you sure you want to delete this supplier? This action cannot be undone."
                />
            </div>
        </>
    );
}
