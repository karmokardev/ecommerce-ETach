import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import React from 'react';

interface Category {
    id: number;
    name: string;
    parent_id: number | null;
    sort: number;
}

interface CreateCategoryProps {
    categories: Category[];
}

export default function CreateCategory({ categories }: CreateCategoryProps) {
    const { data, setData, post, processing, errors } = useForm({
        parent_id: '' as string | number,
        name: '',
        slug: '',
        description: '',
        sort: 0,
        status: 'active',
        image: null as File | null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string>('');

    // Auto-generate slug from name
    const generateSlug = (name: string): string => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    // Get next sort order from existing categories
    const getNextSortOrder = (): number => {
        if (categories.length === 0) return 0;
        const maxSort = Math.max(...categories.map((cat) => cat.sort || 0));
        return maxSort + 1;
    };

    // Auto-generate slug when name changes
    useEffect(() => {
        if (data.name && !data.slug) {
            setData('slug', generateSlug(data.name));
        }
    }, [data.name]);

    // Auto-generate sort order on component load
    useEffect(() => {
        setData('sort', getNextSortOrder());
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                setImageError('Image size must be less than 2MB');
                setData('image', null);
                setImagePreview(null);
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setImageError('File must be an image');
                setData('image', null);
                setImagePreview(null);
                return;
            }

            setImageError('');
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setData('image', null);
        setImagePreview(null);
        setImageError('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/categories', {
            onSuccess: () => {
                toast.success('Category created successfully');
                setImagePreview(null);
                setImageError('');
            },
            onError: () => {
                toast.error('Failed to create category');
            },
        });
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
            <Head title="Create Category" />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Create Category</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Parent Category */}
                                <div>
                                    <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Parent Category
                                    </label>
                                    <select
                                        id="parent_id"
                                        value={data.parent_id}
                                        onChange={(e) => setData('parent_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">None (Root Category)</option>
                                        {buildCategoryOptions(categories)}
                                    </select>
                                    {errors.parent_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.parent_id}</p>
                                    )}
                                </div>

                                {/* Category Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., Electronics"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div>
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., electronics (auto-generated if empty)"
                                    />
                                    {errors.slug && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                                    )}
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        id="sort"
                                        value={data.sort}
                                        onChange={(e) => setData('sort', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="0"
                                        min="0"
                                    />
                                    {errors.sort && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sort}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                    {errors.status && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="Category description..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="md:col-span-2">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-neutral-700 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                                        <div className="space-y-1 text-center">
                                            {imagePreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="mx-auto h-48 w-48 object-cover rounded-lg shadow-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg
                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                        stroke="currentColor"
                                                        fill="none"
                                                        viewBox="0 0 48 48"
                                                        aria-hidden="true"
                                                    >
                                                        <path
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                        <label
                                                            htmlFor="image"
                                                            className="relative cursor-pointer bg-white dark:bg-neutral-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="image"
                                                                type="file"
                                                                className="sr-only"
                                                                onChange={handleImageChange}
                                                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                                            />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        PNG, JPG, GIF, WEBP up to 2MB
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {imageError && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{imageError}</p>
                                    )}
                                    {errors.image && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.image}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Category'}
                                </button>
                                <a
                                    href="/categories"
                                    className="px-6 py-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600 transition-colors"
                                >
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
