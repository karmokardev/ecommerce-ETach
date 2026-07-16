import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface Attribute {
    id: number;
    name: string;
    slug: string;
    sort: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface AttributesProps {
    attributes: {
        data: Attribute[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    statistics: {
        total: number;
        active: number;
        inactive: number;
    };
    filters: {
        search: string;
        status: string;
        per_page: number;
        page: number;
    };
}

export default function Attributes({ attributes, statistics, filters }: AttributesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [attributeToDelete, setAttributeToDelete] = useState<number | null>(null);
    const [selectedAttributes, setSelectedAttributes] = useState<number[]>([]);

    const handleEdit = (attributeId: number) => {
        router.get(`/attributes/${attributeId}/edit`);
    };

    const handleView = (attributeId: number) => {
        router.get(`/attributes/${attributeId}`);
    };

    const handleDeleteClick = (attributeId: number) => {
        setAttributeToDelete(attributeId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (attributeToDelete) {
            router.delete(`/attributes/${attributeToDelete}`, {
                onSuccess: () => {
                    toast.success('Attribute deleted successfully');
                    setDeleteModalOpen(false);
                    setAttributeToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete attribute');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; page: number; per_page: number }> = {}) => {
        router.get('/attributes', {
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
            setSelectedAttributes(attributes.data.map((attribute) => attribute.id));
        } else {
            setSelectedAttributes([]);
        }
    };

    const handleSelectAttribute = (attributeId: number) => {
        if (selectedAttributes.includes(attributeId)) {
            setSelectedAttributes(selectedAttributes.filter(id => id !== attributeId));
        } else {
            setSelectedAttributes([...selectedAttributes, attributeId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedAttributes.length > 0) {
            router.post('/attributes/bulk-delete', { ids: selectedAttributes }, {
                onSuccess: () => {
                    toast.success('Attributes deleted successfully');
                    setSelectedAttributes([]);
                },
                onError: () => {
                    toast.error('Failed to delete attributes');
                },
            });
        }
    };

    const handleBulkStatusUpdate = (status: string) => {
        if (selectedAttributes.length > 0) {
            router.post('/attributes/bulk-status', { ids: selectedAttributes, status }, {
                onSuccess: () => {
                    toast.success('Attributes status updated successfully');
                    setSelectedAttributes([]);
                },
                onError: () => {
                    toast.error('Failed to update attributes status');
                },
            });
        }
    };

    const handleToggleStatus = (attributeId: number) => {
        router.patch(`/attributes/${attributeId}/toggle-status`);
    };

    return (
        <>
            <Head title="Attributes Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Attributes Management</h1>

                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search attributes..."
                            showSubmitButton={true}
                            submitButtonText="Search"
                            onSubmit={handleSearch}
                        />
                        <StatusFilter
                            value={statusFilter}
                            onChange={handleStatusChange}
                        />
                        <button
                            onClick={() => router.get('/attributes/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Attributes</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{statistics.total}</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.active}</div>
                    </div>
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Inactive</div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statistics.inactive}</div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedAttributes.length > 0 && (
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
                                            checked={selectedAttributes.length === attributes.data.length && attributes.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sort</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {attributes.data && attributes.data.length > 0 ? (
                                    attributes.data.map((attribute) => (
                                        <tr key={attribute.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAttributes.includes(attribute.id)}
                                                    onChange={() => handleSelectAttribute(attribute.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{attribute.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {attribute.slug}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {attribute.sort}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(attribute.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${attribute.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {attribute.status === 'active' ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(attribute.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(attribute.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(attribute.id)}
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
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No attributes found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {attributes.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {attributes.from} to {attributes.to} of {attributes.total} attributes
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(attributes.current_page - 1)}
                                    disabled={attributes.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {attributes.current_page} of {attributes.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(attributes.current_page + 1)}
                                    disabled={attributes.current_page === attributes.last_page}
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
                        setAttributeToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Attribute"
                    message="Are you sure you want to delete this attribute? This action cannot be undone."
                />
            </div>
        </>
    );
}
