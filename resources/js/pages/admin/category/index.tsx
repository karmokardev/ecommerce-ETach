import { Head, router } from '@inertiajs/react';
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useState } from 'react';
import DeleteModal from '@/components/DeleteModal';
import { toast } from 'sonner';

interface Category {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    sort: number;
    status: string;
    depth: number;
    breadcrumb: string;
    has_children: boolean;
    created_at: string;
    updated_at: string;
    parent?: Category;
}

interface CategoriesProps {
    categories: {
        data: Category[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    tree: any[];
    statistics: {
        total: number;
        active: number;
        inactive: number;
        root: number;
        with_children: number;
    };
    allCategories: Category[];
    filters: {
        search: string;
        status: string;
        parent_id: string;
        per_page: number;
        page: number;
    };
}

export default function Categories({ categories, tree, statistics, allCategories, filters }: CategoriesProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [parentFilter, setParentFilter] = useState(filters.parent_id || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

    const handleEdit = (categoryId: number) => {
        router.get(`/categories/${categoryId}/edit`);
    };

    const handleDeleteClick = (categoryId: number) => {
        setCategoryToDelete(categoryId);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (categoryToDelete) {
            router.delete(`/categories/${categoryToDelete}`, {
                onSuccess: () => {
                    toast.success('Category deleted successfully');
                    setDeleteModalOpen(false);
                    setCategoryToDelete(null);
                },
                onError: () => {
                    toast.error('Failed to delete category');
                },
            });
        }
    };

    // Central place that always builds the query from the CURRENT live filter state.
    // Every navigation (search, filter change, pagination) goes through this so
    // filters and pagination never get out of sync with each other.
    const navigate = (overrides: Partial<{ search: string; status: string; parent_id: string; page: number; per_page: number }> = {}) => {
        router.get('/categories', {
            search: searchTerm,
            status: statusFilter,
            parent_id: parentFilter,
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

    const handleParentChange = (value: string) => {
        setParentFilter(value);
        navigate({ parent_id: value, page: 1 });
    };

    const handlePageChange = (page: number) => {
        navigate({ page });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedCategories(categories.data.map((cat) => cat.id));
        } else {
            setSelectedCategories([]);
        }
    };

    const handleSelectCategory = (categoryId: number) => {
        if (selectedCategories.includes(categoryId)) {
            setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
        } else {
            setSelectedCategories([...selectedCategories, categoryId]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedCategories.length > 0) {
            router.post('/categories/bulk-delete', { ids: selectedCategories }, {
                onSuccess: () => {
                    toast.success('Categories deleted successfully');
                    setSelectedCategories([]);
                },
                onError: () => {
                    toast.error('Failed to delete categories');
                },
            });
        }
    };

    const handleBulkStatusUpdate = (status: string) => {
        if (selectedCategories.length > 0) {
            router.post('/categories/bulk-status', { ids: selectedCategories, status }, {
                onSuccess: () => {
                    toast.success('Categories status updated successfully');
                    setSelectedCategories([]);
                },
                onError: () => {
                    toast.error('Failed to update categories status');
                },
            });
        }
    };

    const handleToggleStatus = (categoryId: number) => {
        router.patch(`/categories/${categoryId}/toggle-status`);
    };

    const buildCategoryOptions = (categories: Category[], parentId: number | null = null, level: number = 0): React.ReactElement[] => {
        const options: React.ReactElement[] = [];
        const prefix = '— '.repeat(level);

        categories
            .filter((cat) => cat.parent_id === parentId)
            .forEach((category) => {
                options.push(
                    <option key={category.id} value={category.id}>
                        {prefix}{category.name}
                    </option>
                );
                options.push(...buildCategoryOptions(categories, category.id, level + 1));
            });

        return options;
    };

    return (
        <>
            <Head title="Categories Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold dark:text-white">Categories Management</h1>

                    {/* Search Bar */}
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search categories..."
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <select
                                value={parentFilter}
                                onChange={(e) => handleParentChange(e.target.value)}
                                className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All Parents</option>
                                <option value="null">Root Categories</option>
                                {buildCategoryOptions(allCategories)}
                            </select>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                        <button
                            onClick={() => router.get('/categories/create')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaPlus />
                            Add
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Total Categories</div>
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
                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">Root Categories</div>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{statistics.root}</div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedCategories.length > 0 && (
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
                                            checked={selectedCategories.length === categories.data.length && categories.data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Parent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sort</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                                {categories.data && categories.data.length > 0 ? (
                                    categories.data.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(category.id)}
                                                    onChange={() => handleSelectCategory(category.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {category.image ? (
                                                    <img
                                                        src={category.image.startsWith('http') ? category.image : `/storage/${category.image}`}
                                                        alt={category.name}
                                                        className="h-12 w-12 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 bg-gray-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{category.slug}</div>
                                                {category.breadcrumb && (
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{category.breadcrumb}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {category.parent ? category.parent.name : 'Root'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {category.sort}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleToggleStatus(category.id)}
                                                    className={`px-2 py-1 text-xs rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                                                >
                                                    {category.status === 'active' ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                <button
                                                    onClick={() => handleEdit(category.id)}
                                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mr-3 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(category.id)}
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
                                            No categories found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {categories.last_page > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 dark:border-neutral-800">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {categories.from} to {categories.to} of {categories.total} categories
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(categories.current_page - 1)}
                                    disabled={categories.current_page === 1}
                                    className="px-3 py-1 border border-gray-300 dark:border-neutral-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                    Page {categories.current_page} of {categories.last_page}
                                </span>
                                <button
                                    onClick={() => handlePageChange(categories.current_page + 1)}
                                    disabled={categories.current_page === categories.last_page}
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
                        setCategoryToDelete(null);
                    }}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Category"
                    message="Are you sure you want to delete this category? This action cannot be undone."
                />
            </div>
        </>
    );
}