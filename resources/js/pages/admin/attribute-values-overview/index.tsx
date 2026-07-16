import { Head, router } from '@inertiajs/react';
import { FaEdit, FaPlus, FaArrowLeft, FaList } from "react-icons/fa";

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
    values: AttributeValue[];
}

interface AttributeValuesOverviewProps {
    attributes: Attribute[];
}

export default function AttributeValuesOverview({ attributes }: AttributeValuesOverviewProps) {
    return (
        <>
            <Head title="Attribute Values Management" />
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.get('/attributes')}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold dark:text-white">Attribute Values Management</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {attributes.map((attribute) => (
                        <div key={attribute.id} className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800">
                            <div className="p-4 border-b border-gray-200 dark:border-neutral-800">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold dark:text-white">{attribute.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{attribute.slug}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${attribute.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                        {attribute.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Values ({attribute.values?.length || 0})
                                    </span>
                                    <button
                                        onClick={() => router.get(`/attributes/${attribute.id}/values/create`)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center gap-1"
                                    >
                                        <FaPlus className="w-3 h-3" />
                                        Add Value
                                    </button>
                                </div>
                                
                                {attribute.values && attribute.values.length > 0 ? (
                                    <div className="space-y-2">
                                        {attribute.values.map((value) => (
                                            <div
                                                key={value.id}
                                                className="flex justify-between items-center p-2 bg-gray-50 dark:bg-neutral-800 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value.value}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{value.slug}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${value.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                        {value.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <button
                                                        onClick={() => router.get(`/attributes/${attribute.id}/values/${value.id}/edit`)}
                                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                                        No values yet
                                    </div>
                                )}
                                
                                <button
                                    onClick={() => router.get(`/attributes/${attribute.id}/values`)}
                                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <FaList className="w-4 h-4" />
                                    Manage All Values
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
