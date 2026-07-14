import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState } from 'react';

interface ColorProps {
    colors: {
        id: number;
        primary_color: string;
        secondary_color: string;
    };
    presetColors: {
        id: number;
        name: string;
        value: string;
        is_active: boolean;
    }[];
}

export default function ColorIndex({ colors, presetColors }: ColorProps) {
    const { data, setData, put, processing, errors } = useForm({
        primary_color: colors.primary_color || '#10b981',
        secondary_color: colors.secondary_color || '#d946ef',
    });

    const [newColorName, setNewColorName] = useState('');
    const [newColorValue, setNewColorValue] = useState('#10b981');
    const [isAddingColor, setIsAddingColor] = useState(false);

    const handleAddPresetColor = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingColor(true);
        
        router.post('/preset-colors', {
            name: newColorName,
            value: newColorValue,
        }, {
            onSuccess: () => {
                toast.success('Preset color added successfully');
                setNewColorName('');
                setNewColorValue('#3b82f6');
            },
            onError: () => {
                toast.error('Failed to add preset color');
            },
            onFinish: () => {
                setIsAddingColor(false);
            },
        });
    };

    const handleDeletePresetColor = (id: number) => {
        if (confirm('Are you sure you want to delete this preset color?')) {
            router.delete(`/preset-colors/${id}`, {
                onSuccess: () => {
                    toast.success('Preset color deleted successfully');
                },
                onError: () => {
                    toast.error('Failed to delete preset color');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/colors', {
            onSuccess: () => {
                toast.success('Colors updated successfully');
            },
            onError: () => {
                toast.error('Failed to update colors');
            },
        });
    };

    const handlePresetClick = (color: string, type: 'primary_color' | 'secondary_color') => {
        setData(type, color);
    };

    return (
        <>
            <Head title="Color Management" />
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Color Management</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Color Form */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Color Settings</h2>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    {/* Primary Color */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-4">
                                        <label htmlFor="primary_color" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                Primary Color
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative">
                                                <input
                                                    type="color"
                                                    id="primary_color_preview"
                                                    value={data.primary_color}
                                                    onChange={(e) => setData('primary_color', e.target.value)}
                                                    className="w-20 h-20 rounded-xl cursor-pointer border-4 border-white dark:border-neutral-700 shadow-lg hover:scale-105 transition-transform"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-700 rounded-full flex items-center justify-center shadow-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    id="primary_color"
                                                    value={data.primary_color}
                                                    onChange={(e) => setData('primary_color', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 uppercase font-mono text-sm font-semibold tracking-wider"
                                                    placeholder="#3b82f6"
                                                />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click the color picker or type a hex code</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Quick Select</p>
                                            <div className="grid grid-cols-8 gap-2">
                                                {presetColors.slice(0, 16).map((preset) => (
                                                    <button
                                                        key={preset.value}
                                                        type="button"
                                                        onClick={() => handlePresetClick(preset.value, 'primary_color')}
                                                        className="w-8 h-8 rounded-xl border-2 border-gray-200 dark:border-neutral-700 hover:scale-110 transition-all hover:shadow-lg hover:border-gray-400 dark:hover:border-neutral-500"
                                                        style={{ backgroundColor: preset.value }}
                                                        title={preset.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {errors.primary_color && (
                                            <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">{errors.primary_color}</p>
                                        )}
                                    </div>

                                    {/* Secondary Color */}
                                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-4">
                                        <label htmlFor="secondary_color" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            <span className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                Secondary Color
                                            </span>
                                        </label>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative">
                                                <input
                                                    type="color"
                                                    id="secondary_color_preview"
                                                    value={data.secondary_color}
                                                    onChange={(e) => setData('secondary_color', e.target.value)}
                                                    className="w-20 h-20 rounded-xl cursor-pointer border-4 border-white dark:border-neutral-700 shadow-lg hover:scale-105 transition-transform"
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-neutral-700 rounded-full flex items-center justify-center shadow-md">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    id="secondary_color"
                                                    value={data.secondary_color}
                                                    onChange={(e) => setData('secondary_color', e.target.value)}
                                                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 uppercase font-mono text-sm font-semibold tracking-wider"
                                                    placeholder="#10b981"
                                                />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Click the color picker or type a hex code</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Quick Select</p>
                                            <div className="grid grid-cols-8 gap-2">
                                                {presetColors.slice(0, 16).map((preset) => (
                                                    <button
                                                        key={preset.value}
                                                        type="button"
                                                        onClick={() => handlePresetClick(preset.value, 'secondary_color')}
                                                        className="w-8 h-8 rounded-xl border-2 border-gray-200 dark:border-neutral-700 hover:scale-110 transition-all hover:shadow-lg hover:border-gray-400 dark:hover:border-neutral-500"
                                                        style={{ backgroundColor: preset.value }}
                                                        title={preset.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {errors.secondary_color && (
                                            <p className="mt-3 text-sm text-red-600 dark:text-red-400 font-medium">{errors.secondary_color}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            {processing ? 'Updating...' : 'Save Colors'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Preset Colors Management */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Preset Colors</h2>
                            </div>
                            
                            {/* Add New Color Form */}
                            <form onSubmit={handleAddPresetColor} className="mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="color_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Color Name
                                        </label>
                                        <input
                                            type="text"
                                            id="color_name"
                                            value={newColorName}
                                            onChange={(e) => setNewColorName(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="e.g., Coral"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="color_value" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Color Value
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <input
                                                    type="color"
                                                    id="color_value_preview"
                                                    value={newColorValue}
                                                    onChange={(e) => setNewColorValue(e.target.value)}
                                                    className="w-14 h-14 rounded-xl cursor-pointer border-4 border-white dark:border-neutral-700 shadow-lg hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                id="color_value"
                                                value={newColorValue}
                                                onChange={(e) => setNewColorValue(e.target.value)}
                                                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 uppercase font-mono text-sm font-semibold tracking-wider transition-all"
                                                placeholder="#ff6b6b"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isAddingColor || !newColorName}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {isAddingColor ? 'Adding...' : 'Add Color'}
                                    </button>
                                </div>
                            </form>

                            {/* Existing Colors List */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Colors</p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-full">{presetColors.length}</span>
                                </div>
                                <div className="space-y-2 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                    {presetColors.map((preset) => (
                                        <div
                                            key={preset.id}
                                            className="group flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800 hover:shadow-md transition-all hover:border-gray-200 dark:hover:border-neutral-700"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl border-2 border-white dark:border-neutral-700 shadow-md"
                                                    style={{ backgroundColor: preset.value }}
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{preset.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{preset.value}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDeletePresetColor(preset.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete color"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {presetColors.length === 0 && (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No colors added yet</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add your first color above</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Live Preview</h2>
                            </div>
                            
                            <div className="space-y-5">
                                {/* Color Cards */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Primary</p>
                                        <div
                                            className="w-full h-24 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-all"
                                            style={{ backgroundColor: data.primary_color }}
                                        >
                                            {data.primary_color}
                                        </div>
                                    </div>
                                    <div className="group">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Secondary</p>
                                        <div
                                            className="w-full h-24 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-all"
                                            style={{ backgroundColor: data.secondary_color }}
                                        >
                                            {data.secondary_color}
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons Preview */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Buttons</p>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                            style={{ backgroundColor: data.primary_color }}
                                        >
                                            Primary
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 px-6 py-3 rounded-xl text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                            style={{ backgroundColor: data.secondary_color }}
                                        >
                                            Secondary
                                        </button>
                                    </div>
                                </div>

                                {/* Badges Preview */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Badges</p>
                                    <div className="flex gap-3">
                                        <span
                                            className="px-4 py-2 rounded-full text-white text-sm font-semibold shadow-sm"
                                            style={{ backgroundColor: data.primary_color }}
                                        >
                                            Active
                                        </span>
                                        <span
                                            className="px-4 py-2 rounded-full text-white text-sm font-semibold shadow-sm"
                                            style={{ backgroundColor: data.secondary_color }}
                                        >
                                            New
                                        </span>
                                    </div>
                                </div>

                                {/* Links Preview */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Links</p>
                                    <div className="flex gap-4">
                                        <a
                                            href="#"
                                            className="font-semibold hover:underline transition-colors"
                                            style={{ color: data.primary_color }}
                                        >
                                            Primary Link
                                        </a>
                                        <a
                                            href="#"
                                            className="font-semibold hover:underline transition-colors"
                                            style={{ color: data.secondary_color }}
                                        >
                                            Secondary Link
                                        </a>
                                    </div>
                                </div>

                                {/* Border Preview */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Borders</p>
                                    <div className="flex gap-3">
                                        <div
                                            className="flex-1 px-4 py-3 rounded-xl border-2 text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                                            style={{ borderColor: data.primary_color }}
                                        >
                                            Primary
                                        </div>
                                        <div
                                            className="flex-1 px-4 py-3 rounded-xl border-2 text-gray-900 dark:text-gray-100 font-medium shadow-sm"
                                            style={{ borderColor: data.secondary_color }}
                                        >
                                            Secondary
                                        </div>
                                    </div>
                                </div>

                                {/* Gradient Preview */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Gradient</p>
                                    <div
                                        className="w-full h-16 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg"
                                        style={{ background: `linear-gradient(135deg, ${data.primary_color}, ${data.secondary_color})` }}
                                    >
                                        {data.primary_color} → {data.secondary_color}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
