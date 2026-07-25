import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Upload, Trash2, Plus, Image as ImageIcon, X } from 'lucide-react';
import { useState } from 'react';

interface SliderImage {
    id?: number;
    image: string;
}

interface HeroSettings {
    slider_images?: SliderImage[];
    slider_enabled?: string;
    auto_slide_interval?: number;
}

interface Props {
    settings: HeroSettings;
}

export default function HeroSettingsIndex({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        slider_enabled: settings.slider_enabled || 'false',
        auto_slide_interval: settings.auto_slide_interval || 3000,
    });

    const [sliderImages, setSliderImages] = useState<SliderImage[]>(settings.slider_images || []);
    const [newSlide, setNewSlide] = useState<Partial<SliderImage>>({
        image: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const submitData = {
            slider_enabled: data.slider_enabled,
            auto_slide_interval: data.auto_slide_interval,
            slider_images: JSON.stringify(sliderImages),
        };
        
        router.post('/admin/settings/hero', submitData, {
            onSuccess: () => {
                toast.success('Hero settings updated successfully');
            },
            onError: (errors: any) => {
                console.error('Errors:', errors);
                toast.error('Failed to update hero settings');
            },
        });
    };

    const handleAddSlide = () => {
        if (!newSlide.image) {
            toast.error('Please upload an image first');
            return;
        }

        const slide: SliderImage = {
            id: Date.now(),
            image: newSlide.image,
        };

        setSliderImages([...sliderImages, slide]);
        setNewSlide({
            image: '',
        });
        setImageFile(null);
        toast.success('Slide added successfully');
    };

    const handleDeleteSlide = (id: number) => {
        if (confirm('Are you sure you want to delete this slide?')) {
            setSliderImages(sliderImages.filter(slide => slide.id !== id));
            toast.success('Slide deleted successfully');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            
            // Upload image using fetch
            const formData = new FormData();
            formData.append('image', file);
            
            fetch('/admin/settings/hero/upload-image', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.image_url) {
                    setNewSlide({ ...newSlide, image: data.image_url });
                    toast.success('Image uploaded successfully');
                }
            })
            .catch(() => {
                toast.error('Failed to upload image');
            });
        }
    };

    return (
        <>
            <Head title="Hero Settings" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Hero Slider Settings</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Add New Slide Form */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                                    <Plus className="h-5 w-5 text-white" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Slide</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Slide Image
                                    </label>
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1">
                                            {newSlide.image ? (
                                                <div className="relative inline-block w-full">
                                                    <img
                                                        src={newSlide.image}
                                                        alt="Slide Preview"
                                                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setNewSlide({ ...newSlide, image: '' });
                                                            setImageFile(null);
                                                        }}
                                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-neutral-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-neutral-800">
                                                    <div className="text-center">
                                                        <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">No image uploaded</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-shrink-0">
                                            <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all cursor-pointer">
                                                <Upload className="h-4 w-4" />
                                                <span>Upload</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>


                                <button
                                    type="button"
                                    onClick={handleAddSlide}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Add Slide
                                </button>
                            </div>
                        </div>

                        {/* Settings & Slides List */}
                        <div className="space-y-6">
                            {/* General Settings */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">General Settings</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={data.slider_enabled === 'true'}
                                                onChange={(e) => setData('slider_enabled', e.target.checked ? 'true' : 'false')}
                                                className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Enable Slider
                                            </span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Auto Slide Interval (ms)
                                        </label>
                                        <input
                                            type="number"
                                            value={data.auto_slide_interval}
                                            onChange={(e) => setData('auto_slide_interval', parseInt(e.target.value) || 3000)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 transition-all"
                                            placeholder="3000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Slides List */}
                            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border dark:border-neutral-800 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Slides ({sliderImages.length})</h2>
                                </div>

                                <div className="space-y-3">
                                    {sliderImages.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 dark:text-gray-400">No slides added yet</p>
                                        </div>
                                    ) : (
                                        sliderImages.map((slide, index) => (
                                            <div
                                                key={slide.id}
                                                className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg border border-gray-200 dark:border-neutral-700"
                                            >
                                                <div className="flex-shrink-0 w-16 h-16">
                                                    <img
                                                        src={slide.image}
                                                        alt={`Slide ${index + 1}`}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                        Slide {index + 1}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteSlide(slide.id!)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {processing ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
