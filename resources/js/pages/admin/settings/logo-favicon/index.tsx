import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Trash2, Upload, Image as ImageIcon, Check, X } from 'lucide-react';
import { useState } from 'react';

interface SettingsProps {
    settings: {
        logo: string;
        favicon: string;
        favicon_svg: string;
        apple_touch_icon: string;
    };
}

export default function SettingsIndex({ settings }: SettingsProps) {
    const { data, setData, post, processing, errors } = useForm({
        logo: null as File | null,
        favicon: null as File | null,
        favicon_svg: null as File | null,
        apple_touch_icon: null as File | null,
    });

    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const [dragOver, setDragOver] = useState<{ [key: string]: boolean }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        if (data.logo) formData.append('logo', data.logo);
        if (data.favicon) formData.append('favicon', data.favicon);
        if (data.favicon_svg) formData.append('favicon_svg', data.favicon_svg);
        if (data.apple_touch_icon) formData.append('apple_touch_icon', data.apple_touch_icon);

        post('/admin/settings/logo-favicon', {
            data: formData,
            onSuccess: () => {
                toast.success('Logo and favicon updated successfully');
                setData('logo', null);
                setData('favicon', null);
                setData('favicon_svg', null);
                setData('apple_touch_icon', null);
            },
            onError: () => {
                toast.error('Failed to update logo and favicon');
            },
        } as any);
    };

    const handleReset = (key: string, label: string) => {
        if (confirm(`Are you sure you want to reset ${label} to default?`)) {
            router.delete(`/admin/settings/logo-favicon/${key}`, {
                onSuccess: () => {
                    toast.success(`${label} reset to default successfully`);
                },
                onError: () => {
                    toast.error(`Failed to reset ${label}`);
                },
            });
        }
    };

    const handleIndividualUpload = (key: string, file: File | null, label: string) => {
        if (!file) return;

        setUploading(prev => ({ ...prev, [key]: true }));

        const formData = new FormData();
        formData.append(key, file);

        router.post(`/admin/settings/logo-favicon/${key}`, formData, {
            onSuccess: () => {
                toast.success(`${label} updated successfully`);
                setData(key as any, null);
                setUploading(prev => ({ ...prev, [key]: false }));
            },
            onError: () => {
                toast.error(`Failed to update ${label}`);
                setUploading(prev => ({ ...prev, [key]: false }));
            },
        } as any);
    };

    const handleDragOver = (e: React.DragEvent, key: string) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [key]: true }));
    };

    const handleDragLeave = (e: React.DragEvent, key: string) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [key]: false }));
    };

    const handleDrop = (e: React.DragEvent, key: string, label: string) => {
        e.preventDefault();
        setDragOver(prev => ({ ...prev, [key]: false }));

        const file = e.dataTransfer.files[0];
        if (file) {
            setData(key as any, file);
            handleIndividualUpload(key, file, label);
        }
    };

    return (
        <>
            <Head title="Logo & Favicon Settings" />
            <div className="p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Logo & Favicon Settings</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your brand assets and site icons</p>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow">
                                <ImageIcon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Upload Brand Assets</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Customize your site's visual identity</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                {/* Logo Upload */}
                                <div 
                                    className={`relative bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border-2 transition-all duration-300 ${dragOver.logo ? 'border-blue-500 scale-[1.01]' : 'border-transparent'}`}
                                    onDragOver={(e) => handleDragOver(e, 'logo')}
                                    onDragLeave={(e) => handleDragLeave(e, 'logo')}
                                    onDrop={(e) => handleDrop(e, 'logo', 'Logo')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {settings.logo ? (
                                                <div className="w-14 h-14 rounded-lg border-2 border-blue-200 dark:border-blue-800 overflow-hidden bg-white dark:bg-neutral-800 shadow flex items-center justify-center">
                                                    <img 
                                                        src={settings.logo} 
                                                        alt="Current Logo" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 bg-white dark:bg-neutral-800 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-blue-400 dark:text-blue-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Logo</h3>
                                                {settings.logo && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                                        <Check className="w-3 h-3" />
                                                        Uploaded
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className={`relative border-2 border-dashed rounded-lg p-3 transition-all duration-300 ${dragOver.logo ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-neutral-600 hover:border-blue-400 dark:hover:border-blue-700 bg-white dark:bg-neutral-800'}`}
                                            >
                                                <input
                                                    type="file"
                                                    id="logo"
                                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                                                    onChange={(e) => {
                                                        setData('logo', e.target.files?.[0] || null);
                                                        if (e.target.files?.[0]) {
                                                            handleIndividualUpload('logo', e.target.files[0], 'Logo');
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    disabled={uploading.logo}
                                                />
                                                <div className="flex flex-col items-center justify-center py-2">
                                                    {uploading.logo ? (
                                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                                            <div className="w-4 h-4 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-xs font-medium">Uploading...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1" />
                                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                {dragOver.logo ? 'Drop here' : 'Click or drag to upload'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PNG, JPG, SVG (Max 2MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {errors.logo && (
                                                <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 mb-2">
                                                    <X className="w-3 h-3" />
                                                    {errors.logo}
                                                </p>
                                            )}
                                            {settings.logo && !errors.logo && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReset('logo', 'Logo')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Favicon Upload */}
                                <div 
                                    className={`relative bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border-2 transition-all duration-300 ${dragOver.favicon ? 'border-green-500 scale-[1.01]' : 'border-transparent'}`}
                                    onDragOver={(e) => handleDragOver(e, 'favicon')}
                                    onDragLeave={(e) => handleDragLeave(e, 'favicon')}
                                    onDrop={(e) => handleDrop(e, 'favicon', 'Favicon')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {settings.favicon ? (
                                                <div className="w-14 h-14 rounded-lg border-2 border-green-200 dark:border-green-800 overflow-hidden bg-white dark:bg-neutral-800 shadow flex items-center justify-center">
                                                    <img 
                                                        src={settings.favicon} 
                                                        alt="Current Favicon" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg border-2 border-dashed border-green-300 dark:border-green-700 bg-white dark:bg-neutral-800 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-green-400 dark:text-green-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Favicon (ICO/PNG)</h3>
                                                {settings.favicon && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                                        <Check className="w-3 h-3" />
                                                        Uploaded
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className={`relative border-2 border-dashed rounded-lg p-3 transition-all duration-300 ${dragOver.favicon ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-neutral-600 hover:border-green-400 dark:hover:border-green-700 bg-white dark:bg-neutral-800'}`}
                                            >
                                                <input
                                                    type="file"
                                                    id="favicon"
                                                    accept="image/vnd.microsoft.icon,image/png"
                                                    onChange={(e) => {
                                                        setData('favicon', e.target.files?.[0] || null);
                                                        if (e.target.files?.[0]) {
                                                            handleIndividualUpload('favicon', e.target.files[0], 'Favicon');
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    disabled={uploading.favicon}
                                                />
                                                <div className="flex flex-col items-center justify-center py-2">
                                                    {uploading.favicon ? (
                                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                            <div className="w-4 h-4 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-xs font-medium">Uploading...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1" />
                                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                {dragOver.favicon ? 'Drop here' : 'Click or drag to upload'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ICO or PNG (Max 1MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {errors.favicon && (
                                                <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 mb-2">
                                                    <X className="w-3 h-3" />
                                                    {errors.favicon}
                                                </p>
                                            )}
                                            {settings.favicon && !errors.favicon && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReset('favicon', 'Favicon')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Favicon SVG Upload */}
                                <div 
                                    className={`relative bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-4 border-2 transition-all duration-300 ${dragOver.favicon_svg ? 'border-purple-500 scale-[1.01]' : 'border-transparent'}`}
                                    onDragOver={(e) => handleDragOver(e, 'favicon_svg')}
                                    onDragLeave={(e) => handleDragLeave(e, 'favicon_svg')}
                                    onDrop={(e) => handleDrop(e, 'favicon_svg', 'Favicon SVG')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {settings.favicon_svg ? (
                                                <div className="w-14 h-14 rounded-lg border-2 border-purple-200 dark:border-purple-800 overflow-hidden bg-white dark:bg-neutral-800 shadow flex items-center justify-center">
                                                    <img 
                                                        src={settings.favicon_svg} 
                                                        alt="Current Favicon SVG" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 bg-white dark:bg-neutral-800 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-purple-400 dark:text-purple-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Favicon SVG</h3>
                                                {settings.favicon_svg && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                                        <Check className="w-3 h-3" />
                                                        Uploaded
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className={`relative border-2 border-dashed rounded-lg p-3 transition-all duration-300 ${dragOver.favicon_svg ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-neutral-600 hover:border-purple-400 dark:hover:border-purple-700 bg-white dark:bg-neutral-800'}`}
                                            >
                                                <input
                                                    type="file"
                                                    id="favicon_svg"
                                                    accept="image/svg+xml"
                                                    onChange={(e) => {
                                                        setData('favicon_svg', e.target.files?.[0] || null);
                                                        if (e.target.files?.[0]) {
                                                            handleIndividualUpload('favicon_svg', e.target.files[0], 'Favicon SVG');
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    disabled={uploading.favicon_svg}
                                                />
                                                <div className="flex flex-col items-center justify-center py-2">
                                                    {uploading.favicon_svg ? (
                                                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                                            <div className="w-4 h-4 border-2 border-purple-600 dark:border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-xs font-medium">Uploading...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1" />
                                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                {dragOver.favicon_svg ? 'Drop here' : 'Click or drag to upload'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">SVG (Max 1MB)</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {errors.favicon_svg && (
                                                <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 mb-2">
                                                    <X className="w-3 h-3" />
                                                    {errors.favicon_svg}
                                                </p>
                                            )}
                                            {settings.favicon_svg && !errors.favicon_svg && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReset('favicon_svg', 'Favicon SVG')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Apple Touch Icon Upload */}
                                <div 
                                    className={`relative bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 border-2 transition-all duration-300 ${dragOver.apple_touch_icon ? 'border-orange-500 scale-[1.01]' : 'border-transparent'}`}
                                    onDragOver={(e) => handleDragOver(e, 'apple_touch_icon')}
                                    onDragLeave={(e) => handleDragLeave(e, 'apple_touch_icon')}
                                    onDrop={(e) => handleDrop(e, 'apple_touch_icon', 'Apple Touch Icon')}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0">
                                            {settings.apple_touch_icon ? (
                                                <div className="w-14 h-14 rounded-lg border-2 border-orange-200 dark:border-orange-800 overflow-hidden bg-white dark:bg-neutral-800 shadow flex items-center justify-center">
                                                    <img 
                                                        src={settings.apple_touch_icon} 
                                                        alt="Current Apple Touch Icon" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg border-2 border-dashed border-orange-300 dark:border-orange-700 bg-white dark:bg-neutral-800 flex items-center justify-center">
                                                    <ImageIcon className="w-5 h-5 text-orange-400 dark:text-orange-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Apple Touch Icon</h3>
                                                {settings.apple_touch_icon && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                                        <Check className="w-3 h-3" />
                                                        Uploaded
                                                    </span>
                                                )}
                                            </div>
                                            <div
                                                className={`relative border-2 border-dashed rounded-lg p-3 transition-all duration-300 ${dragOver.apple_touch_icon ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-gray-300 dark:border-neutral-600 hover:border-orange-400 dark:hover:border-orange-700 bg-white dark:bg-neutral-800'}`}
                                            >
                                                <input
                                                    type="file"
                                                    id="apple_touch_icon"
                                                    accept="image/png"
                                                    onChange={(e) => {
                                                        setData('apple_touch_icon', e.target.files?.[0] || null);
                                                        if (e.target.files?.[0]) {
                                                            handleIndividualUpload('apple_touch_icon', e.target.files[0], 'Apple Touch Icon');
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    disabled={uploading.apple_touch_icon}
                                                />
                                                <div className="flex flex-col items-center justify-center py-2">
                                                    {uploading.apple_touch_icon ? (
                                                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                                            <div className="w-4 h-4 border-2 border-orange-600 dark:border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                                                            <span className="text-xs font-medium">Uploading...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1" />
                                                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                {dragOver.apple_touch_icon ? 'Drop here' : 'Click or drag to upload'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">PNG (Max 2MB, 180x180px)</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {errors.apple_touch_icon && (
                                                <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 mb-2">
                                                    <X className="w-3 h-3" />
                                                    {errors.apple_touch_icon}
                                                </p>
                                            )}
                                            {settings.apple_touch_icon && !errors.apple_touch_icon && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleReset('apple_touch_icon', 'Apple Touch Icon')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing || (!data.logo && !data.favicon && !data.favicon_svg && !data.apple_touch_icon)}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {processing ? 'Uploading...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
