import { Link, usePage } from '@inertiajs/react';
import { Search, User, ShoppingBag, Menu, X, Heart, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import CartDrawer from '../CartDrawer';

export interface NavbarLink {
    label: string;
    href: string;
}

export interface NavbarProps {
    logo?: string;
    brandName?: string;
    links?: NavbarLink[];
    cartItemCount?: number;
    wishlistItemCount?: number;
    showSearch?: boolean;
    showUser?: boolean;
    showCart?: boolean;
    showWishlist?: boolean;
}

const defaultLinks: NavbarLink[] = [
    { label: 'HOME', href: '/' },
    { label: 'SHOP', href: '/shop' },
    { label: 'SALE', href: '/sale' },
    { label: 'ABOUT US', href: '/about' },
];

const Navbar: React.FC<NavbarProps> = ({
    logo,
    brandName = 'Hridoy',
    links = defaultLinks,
    cartItemCount = 0,
    wishlistItemCount = 0,
    showSearch = true,
    showUser = true,
    showCart = true,
    showWishlist = true,
}) => {
    const { props } = usePage();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
    const [localCartCount, setLocalCartCount] = useState<number | null>(null);

    // Get cart count from local state first, then props
    const finalCartCount = localCartCount !== null ? localCartCount : ((props as any)?.cartCount || (props as any)?.cart?.count || cartItemCount);
    const finalWishlistCount = (props as any)?.wishlist?.count || wishlistItemCount;

    // Check if user is authenticated
    const auth = (props as any)?.auth;
    const isAuthenticated = !!auth?.user;

    const handleCartChange = async () => {
        try {
            const response = await fetch('/cart/count');
            const data = await response.json();
            setLocalCartCount(data.count);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 relative">
                    
                    {/* Mobile menu button - Left side */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>

                    {/* Left side - Navigation Links (Desktop) */}
                    <div className="hidden md:flex items-center space-x-8 flex-1">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Center - Brand/Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href="/" className="flex items-center gap-2">
                            {logo ? (
                                <img
                                    src={logo}
                                    alt={brandName}
                                    className="h-8 w-auto"
                                />
                            ) : (
                                <span className="text-xl font-bold tracking-wider text-gray-900">
                                    {brandName}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Right side - Icons and Search */}
                    <div className="flex items-center space-x-3 flex-1 justify-end">
                        {showSearch && (
                            <div className="hidden md:block relative flex-grow max-w-xs">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        )}
                        
                        {showUser && (
                            <Link
                                href={isAuthenticated ? '/account' : '/login'}
                                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
                                aria-label={isAuthenticated ? "User account" : "Login"}
                            >
                                {isAuthenticated ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                            </Link>
                        )}
                        
                        {showWishlist && (
                            <Link
                                href="/wishlist"
                                className="hidden md:block p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 relative"
                                aria-label="Wishlist"
                            >
                                <Heart className="w-5 h-5" />
                                {finalWishlistCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {finalWishlistCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        
                        {showCart && (
                            <button
                                onClick={() => setIsCartDrawerOpen(true)}
                                className="hidden md:block p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200 relative"
                                aria-label="Shopping cart"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {finalCartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {finalCartCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Search Bar - Full Width */}
                {showSearch && (
                    <div className="md:hidden px-4 pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-sm"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                )}

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        
                        {/* Mobile Menu */}
                        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-50 animate-in slide-in-from-top-2 duration-300">
                            <div className="px-4 py-6 space-y-1">
                                {links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                
                                {/* Mobile Quick Actions */}
                                <div className="pt-4 mt-4 border-t border-gray-200">
                                    <div className="grid grid-cols-3 gap-2">
                                        {showUser && (
                                            <Link
                                                href={isAuthenticated ? '/account' : '/login'}
                                                className="flex flex-col items-center justify-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
                                                aria-label={isAuthenticated ? "User account" : "Login"}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {isAuthenticated ? <User className="w-5 h-5 mb-1" /> : <LogIn className="w-5 h-5 mb-1" />}
                                                <span className="text-xs">{isAuthenticated ? 'Account' : 'Login'}</span>
                                            </Link>
                                        )}
                                        
                                        {showWishlist && (
                                            <Link
                                                href="/wishlist"
                                                className="flex flex-col items-center justify-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
                                                aria-label="Wishlist"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <div className="relative">
                                                    <Heart className="w-5 h-5 mb-1" />
                                                    {finalWishlistCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                                            {finalWishlistCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs">Wishlist</span>
                                            </Link>
                                        )}
                                        
                                        {showCart && (
                                            <Link
                                                href="/cart"
                                                className="flex flex-col items-center justify-center p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 relative"
                                                aria-label="Shopping cart"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <div className="relative">
                                                    <ShoppingBag className="w-5 h-5 mb-1" />
                                                    {finalCartCount > 0 && (
                                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                                            {finalCartCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-xs">Cart</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} onCartChange={handleCartChange} />
        </nav>
    );
};

export default Navbar;
