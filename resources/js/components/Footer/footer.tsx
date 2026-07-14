import { Link } from '@inertiajs/react';
import { Facebook, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
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
        title: 'Company',
        links: [
            { label: 'About Us', href: '/about' },
            { label: 'Brief History', href: '/history' },
            { label: 'Executives Committee', href: '/committee' },
            { label: 'All Blogs', href: '/public/posts?type=blog' },
            { label: 'All Events', href: '/public/posts?type=event' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'Legal Status', href: '/legal' },
            { label: 'SWOT Analysis', href: '/swot' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Contact', href: '/contact' },
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
    sections = defaultSections,
    socialLinks = defaultSocialLinks,
    companyName = 'HRidoy',
    companyTagline,
    companyDescription = 'Nexuas Driving Instructor Foundation is dedicated to promoting safe driving skills and responsible road behavior. Learn safe, drive safe, save lives—empowering individuals for a safer and smarter driving future.',
    copyrightYear,
    email = 'presidenthridoy@gmail.com',
    phone = '+880 1794 587824',
    address = 'Flat 5-A, house 763B Monipur, Borobag, Mirpur-2, Dhaka-1216.',
}) => {
    const currentYear = copyrightYear || new Date().getFullYear();

    return (
        <footer className="bg-neutral-900 text-gray-300 dark:text-gray-400 relative overflow-hidden mt-8 sm:mt-12 lg:mt-16">
            {/* Signature top border: green gradient line */}
            <div
                style={{
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent 0%, var(--primary) 30%, var(--secondary) 60%, transparent 100%)',
                }}
            />

            {/* Subtle background accent */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'radial-gradient(ellipse 60% 40% at 80% 20%, var(--primary) 0%, transparent 60%)',
                    opacity: '0.1'
                }}
            />

            {/* Newsletter Banner */}
            <div className="relative border-b border-white/10 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold tracking-widest uppercase mb-1 text-primary">
                                Stay in the loop
                            </p>
                            <h3 className="text-white text-lg sm:text-xl font-semibold">
                                Join Our Volunteer Grid
                            </h3>
                            {companyTagline && (
                                <p className="text-sm text-muted-foreground mt-1">{companyTagline}</p>
                            )}
                        </div>

                        <div className="w-full sm:w-auto">
                            <Link
                                href="/membership/register"
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-opacity hover:opacity-90 bg-gradient-to-r from-primary to-secondary"
                            >
                                Apply as a Volunteer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 lg:gap-10">

                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <div className="flex-shrink-0 mb-4">
                            <Link href="/" className="block">
                                <img
                                    src="/logo.png"
                                    alt="NEXUAS DRIVING INSTRUCTOR FOUNDATION"
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                        </div>
                        <p className="text-sm leading-relaxed mb-6 text-muted-foreground max-w-sm">
                            {companyDescription}
                        </p>
                    </div>

                    {/* Footer link sections */}
                    {sections.map((section, idx) => (
                        <div key={idx} className="lg:col-span-1">
                            <h4 className="text-xs font-semibold tracking-widest uppercase mb-5 text-white">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href={link.href}
                                            className="text-sm transition-colors duration-200 hover:text-white flex items-center gap-1.5 group text-muted-foreground"
                                        >
                                            <span className="w-1 h-1 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Connect / Contact Details */}
                    <div className="lg:col-span-1">
                        <h4 className="text-xs font-semibold tracking-widest uppercase mb-5 text-white">
                            Connect
                        </h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-3 group">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors shrink-0">
                                    <Phone className="w-3.5 h-3.5 text-primary" />
                                </span>
                                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                                    {phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors shrink-0">
                                    <Mail className="w-3.5 h-3.5 text-primary" />
                                </span>
                                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                                    {email}
                                </a>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors shrink-0">
                                    <MapPin className="w-3.5 h-3.5 text-primary" />
                                </span>
                                <span>{address}</span>
                            </li>
                        </ul>

                        {socialLinks.length > 0 && (
                            <div className="mt-5">
                                <ul className="flex items-center gap-3">
                                    {socialLinks.map((social, idx) => (
                                        <li key={idx}>
                                            <a
                                                href={social.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={social.platform}
                                                className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary/20 border border-white/10 text-muted-foreground hover:text-white hover:border-primary/50 hover:bg-primary/10 hover:-translate-y-0.5 transition-all duration-200"
                                            >
                                                {social.icon}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-xs text-muted-foreground">

                        <p>
                            © {currentYear} <Link href="/">{companyName}</Link>. All rights reserved.
                        </p>

                        <span className="hidden sm:inline">|</span>

                        <p className="flex items-center gap-1">
                            Developed with
                            <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            by <a href="https://ongsho.com/" target="_blank" className="text-primary">Ongsho</a>
                        </p>

                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
