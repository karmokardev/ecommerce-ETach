import { Head, router } from '@inertiajs/react';
import { FaEdit, FaArrowLeft } from "react-icons/fa";

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
    created_at: string;
    updated_at: string;
}

interface ShowAttributeValueProps {
    attribute: Attribute;
    value: AttributeValue;
}

export default function ShowAttributeValue({ attribute, value }: ShowAttributeValueProps) {
    return (
        <>
            <Head title={`Attribute Value: ${value.value}`} />
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
                            <h1 className="text-2xl font-bold dark:text-white">Attribute Value Details</h1>
                        </div>
                        <button
                            onClick={() => router.get(`/attributes/${attribute.id}/values/${value.id}/edit`)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <FaEdit />
                            Edit
                        </button>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold mb-2 dark:text-white">Attribute</h2>
                            <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                                <p className="font-medium text-gray-900 dark:text-gray-100">{attribute.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{attribute.slug}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Value</label>
                                <p className="text-gray-900 dark:text-gray-100">{value.value}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Slug</label>
                                <p className="text-gray-900 dark:text-gray-100">{value.slug}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sort Order</label>
                                <p className="text-gray-900 dark:text-gray-100">{value.sort}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</label>
                                <span className={`px-2 py-1 text-xs rounded-full ${value.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                    {value.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</label>
                                <p className="text-gray-900 dark:text-gray-100">{new Date(value.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Updated At</label>
                                <p className="text-gray-900 dark:text-gray-100">{new Date(value.updated_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
