import React from 'react';
import { Head } from '@inertiajs/react';
import { User, Mail, Phone, MapPin, Calendar, Edit, ArrowLeft, Package, Heart, ShoppingBag } from 'lucide-react';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at?: string;
}

interface Props {
    auth: {
        user: User;
    };
}

export default function ProfileIndex({ auth }: Props) {
    const user = auth.user;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <Head title="My Profile" />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="mx-auto w-full lg:max-w-[var(--breakpoint-2xl)] px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    {/* Header */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 sm:p-3 hover:bg-white rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
                            aria-label="Go back"
                        >
                            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                        </button>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
                                <p className="text-xs sm:text-sm text-gray-500">Manage your account settings</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <button
                            onClick={() => router.visit('/cart')}
                            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex items-center gap-3 sm:gap-4"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900 text-sm sm:text-base">My Cart</p>
                                <p className="text-xs text-gray-500">View shopping cart</p>
                            </div>
                        </button>

                        <button
                            onClick={() => router.visit('/wishlist')}
                            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex items-center gap-3 sm:gap-4"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl flex items-center justify-center">
                                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900 text-sm sm:text-base">Wishlist</p>
                                <p className="text-xs text-gray-500">Saved items</p>
                            </div>
                        </button>

                        <button
                            onClick={() => router.visit('/orders')}
                            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex items-center gap-3 sm:gap-4"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900 text-sm sm:text-base">Orders</p>
                                <p className="text-xs text-gray-500">Order history</p>
                            </div>
                        </button>
                    </div>

                    {/* Profile Information */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 sm:px-8 py-4 sm:py-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-bold text-white">Account Information</h2>
                                <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm sm:text-base">
                                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Edit Profile</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {/* Name */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Full Name</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                            {user?.name || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Email Address</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                            {user?.email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Phone Number</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                            {user?.phone || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Address</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                            {user?.address || 'Not provided'}
                                        </p>
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-50 rounded-xl md:col-span-2">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Member Since</p>
                                        <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                            {formatDate(user?.created_at)}
                                        </p>
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
