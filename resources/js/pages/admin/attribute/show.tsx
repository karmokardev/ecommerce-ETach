import { Head, router } from '@inertiajs/react';
import { FaEdit, FaArrowLeft, FaList } from "react-icons/fa";

interface AttributeValue {
    id: number;
    value: string;
    slug: string;
    sort: number;
    status: string;
}

interface Attribute {
    id: number;
    name: string;
    slug: string;
    sort: number;
    status: string;
    created_at: string;
    updated_at: string;
    values: AttributeValue[];
}

interface ShowAttributeProps {
    attribute: Attribute;
}

export default function ShowAttribute({ attribute }: ShowAttributeProps) {
    return (
        <>
            <Head title={`Attribute: ${attribute.name}`} />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.get('/attributes')}
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold dark:text-white">Attribute Details</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.get(`/attributes/${attribute.id}/values`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FaList />
                                Manage Values
                            </button>
                            {/* <button
                                onClick={() => router.get(`/attributes/${attribute.id}/edit`)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <FaEdit />
                                Edit
                            </button> */}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Attribute Details */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">Attribute Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Name</label>
                                    <p className="text-gray-900 dark:text-gray-100">{attribute.name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Slug</label>
                                    <p className="text-gray-900 dark:text-gray-100">{attribute.slug}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sort Order</label>
                                    <p className="text-gray-900 dark:text-gray-100">{attribute.sort}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                                    <span className={`px-2 py-1 text-xs rounded-full ${attribute.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                        {attribute.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</label>
                                    <p className="text-gray-900 dark:text-gray-100">{new Date(attribute.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Updated At</label>
                                    <p className="text-gray-900 dark:text-gray-100">{new Date(attribute.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Attribute Values */}
                        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold dark:text-white">Attribute Values</h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {attribute.values?.length || 0} values
                                </span>
                            </div>
                            {attribute.values && attribute.values.length > 0 ? (
                                <div className="space-y-2">
                                    {attribute.values.map((value) => (
                                        <div
                                            key={value.id}
                                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{value.value}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{value.slug}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 text-xs rounded-full ${value.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                    {value.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">Sort: {value.sort}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No attribute values found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
