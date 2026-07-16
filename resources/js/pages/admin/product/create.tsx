import { Head, useForm, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import React from 'react';

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

interface Attribute {
    id: number;
    name: string;
    values: Array<{
        id: number;
        value: string;
    }>;
}

interface CreateProductProps {
    categories: Category[];
    brands: Brand[];
    attributes: Attribute[];
}

export default function CreateProduct({ categories, brands, attributes }: CreateProductProps) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '' as string | number,
        brand_id: '' as string | number,
        name: '',
        slug: '',
        short_description: '',
        description: '',
        thumbnail: null as File | null,
        status: 'active',
        is_featured: false,
        attribute_values: [] as number[],
        images: [] as File[],
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [thumbnailError, setThumbnailError] = useState<string>('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

    // Auto-generate slug when name changes
    useEffect(() => {
        if (data.name && !data.slug) {
            setData('slug', generateSlug(data.name));
        }
    }, [data.name]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setThumbnailError('Image size must be less than 2MB');
                setData('thumbnail', null);
                setThumbnailPreview(null);
                return;
            }

            if (!file.type.startsWith('image/')) {
                setThumbnailError('File must be an image');
                setData('thumbnail', null);
                setThumbnailPreview(null);
                return;
            }

            setThumbnailError('');
            setData('thumbnail', file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveThumbnail = () => {
        setData('thumbnail', null);
        setThumbnailPreview(null);
        setThumbnailError('');
    };

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const validFiles = files.filter(file => {
                if (file.size > 2 * 1024 * 1024) {
                    setImageError('Image size must be less than 2MB');
                    return false;
                }
                if (!file.type.startsWith('image/')) {
                    setImageError('File must be an image');
                    return false;
                }
                return true;
            });

            if (validFiles.length > 0) {
                setImageError('');
                setData('images', [...data.images, ...validFiles]);
                const newPreviews = validFiles.map(file => URL.createObjectURL(file));
                setImagePreviews([...imagePreviews, ...newPreviews]);
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const handleAttributeToggle = (attributeValueId: number) => {
        if (data.attribute_values.includes(attributeValueId)) {
            setData('attribute_values', data.attribute_values.filter(id => id !== attributeValueId));
        } else {
            setData('attribute_values', [...data.attribute_values, attributeValueId]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('category_id', data.category_id.toString());
        formData.append('brand_id', data.brand_id.toString());
        formData.append('name', data.name);
        formData.append('slug', data.slug);
        formData.append('short_description', data.short_description);
        formData.append('description', data.description);
        formData.append('status', data.status);
        formData.append('is_featured', data.is_featured ? '1' : '0');

        if (data.thumbnail) {
            formData.append('thumbnail', data.thumbnail);
        }

        data.attribute_values.forEach(id => {
            formData.append('attribute_values[]', id.toString());
        });

        data.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
        });

        router.post('/products', formData, {
            onSuccess: () => {
                toast.success('Product created successfully');
                setThumbnailPreview(null);
                setThumbnailError('');
                setImagePreviews([]);
                setImageError('');
            },
            onError: () => {
                toast.error('Failed to create product');
            },
        });
    };

    return (
        <>
            <Head title="Create Product" />
            <div className="p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold dark:text-white">Create Product</h1>
                    </div>

                    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border dark:border-neutral-800 p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div>
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_id}</p>
                                    )}
                                </div>

                                {/* Brand */}
                                <div>
                                    <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Brand
                                    </label>
                                    <select
                                        id="brand_id"
                                        value={data.brand_id}
                                        onChange={(e) => setData('brand_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="">Select Brand</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>{brand.name}</option>
                                        ))}
                                    </select>
                                    {errors.brand_id && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.brand_id}</p>
                                    )}
                                </div>

                                {/* Product Name */}
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., Wireless Bluetooth Headphones"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                {/* Slug */}
                                <div className="md:col-span-2">
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="e.g., wireless-bluetooth-headphones (auto-generated if empty)"
                                    />
                                    {errors.slug && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                                    )}
                                </div>

                                {/* Short Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Short Description
                                    </label>
                                    <input
                                        type="text"
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="Brief product description (max 255 characters)"
                                        maxLength={255}
                                    />
                                    {errors.short_description && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.short_description}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Description
                                    </label>
                                    <textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100"
                                        placeholder="Detailed product description..."
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                <div className="md:col-span-2">
                                    <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Thumbnail Image
                                    </label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-neutral-700 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                                        <div className="space-y-1 text-center">
                                            {thumbnailPreview ? (
                                                <div className="relative">
                                                    <img
                                                        src={thumbnailPreview}
                                                        alt="Thumbnail Preview"
                                                        className="mx-auto h-48 w-48 object-cover rounded-lg shadow-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveThumbnail}
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
                                                            htmlFor="thumbnail"
                                                            className="relative cursor-pointer bg-white dark:bg-neutral-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                        >
                                                            <span>Upload a file</span>
                                                            <input
                                                                id="thumbnail"
                                                                type="file"
                                                                className="sr-only"
                                                                onChange={handleThumbnailChange}
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
                                    {thumbnailError && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{thumbnailError}</p>
                                    )}
                                    {errors.thumbnail && (
                                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.thumbnail}</p>
                                    )}
                                </div>

                                {/* Additional Images */}
                                <div className="md:col-span-2">
                                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Additional Images
                                    </label>
                                    <div className="mt-1">
                                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-neutral-700 border-dashed rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                                            <div className="space-y-1 text-center">
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
                                                        htmlFor="images"
                                                        className="relative cursor-pointer bg-white dark:bg-neutral-800 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                                    >
                                                        <span>Upload files</span>
                                                        <input
                                                            id="images"
                                                            type="file"
                                                            className="sr-only"
                                                            onChange={handleImagesChange}
                                                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                                            multiple
                                                        />
                                                    </label>
                                                    <p className="pl-1">or drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    PNG, JPG, GIF, WEBP up to 2MB each
                                                </p>
                                            </div>
                                        </div>
                                        {imageError && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{imageError}</p>
                                        )}
                                        {errors.images && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.images}</p>
                                        )}
                                    </div>

                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="mt-4 grid grid-cols-4 gap-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="h-24 w-full object-cover rounded-lg shadow-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition-colors"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
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

                                {/* Featured */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_featured" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Featured Product
                                    </label>
                                </div>

                                {/* Attribute Values */}
                                {attributes.length > 0 && (
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Product Attributes
                                        </label>
                                        <div className="space-y-4">
                                            {attributes.map((attribute) => (
                                                <div key={attribute.id} className="border border-gray-200 dark:border-neutral-700 rounded-lg p-4">
                                                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{attribute.name}</h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                        {attribute.values.map((value) => (
                                                            <label key={value.id} className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.attribute_values.includes(value.id)}
                                                                    onChange={() => handleAttributeToggle(value.id)}
                                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">{value.value}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.attribute_values && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.attribute_values}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating...' : 'Create Product'}
                                </button>
                                <a
                                    href="/products"
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
