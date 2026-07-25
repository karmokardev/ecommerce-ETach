import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface FooterSettingsProps {
    settings: {
        company_name: string;
        company_tagline: string;
        company_description: string;
        email: string;
        phone: string;
        address: string;
        social_links: Array<{
            platform: string;
            href: string;
        }>;
        sections: Array<{
            title: string;
            links: Array<{
                label: string;
                href: string;
            }>;
        }>;
        copyright: {
            developer_name: string;
            developer_link: string;
        };
        logo: string;
    };
}

export default function FooterSettingsIndex({ settings }: FooterSettingsProps) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: settings.company_name || '',
        company_tagline: settings.company_tagline || '',
        company_description: settings.company_description || '',
        email: settings.email || '',
        phone: settings.phone || '',
        address: settings.address || '',
        social_links: settings.social_links || [],
        sections: settings.sections || [],
        copyright: {
            developer_name: settings.copyright?.developer_name || 'Ongsho',
            developer_link: settings.copyright?.developer_link || 'https://ongsho.com/',
        },
        logo: settings.logo || '/logo.png',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings/footer', {
            onSuccess: () => {
                toast.success('Footer settings updated successfully');
            },
            onError: () => {
                toast.error('Failed to update footer settings');
            },
        });
    };

    const addSocialLink = () => {
        setData('social_links', [...data.social_links, { platform: '', href: '' }]);
    };

    const removeSocialLink = (index: number) => {
        setData('social_links', data.social_links.filter((_, i) => i !== index));
    };

    const updateSocialLink = (index: number, field: 'platform' | 'href', value: string) => {
        const newLinks = [...data.social_links];
        newLinks[index][field] = value;
        setData('social_links', newLinks);
    };

    const addSection = () => {
        setData('sections', [...data.sections, { title: '', links: [] }]);
    };

    const removeSection = (index: number) => {
        setData('sections', data.sections.filter((_, i) => i !== index));
    };

    const updateSection = (index: number, field: 'title', value: string) => {
        const newSections = [...data.sections];
        newSections[index][field] = value;
        setData('sections', newSections);
    };

    const addLinkToSection = (sectionIndex: number) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].links.push({ label: '', href: '' });
        setData('sections', newSections);
    };

    const updateLinkInSection = (sectionIndex: number, linkIndex: number, field: 'label' | 'href', value: string) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].links[linkIndex][field] = value;
        setData('sections', newSections);
    };

    const removeLinkFromSection = (sectionIndex: number, linkIndex: number) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].links = newSections[sectionIndex].links.filter((_, i) => i !== linkIndex);
        setData('sections', newSections);
    };

    return (
        <>
            <Head title="Footer Settings" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Footer Settings</h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Company Information */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                        <Edit2 className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Company Information</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            id="company_name"
                                            value={data.company_name}
                                            onChange={(e) => setData('company_name', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="e.g., HRidoy"
                                        />
                                        {errors.company_name && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="company_tagline" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Company Tagline
                                        </label>
                                        <input
                                            type="text"
                                            id="company_tagline"
                                            value={data.company_tagline}
                                            onChange={(e) => setData('company_tagline', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="e.g., Your tagline here"
                                        />
                                        {errors.company_tagline && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company_tagline}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="company_description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Company Description
                                        </label>
                                        <textarea
                                            id="company_description"
                                            value={data.company_description}
                                            onChange={(e) => setData('company_description', e.target.value)}
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all resize-none"
                                            placeholder="Company description"
                                        />
                                        {errors.company_description && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company_description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                                        <Edit2 className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contact Information</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="e.g., contact@example.com"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="e.g., +880 1794 587824"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all resize-none"
                                            placeholder="Company address"
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg">
                                            <Edit2 className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Social Links</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSocialLink}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Link
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {data.social_links.map((link, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Platform
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={link.platform}
                                                        onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                                        placeholder="e.g., Facebook"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        value={link.href}
                                                        onChange={(e) => updateSocialLink(index, 'href', e.target.value)}
                                                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSocialLink(index)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all mt-6"
                                                title="Remove"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                    {data.social_links.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            No social links added yet
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Copyright Settings */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
                                        <Edit2 className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Copyright & Developer</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="developer_name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Developer Name
                                        </label>
                                        <input
                                            type="text"
                                            id="developer_name"
                                            value={data.copyright.developer_name}
                                            onChange={(e) => setData('copyright.developer_name', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="e.g., Ongsho"
                                        />
                                        {errors['copyright.developer_name'] && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['copyright.developer_name']}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="developer_link" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Developer Link
                                        </label>
                                        <input
                                            type="url"
                                            id="developer_link"
                                            value={data.copyright.developer_link}
                                            onChange={(e) => setData('copyright.developer_link', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="https://ongsho.com/"
                                        />
                                        {errors['copyright.developer_link'] && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors['copyright.developer_link']}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Logo Settings */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                                        <Edit2 className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Footer Logo</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="logo" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Logo URL
                                        </label>
                                        <input
                                            type="text"
                                            id="logo"
                                            value={data.logo}
                                            onChange={(e) => setData('logo', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="/logo.png"
                                        />
                                        {errors.logo && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.logo}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Sections */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
                                            <Edit2 className="h-5 w-5 text-white" />
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Footer Sections</h2>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSection}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Section
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {data.sections.map((section, sectionIndex) => (
                                        <div key={sectionIndex} className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                                            <div className="flex items-start gap-3 mb-4">
                                                <div className="flex-1">
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Section Title
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={section.title}
                                                        onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                                                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                                        placeholder="e.g., Company"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSection(sectionIndex)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all mt-6"
                                                    title="Remove Section"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Links</h4>
                                                    <button
                                                        type="button"
                                                        onClick={() => addLinkToSection(sectionIndex)}
                                                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                        Add Link
                                                    </button>
                                                </div>
                                                {section.links.map((link, linkIndex) => (
                                                    <div key={linkIndex} className="flex items-start gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700">
                                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                                    Label
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={link.label}
                                                                    onChange={(e) => updateLinkInSection(sectionIndex, linkIndex, 'label', e.target.value)}
                                                                    className="w-full px-3 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all text-sm"
                                                                    placeholder="e.g., About Us"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                                    URL
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={link.href}
                                                                    onChange={(e) => updateLinkInSection(sectionIndex, linkIndex, 'href', e.target.value)}
                                                                    className="w-full px-3 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all text-sm"
                                                                    placeholder="/about"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLinkFromSection(sectionIndex, linkIndex)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                            title="Remove Link"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {section.links.length === 0 && (
                                                    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                                                        No links added yet
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {data.sections.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            No sections added yet
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Save className="h-5 w-5" />
                                    {processing ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
