import { Link, usePage, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

export interface NavItem {
    label: string;
    href?: string;
    children?: NavItem[];
    onClick?: () => void;
}

export interface NavbarProps {
    logo?: React.ReactNode;
    navItems?: NavItem[];
    ctaButton?: {
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary';
    };
    userProfile?: {
        name?: string;
        image?: string;
        role?: string;
    };
}

const defaultNavItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
        label: 'Courses',
        children: [
            { label: 'Web Development', href: '/courses/web' },
            { label: 'Mobile Apps', href: '/courses/mobile' },
        ],
    },
    { label: 'History', href: '/history' },
    { label: 'Swot', href: '/swot' },
    { label: 'Contact', href: '/contact' },
];

const Navbar: React.FC<NavbarProps> = ({ logo, navItems = defaultNavItems, ctaButton, userProfile }) => {
    const { auth } = usePage().props as any;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const resolvedUser = userProfile ?? (auth?.user ? {
        name: auth.user.username,
        image: auth.user.image,
        role: auth.user.role,
    } : undefined);

    const handleLogout = () => {
        router.post('/logout');
    };

    const resolvedCta = resolvedUser
        ? undefined
        : (ctaButton ?? {
            label: 'Join Now',
            onClick: () => {
                router.visit('/register');
            },
            variant: 'primary' as const,
        });

    const handleDropdownToggle = (e: React.MouseEvent, label: string) => {
        e.stopPropagation();
        setOpenDropdown(openDropdown === label ? null : label);
    };

    useEffect(() => {
        if (!openDropdown) {
            return;
        }

        const handleClick = () => setOpenDropdown(null);

        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [openDropdown]);

    const renderDropdown = (item: NavItem, isMobile = false) => {
        const isOpen = openDropdown === item.label;

        return (
            <div key={item.label} className={`relative ${isMobile ? 'w-full' : ''}`}>
                <button
                    onClick={(e) => handleDropdownToggle(e, item.label)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all duration-200 ${isMobile ? 'w-full justify-between' : ''}`}
                >
                    {item.label}
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isOpen && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className={`${isMobile
                            ? 'ml-4 mt-2 w-full'
                            : 'absolute left-0 mt-3 w-56 bg-background rounded-xl shadow-2xl border border-border backdrop-blur-xl'
                            } transition-all duration-200 ease-in-out z-50`}
                    >
                        <div className={`py-2 ${isMobile ? 'w-full' : ''}`}>
                            {item.children?.map((child, idx) => (
                                <div key={idx}>
                                    {child.children ? (
                                        renderDropdown(child, isMobile)
                                    ) : (
                                        <a
                                            href={child.href}
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                if (child.onClick) {
                                                    child.onClick();
                                                }

                                                setOpenDropdown(null);
                                            }}
                                            className={`block px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200 ${isMobile ? 'w-full' : ''}`}
                                        >
                                            {child.label}
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // const ProfileLink = ({ mobile = false }: { mobile?: boolean }) => (
    //     <Link
    //         href={resolvedUser?.role === 'admin' ? '/admin/dashboard' : '/my/profile'}
    //         onClick={() => { if (mobile) setIsMobileMenuOpen(false); }}
    //     >
    //         <div className={`flex items-center ${mobile ? 'justify-center mt-4 p-3 bg-gray-50 rounded-lg' : 'gap-3'} cursor-pointer hover:opacity-80 transition-opacity`}>
    //             <img
    //                 src={resolvedUser?.image || '/placeholders/Portrait_Placeholder.png'}
    //                 alt="user"
    //                 className="w-10 h-10 rounded-full object-cover border"
    //             />
    //         </div>
    //     </Link>
    // );

    return (
        <nav className="bg-background/95 backdrop-blur-xl border-b border-primary sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    {/* <div className="flex-shrink-0">
                        {logo || (
                            <a href="/" className="tracking-tight text-foreground hover:text-primary transition-colors">
                                <img src="/logo.png" alt="NEXUAS DRIVING INSTRUCTOR FOUNDATION" />
                            </a>
                        )}
                    </div> */}

                    <div className="flex-shrink-0">
                        {logo || (
                            <a href="/" className="block">
                                <img
                                    src="/logo.png"
                                    alt="NEXUAS DRIVING INSTRUCTOR FOUNDATION"
                                    className="h-10 w-auto object-contain"
                                />
                            </a>
                        )}
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item, idx) => (
                            <div key={idx}>
                                {item.children ? (
                                    renderDropdown(item)
                                ) : (
                                    <Link
                                        href={item.href}
                                        onClick={item.onClick}
                                        className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Right Side */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* <AppearanceToggleTab /> */}
                        {resolvedUser ? (
                            <div className="relative">
                                <button
                                    onClick={(e) => handleDropdownToggle(e, 'user')}
                                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {resolvedUser.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    {resolvedUser.name}
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 text-gray-400 dark:text-gray-500 ${openDropdown === 'user' ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {openDropdown === 'user' && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-0 mt-3 w-48 bg-background rounded-xl shadow-2xl border border-border backdrop-blur-xl z-50"
                                    >
                                        <div className="py-2">
                                            {resolvedUser.role === 'admin' && (
                                                <Link
                                                    href="/admin/dashboard"
                                                    onClick={() => setOpenDropdown(null)}
                                                    className="block px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-200"
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setOpenDropdown(null);
                                                }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : resolvedCta && (
                            <button
                                onClick={resolvedCta.onClick}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${resolvedCta.variant === 'secondary'
                                    ? 'bg-secondary text-white hover:bg-secondary/80'
                                    : 'bg-primary text-white hover:bg-primary/90'
                                    }`}
                            >
                                {resolvedCta.label}
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-4 py-4 space-y-2 bg-background/95 backdrop-blur-xl border-t border-border">
                    {navItems.map((item, idx) => (
                        <div key={idx}>
                            {item.children ? (
                                renderDropdown(item, true)
                            ) : (
                                <a
                                    href={item.href}
                                    onClick={item.onClick}
                                    className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                                >
                                    {item.label}
                                </a>
                            )}
                        </div>
                    ))}



                    {/* Mobile Right Side */}
                    {resolvedUser ? (
                        <>
                            <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg mt-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                    {resolvedUser.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-foreground">{resolvedUser.name}</div>
                                    <div className="text-xs text-muted-foreground capitalize">{resolvedUser.role}</div>
                                </div>
                            </div>
                            {resolvedUser.role === 'admin' && (
                                <Link
                                    href="/admin/dashboard"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 rounded-lg transition-all duration-200"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            >
                                Logout
                            </button>
                        </>
                    ) : resolvedCta && (
                        <button
                            onClick={() => {
                                resolvedCta.onClick();
                                setIsMobileMenuOpen(false);
                            }}
                            className={`w-full mt-4 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm ${resolvedCta.variant === 'secondary'
                                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                        >
                            {resolvedCta.label}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
