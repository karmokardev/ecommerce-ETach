import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Shield, PenSquare, BookOpen, GraduationCap, Heart, CheckCircle, Palette, Settings, Type } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

// Role -> allowed nav items mapping
const navItemsByRole: Record<string, NavItem[]> = {
    admin: [
        { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        { title: 'Users', href: '/users', icon: Users },
        { title: 'Roles', href: '/roles', icon: Shield },
        { title: 'Permissions', href: '/permissions', icon: CheckCircle },
        { title: 'Colors', href: '/colors', icon: Palette },
        { 
            title: 'Site Settings', 
            icon: Settings,
            items: [
                { title: 'General Settings', href: '/admin/settings/general', icon: LayoutGrid },
                { title: 'Logo & Favicon', href: '/admin/settings/logo-favicon', icon: Palette },
                { title: 'Typography', href: '/admin/settings/typography', icon: Type },
            ]
        },
    ],
};

const defaultNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { roles: Array<{ name: string }> } } }>().props;


    // First role of the user, fallback to 'user'
    const role = auth?.user?.roles?.[0]?.name ?? 'user';

    const navItems = navItemsByRole[role] ?? defaultNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href='/' prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
