import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AdminLayout from '@/layouts/admin-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import LandingLayout from './layouts/LandingLayout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'home':
            case name === 'member/register':
            case name === 'posts/public-index':
            case name === 'posts/public-show':
            case name === 'history/index':
            case name === 'swot/index':
            case name === 'about/index':
            case name === 'committee/index':
            case name === 'membership/register':
            case name === 'contact/index':
            case name === 'legal/index':
            case name === 'privacy/index':
            case name === 'terms/index':
                return LandingLayout;
            case name === 'dashboard':
                return AdminLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AdminLayout, SettingsLayout];
            default:
                return AdminLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
