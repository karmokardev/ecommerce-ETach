import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

interface Attribute {
    id: number;
    name: string;
    slug: string;
}

interface AttributeValue {
    id: number;
    value: string;
    slug: string;
    sort: number;
    status: string;
}

interface EditAttributeValueProps {
    attribute: Attribute;
    value: AttributeValue;
}

export default function EditAttributeValue({ attribute, value }: EditAttributeValueProps) {
    const { data, setData, put, processing, errors } = useForm({
        value: value.value,
        slug: value.slug,
        sort: value.sort,
        status: value.status,
    });

    const generateSlug = (val: string): string => {
        return val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    useEffect(() => {
        if (data.value && !data.slug) {
            setData('slug', generateSlug(data.value));
        }
    }, [data.value]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        put(`/attributes/${attribute.id}/values/${value.id}`, {
            onSuccess: () => {
                toast.success('Attribute value updated successfully');
            },
            onError: () => {
                toast.error('Failed to update attribute value');
            },
        });
    };

    return (
        <>
            <Head title={`Edit Attribute Value: ${attribute.name}`} />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get(`/attributes/${attribute.id}/values`)}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">
                                Edit Attribute Value: <span className="text-blue-600">{attribute.name}</span>
                            </h1>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Attribute Value */}
                                <div>
                                    <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Attribute Value *
                                    </label>
                                    <input
                                        type="text"
                                        id="value"
                                        value={data.value}
                                        onChange={(e) => setData('value', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., Small"
                                    />
                                    {errors.value && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.value}</p>
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
                                        placeholder="e.g., small"
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
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Updating...' : 'Update Attribute Value'}
                                </button>
                                <a
                                    href={`/attributes/${attribute.id}/values`}
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
