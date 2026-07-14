import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Type, Palette, Save, Eye } from 'lucide-react';
import { useState } from 'react';

interface FontSettings {
    bangla: {
        font_family: string;
        font_size: string;
        font_weight: string;
        color: string;
        line_height: string;
        letter_spacing: string;
    };
    english: {
        font_family: string;
        font_size: string;
        font_weight: string;
        color: string;
        line_height: string;
        letter_spacing: string;
    };
}

interface TypographyProps {
    settings: FontSettings;
}

const BANGLA_FONTS = [
    { name: 'Hind Siliguri', value: "'Hind Siliguri', sans-serif" },
    { name: 'Noto Sans Bengali', value: "'Noto Sans Bengali', sans-serif" },
    { name: 'Baloo Da 2', value: "'Baloo Da 2', cursive" },
    { name: 'Galada', value: "'Galada', cursive" },
    { name: 'Tiro Bangla', value: "'Tiro Bangla', serif" },
];

const ENGLISH_FONTS = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'Open Sans', value: "'Open Sans', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Lato', value: "'Lato', sans-serif" },
    { name: 'Montserrat', value: "'Montserrat', sans-serif" },
];

const FONT_WEIGHTS = [
    { name: 'Light', value: '300' },
    { name: 'Normal', value: '400' },
    { name: 'Medium', value: '500' },
    { name: 'Semi Bold', value: '600' },
    { name: 'Bold', value: '700' },
];

export default function TypographyIndex({ settings }: TypographyProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<'bangla' | 'english'>('bangla');
    const [showPreview, setShowPreview] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        font_settings: settings,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings/typography', {
            onSuccess: () => {
                toast.success('Typography settings updated successfully');
            },
            onError: () => {
                toast.error('Failed to update typography settings');
            },
        });
    };

    const currentSettings = data.font_settings[selectedLanguage];

    const updateSetting = (field: string, value: string) => {
        setData('font_settings', {
            ...data.font_settings,
            [selectedLanguage]: {
                ...data.font_settings[selectedLanguage],
                [field]: value,
            },
        });
    };

    const previewText = selectedLanguage === 'bangla' 
        ? 'এটি একটি বাংলা টেক্সট প্রিভিউ। আপনি এখানে ফন্ট স্টাইল দেখতে পারবেন।'
        : 'This is an English text preview. You can see the font style here.';

    return (
        <>
            <Head title="Typography Settings" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Typography Settings</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage font styles for Bangla and English languages</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Settings Form */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                                    <Type className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Font Configuration</h2>
                            </div>

                            {/* Language Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Select Language
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLanguage('bangla')}
                                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                            selectedLanguage === 'bangla'
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        বাংলা (Bangla)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLanguage('english')}
                                        className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                                            selectedLanguage === 'english'
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
                                        }`}
                                    >
                                        English
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    {/* Font Family */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Font Family
                                        </label>
                                        <select
                                            value={currentSettings.font_family}
                                            onChange={(e) => updateSetting('font_family', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                        >
                                            {selectedLanguage === 'bangla' ? (
                                                BANGLA_FONTS.map(font => (
                                                    <option key={font.value} value={font.value}>{font.name}</option>
                                                ))
                                            ) : (
                                                ENGLISH_FONTS.map(font => (
                                                    <option key={font.value} value={font.value}>{font.name}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    {/* Font Size */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Font Size
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="12"
                                                max="32"
                                                value={parseInt(currentSettings.font_size)}
                                                onChange={(e) => updateSetting('font_size', `${e.target.value}px`)}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                            <input
                                                type="text"
                                                value={currentSettings.font_size}
                                                onChange={(e) => updateSetting('font_size', e.target.value)}
                                                className="w-20 px-3 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm text-center"
                                            />
                                        </div>
                                    </div>

                                    {/* Font Weight */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Font Weight
                                        </label>
                                        <select
                                            value={currentSettings.font_weight}
                                            onChange={(e) => updateSetting('font_weight', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                        >
                                            {FONT_WEIGHTS.map(weight => (
                                                <option key={weight.value} value={weight.value}>{weight.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Font Color */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Font Color
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <input
                                                    type="color"
                                                    value={currentSettings.color}
                                                    onChange={(e) => updateSetting('color', e.target.value)}
                                                    className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-neutral-700 cursor-pointer"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={currentSettings.color}
                                                onChange={(e) => updateSetting('color', e.target.value)}
                                                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                                placeholder="#000000"
                                            />
                                        </div>
                                    </div>

                                    {/* Line Height */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Line Height
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="1"
                                                max="3"
                                                step="0.1"
                                                value={parseFloat(currentSettings.line_height)}
                                                onChange={(e) => updateSetting('line_height', e.target.value)}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                            <input
                                                type="text"
                                                value={currentSettings.line_height}
                                                onChange={(e) => updateSetting('line_height', e.target.value)}
                                                className="w-20 px-3 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm text-center"
                                            />
                                        </div>
                                    </div>

                                    {/* Letter Spacing */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Letter Spacing
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="range"
                                                min="-2"
                                                max="5"
                                                step="0.5"
                                                value={parseFloat(currentSettings.letter_spacing)}
                                                onChange={(e) => updateSetting('letter_spacing', `${e.target.value}px`)}
                                                className="flex-1 h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                            />
                                            <input
                                                type="text"
                                                value={currentSettings.letter_spacing}
                                                onChange={(e) => updateSetting('letter_spacing', e.target.value)}
                                                className="w-20 px-3 py-2 border-2 border-gray-200 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 text-sm text-center"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        <Save className="h-5 w-5" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Preview Panel */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                                        <Eye className="h-5 w-5 text-white" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Live Preview</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                >
                                    <Eye className="h-5 w-5" />
                                </button>
                            </div>

                            {showPreview && (
                                <div className="space-y-4">
                                    <div className="p-6 bg-gradient-to-br from-gray-50 to-white dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-700">
                                        <p
                                            className="leading-relaxed text-gray-900 dark:text-gray-100"
                                            style={{
                                                fontFamily: currentSettings.font_family,
                                                fontSize: currentSettings.font_size,
                                                fontWeight: parseInt(currentSettings.font_weight),
                                                lineHeight: currentSettings.line_height,
                                                letterSpacing: currentSettings.letter_spacing,
                                            }}
                                        >
                                            {previewText}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Current Settings:</h3>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800 dark:text-blue-200">
                                            <div><span className="font-medium">Font:</span> {currentSettings.font_family.split(',')[0].replace(/'/g, '')}</div>
                                            <div><span className="font-medium">Size:</span> {currentSettings.font_size}</div>
                                            <div><span className="font-medium">Weight:</span> {currentSettings.font_weight}</div>
                                            <div><span className="font-medium">Color:</span> {currentSettings.color}</div>
                                            <div><span className="font-medium">Line Height:</span> {currentSettings.line_height}</div>
                                            <div><span className="font-medium">Spacing:</span> {currentSettings.letter_spacing}</div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                        <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">Sample Text:</h3>
                                        <div className="space-y-2">
                                            <p
                                                className="text-sm text-gray-900 dark:text-gray-100"
                                                style={{
                                                    fontFamily: currentSettings.font_family,
                                                    fontSize: currentSettings.font_size,
                                                    fontWeight: parseInt(currentSettings.font_weight),
                                                    lineHeight: currentSettings.line_height,
                                                    letterSpacing: currentSettings.letter_spacing,
                                                }}
                                            >
                                                {selectedLanguage === 'bangla' ? 'বাংলা লেখা' : 'English Text'}
                                            </p>
                                            <p
                                                className="text-lg text-gray-900 dark:text-gray-100"
                                                style={{
                                                    fontFamily: currentSettings.font_family,
                                                    fontSize: currentSettings.font_size,
                                                    fontWeight: parseInt(currentSettings.font_weight),
                                                    lineHeight: currentSettings.line_height,
                                                    letterSpacing: currentSettings.letter_spacing,
                                                }}
                                            >
                                                {selectedLanguage === 'bangla' ? 'বড় বাংলা লেখা' : 'Large English Text'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
