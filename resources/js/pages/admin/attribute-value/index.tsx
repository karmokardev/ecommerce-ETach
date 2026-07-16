import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus, FaEye, FaArrowLeft } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import SearchBar from '@/components/SearchBar';
import StatusFilter from '@/components/StatusFilter';
import { toast } from 'sonner';

interface AttributeValue {
    id: number;
    value: string;
    slug: string;
    sort: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Attribute {
    id: number;
    name: string;
    slug: string;
}

interface AttributeValuesProps {
    attribute: Attribute;
    values: {
        data: AttributeValue[];
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

export default function AttributeValues({ attribute, values, statistics, filters }: AttributeValuesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [valueToDelete, setValueToDelete] = useState<number | null>(null);
    const [selectedValues, setSelectedValues] = useState<number[]>([]);

    const handleEdit = (valueId: number) => {
        router.get(`/attributes/${attribute.id}/values/${valueId}/edit`);
    };

    const handleView = (valueId: number) => {
        router.get(`/attributes/${attribute.id}/values/${valueId}`);
    };

    const handleDeleteClick = (valueId: number) => {
        setValueToDelete(valueId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (valueToDelete) {
            router.delete(`/attributes/${attribute.id}/values/${valueToDelete}`, {
                onSuccess: () => {
                    toast.success('Attribute value deleted successfully');
                    setDeleteModalOpen(false);
                    setValueToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete attribute value');
                },
            });
        }
    };

    const navigate = (overrides: Partial<{ search: string; status: string; page: number; per_page: number }> = {}) => {
        router.get(`/attributes/${attribute.id}/values`, {
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
            setSelectedValues(values.data.map((value) => value.id));
        } else {
            setSelectedValues([]);
        }
    };

    const handleSelectValue = (valueId: number) => {
        if (selectedValues.includes(valueId)) {
            setSelectedValues(selectedValues.filter(id => id !== valueId));
        } else {
            setSelectedValues([...selectedValues, valueId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedValues.length > 0) {
            router.post(`/attributes/${attribute.id}/values/bulk-delete`, { ids: selectedValues }, {
                onSuccess: () => {
                    toast.success('Attribute values deleted successfully');
                    setSelectedValues([]);
                },
                onError: () => {
                    toast.error('Failed to delete attribute values');
                },
            });
        }
    };

    const handleBulkStatusUpdate = (status: string) => {
        if (selectedValues.length > 0) {
            router.post(`/attributes/${attribute.id}/values/bulk-status`, { ids: selectedValues, status }, {
                onSuccess: () => {
                    toast.success('Attribute values status updated successfully');
                    setSelectedValues([]);
                },
                onError: () => {
                    toast.error('Failed to update attribute values status');
                },
            });
        }
    };

    const handleToggleStatus = (valueId: number) => {
        router.patch(`/attributes/${attribute.id}/values/${valueId}/toggle-status`);
    };

    return (
        <>
            <Head title={`Attribute Values: ${attribute.name}`} />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.get('/attributes')}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold dark:text-white">
                            Attribute Values: <span className="text-blue-600">{attribute.name}</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <SearchBar
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Search values..."
                            showSubmitButton={true}
                            submitButtonText="Search"
                            onSubmit={handleSearch}
                        />
                        <StatusFilter
                            value={statusFilter}
                            onChange={handleStatusChange}
                        />
                        <button
                            onClick={() => router.get(`/attributes/${attribute.id}/values/create`)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add Value
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Values</div>
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
                {selectedValues.length > 0 && (
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
                                            checked={selectedValues.length === values.data.length && values.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sort</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {values.data && values.data.length > 0 ? (
                                    values.data.map((value) => (
                                        <tr key={value.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedValues.includes(value.id)}
                                                    onChange={() => handleSelectValue(value.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value.value}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {value.slug}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {value.sort}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(value.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${value.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {value.status === 'active' ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleView(value.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mr-3 transition-colors"
                                                    title="View"
                                                >
                                                    <FaEye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(value.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(value.id)}
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
                                            No attribute values found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {values.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {values.from} to {values.to} of {values.total} values
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(values.current_page - 1)}
                                    disabled={values.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {values.current_page} of {values.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(values.current_page + 1)}
                                    disabled={values.current_page === values.last_page}
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
                        setValueToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Attribute Value"
                    message="Are you sure you want to delete this attribute value? This action cannot be undone."
                />
            </div>
        </>
    );
}
