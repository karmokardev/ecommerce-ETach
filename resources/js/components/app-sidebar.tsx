import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, Shield, PenSquare, BookOpen, GraduationCap, Heart, CheckCircle, Palette, Settings, Type, Package, Boxes, Tag, SlidersHorizontal, Tags, Truck, Warehouse, ArrowUpDown, FileText, BarChart3, ShoppingCart, RotateCcw, TrendingUp, MapPin, PackageSearch } from 'lucide-react';
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
        {
            title: 'Product Management',
            icon: Package,
            items: [
                { title: 'Categories', href: '/categories', icon: LayoutGrid },
                { title: 'Brands', href: '/brands', icon: Tag },
                { title: 'Products', href: '/products', icon: Boxes },
                { title: 'Product Variants', href: '/product-variants', icon: Package },
                { title: 'Attributes', href: '/attributes', icon: SlidersHorizontal },
                { title: 'Attribute Values', href: '/attribute-values', icon: Tags },
            ]
        },
        {
            title: 'Inventory Management',
            icon: Warehouse,
            items: [
                { title: 'Suppliers', href: '/suppliers', icon: Truck },
                { title: 'Warehouses', href: '/warehouses', icon: Warehouse },
                { title: 'Purchases', href: '/purchases', icon: FileText },
                { title: 'Stock Adjustments', href: '/stock-adjustments', icon: ArrowUpDown },
                { title: 'Stock Transfers', href: '/stock-transfers', icon: Boxes },
                { title: 'Low Stock Report', href: '/product-variants/low-stock', icon: BarChart3 },
            ]
        },
        {
            title: 'Order Management',
            icon: ShoppingCart,
            items: [
                { title: 'Orders', href: '/orders', icon: ShoppingCart },
                { title: 'Order Returns', href: '/order-returns', icon: RotateCcw },
                { title: 'Sales Reports', href: '/reports/sales', icon: TrendingUp },
            ]
        },
        {
            title: 'Shipping & Logistics',
            icon: Truck,
            items: [
                { title: 'Shipping Methods', href: '/shipping/methods', icon: PackageSearch },
                { title: 'Shipping Zones', href: '/shipping/zones', icon: MapPin },
                { title: 'Shipments', href: '/shipments', icon: Truck },
            ]
        },
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
