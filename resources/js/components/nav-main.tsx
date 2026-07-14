import { Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { ChevronRight, ChevronDown } from 'lucide-react';
import type { NavItem } from '@/types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const [openItems, setOpenItems] = useState<Set<string>>(new Set());

    const toggleItem = (title: string) => {
        const newOpenItems = new Set(openItems);
        if (newOpenItems.has(title)) {
            newOpenItems.delete(title);
        } else {
            newOpenItems.add(title);
        }
        setOpenItems(newOpenItems);
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        {item.items ? (
                            <>
                                <SidebarMenuButton 
                                    tooltip={{ children: item.title }}
                                    onClick={() => toggleItem(item.title)}
                                    data-state={openItems.has(item.title) ? 'open' : 'closed'}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    {openItems.has(item.title) ? (
                                        <ChevronDown className="ml-auto" />
                                    ) : (
                                        <ChevronRight className="ml-auto" />
                                    )}
                                </SidebarMenuButton>
                                {openItems.has(item.title) && (
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={subItem.href ? isCurrentUrl(subItem.href) : false}
                                                >
                                                    <Link href={subItem.href || '#'} prefetch>
                                                        {subItem.icon && <subItem.icon />}
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                )}
                            </>
                        ) : (
                            <SidebarMenuButton
                                asChild
                                isActive={item.href ? isCurrentUrl(item.href) : false}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href || '#'} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
