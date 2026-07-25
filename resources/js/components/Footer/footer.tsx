import { Link, usePage } from '@inertiajs/react';
import { Facebook, Mail, MapPin, Phone, Twitter, Youtube, Instagram, Linkedin, Github, Globe, CreditCard, Truck, Shield, RefreshCw, ShoppingBag, Headphones, Package, Star } from 'lucide-react';
import React from 'react';

export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterSection {
    title: string;
    links: FooterLink[];
}

export interface SocialLink {
    platform: string;
    href: string;
    icon: React.ReactNode;
}

const defaultSections: FooterSection[] = [
    {
        title: 'Shop',
        links: [
            { label: 'All Products', href: '/products' },
            { label: 'New Arrivals', href: '/products?new=true' },
            { label: 'Best Sellers', href: '/products?bestseller=true' },
            { label: 'Categories', href: '/categories' },
            { label: 'Deals & Offers', href: '/deals' },
        ],
    },
    {
        title: 'Customer Service',
        links: [
            { label: 'Contact Us', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Shipping Info', href: '/shipping' },
            { label: 'Returns & Exchanges', href: '/returns' },
            { label: 'Track Order', href: '/track-order' },
        ],
    },
    {
        title: 'About Us',
        links: [
            { label: 'Our Story', href: '/about' },
            { label: 'Careers', href: '/careers' },
            { label: 'Blog', href: '/blog' },
            { label: 'Press', href: '/press' },
            { label: 'Reviews', href: '/reviews' },
        ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Cookie Policy', href: '/cookies' },
            { label: 'Refund Policy', href: '/refund' },
            { label: 'Accessibility', href: '/accessibility' },
        ],
    },
];

const defaultSocialLinks: SocialLink[] = [
    {
        platform: 'Facebook',
        href: 'https://www.facebook.com/profile.php?id=100035800682981&mibextid=ZbWKwL',
        icon: <Facebook className="w-4 h-4" />,
    },
    {
        platform: 'YouTube',
        href: 'https://www.youtube.com/@amirhossaindriving',
        icon: <Youtube className="w-4 h-4" />,
    },
    {
        platform: 'Twitter',
        href: 'https://twitter.com/nexusdriviplg3',
        icon: <Twitter className="w-4 h-4" />,
    },
];

// Function to get icon based on platform name
const getSocialIcon = (platform: string): React.ReactNode => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
        case 'facebook':
            return <Facebook className="w-4 h-4" />;
        case 'youtube':
        case 'youtube':
            return <Youtube className="w-4 h-4" />;
        case 'twitter':
        case 'x':
            return <Twitter className="w-4 h-4" />;
        case 'instagram':
            return <Instagram className="w-4 h-4" />;
        case 'linkedin':
            return <Linkedin className="w-4 h-4" />;
        case 'github':
            return <Github className="w-4 h-4" />;
        case 'website':
        case 'web':
        case 'globe':
            return <Globe className="w-4 h-4" />;
        default:
            return <Globe className="w-4 h-4" />;
    }
};

export interface FooterProps {
    sections?: FooterSection[];
    socialLinks?: SocialLink[];
    companyName?: string;
    companyTagline?: string;
    companyDescription?: string;
    copyrightYear?: number;
    email?: string;
    phone?: string;
    address?: string;
}

const Footer: React.FC<FooterProps> = ({
    sections,
    socialLinks,
    companyName,
    companyTagline,
    companyDescription,
    copyrightYear,
    email,
    phone,
    address,
}) => {
    const { props } = usePage();
    const footerSettings = (props as any).settings?.footer || {};

    const currentYear = copyrightYear || new Date().getFullYear();
    
    // Use dynamic settings if provided, otherwise fall back to props or defaults
    const finalCompanyName = companyName || footerSettings.company_name || 'HRidoy';
    const finalCompanyTagline = companyTagline || footerSettings.company_tagline;
    const finalCompanyDescription = companyDescription || footerSettings.company_description || 'Nexuas Driving Instructor Foundation is dedicated to promoting safe driving skills and responsible road behavior. Learn safe, drive safe, save lives—empowering individuals for a safer and smarter driving future.';
    const finalEmail = email || footerSettings.email || 'presidenthridoy@gmail.com';
    const finalPhone = phone || footerSettings.phone || '+880 1794 587824';
    const finalAddress = address || footerSettings.address || 'Flat 5-A, house 763B Monipur, Borobag, Mirpur-2, Dhaka-1216.';
    const finalSections = sections || footerSettings.sections || defaultSections;
    const finalSocialLinks = socialLinks || footerSettings.social_links || defaultSocialLinks;
    
    // Copyright settings
    const developerName = footerSettings.copyright?.developer_name || 'Ongsho';
    const developerLink = footerSettings.copyright?.developer_link || 'https://ongsho.com/';
    
    // Logo setting
    const footerLogo = footerSettings.logo || '/logo.png';

    return (
        <footer className="bg-gradient-to-b from-neutral-900 via-neutral-900 to-black text-gray-300 dark:text-gray-400 relative overflow-hidden mt-8 sm:mt-12 lg:mt-16">
            {/* Signature top border: gradient line */}
            <div
                className="h-1"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, var(--primary) 20%, var(--secondary) 50%, var(--primary) 80%, transparent 100%)',
                }}
            />

            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 80% 50% at 20% 20%, var(--primary) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 40% at 80% 80%, var(--secondary) 0%, transparent 50%)
                    `,
                    opacity: '0.08'
                }}
            />

            {/* Features Bar */}
            <div className="relative border-b border-white/5">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                <Truck className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-white">Free Shipping</h5>
                                <p className="text-xs text-muted-foreground">On orders over $50</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                <RefreshCw className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-white">Easy Returns</h5>
                                <p className="text-xs text-muted-foreground">30-day return policy</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-white">Secure Payment</h5>
                                <p className="text-xs text-muted-foreground">100% secure checkout</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                                <Headphones className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-white">24/7 Support</h5>
                                <p className="text-xs text-muted-foreground">Dedicated support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-x-6 gap-y-8 lg:gap-10">

                    {/* Company Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex-shrink-0">
                            <Link href="/" className="block group">
                                <img
                                    src={footerLogo}
                                    alt={finalCompanyName}
                                    className="h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                                />
                            </Link>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {finalCompanyDescription}
                        </p>
                    </div>

                    {/* Footer link sections */}
                    {finalSections.map((section: FooterSection, idx: number) => (
                        <div key={idx} className="lg:col-span-1">
                            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-white flex items-center gap-3">
                                {/* <span className="w-8 h-0.5 bg-gradient-to-r from-primary to-transparent rounded-full" /> */}
                                {section.title}
                            </h4>
                            <ul className="space-y-3.5">
                                {section.links.map((link: FooterLink, linkIdx: number) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href={link.href}
                                            className="text-sm transition-all duration-300 hover:text-white hover:translate-x-1.5 flex items-center gap-2.5 group text-muted-foreground"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:scale-150 transition-all duration-300 shadow-sm shadow-primary/30" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div className="lg:col-span-2">
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3 group">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:border-primary/40 transition-all duration-300 shrink-0 mt-0.5 shadow-lg shadow-primary/5">
                                    <Phone className="w-4.5 h-4.5 text-primary" />
                                </span>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">Phone</p>
                                    <a href={`tel:${finalPhone}`} className="text-white hover:text-primary transition-colors font-medium">
                                        {finalPhone}
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:border-primary/40 transition-all duration-300 shrink-0 mt-0.5 shadow-lg shadow-primary/5">
                                    <Mail className="w-4.5 h-4.5 text-primary" />
                                </span>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">Email</p>
                                    <a href={`mailto:${finalEmail}`} className="text-white hover:text-primary transition-colors font-medium">
                                        {finalEmail}
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 group">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:border-primary/40 transition-all duration-300 shrink-0 mt-0.5 shadow-lg shadow-primary/5">
                                    <MapPin className="w-4.5 h-4.5 text-primary" />
                                </span>
                                <div className="flex-1">
                                    <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">Address</p>
                                    <span className="text-white hover:text-primary transition-colors">{finalAddress}</span>
                                </div>
                            </li>
                        </ul>

                        {/* Social Links */}
                        {finalSocialLinks.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Follow Us</h4>
                                <ul className="flex items-center gap-3">
                                    {finalSocialLinks.map((social: SocialLink, idx: number) => (
                                        <li key={idx}>
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.platform}
                                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-primary/10 hover:-translate-y-1 transition-all duration-300"
                                            >
                                                {social.icon || getSocialIcon(social.platform)}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="relative border-t border-white/5">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Payment Methods:</span>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1 text-xs">
                                <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center font-bold text-white">VISA</div>
                                <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center font-bold text-white">MC</div>
                                <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center font-bold text-white">AMEX</div>
                                <div className="w-8 h-5 bg-white/10 rounded flex items-center justify-center font-bold text-white">PP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 dark:border-white/5">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs text-muted-foreground">

                        <p>
                            © {currentYear} <Link href="/">{finalCompanyName}</Link>. All rights reserved.
                        </p>

                        <span className="hidden sm:inline">|</span>

                        <p className="flex items-center gap-1">
                            Developed with
                            <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            by <a href={developerLink} target="_blank" className="text-primary">{developerName}</a>
                        </p>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
