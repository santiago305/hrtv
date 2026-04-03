import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { hasRequiredRole } from '@/lib/authorization';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { FolderTree, LayoutGrid, Mail, Megaphone, Newspaper, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Usuarios',
        url: '/dashboard/users',
        icon: Users,
        allowedRoles: ['admin'],
    },
    {
        title: 'Categorias',
        url: '/dashboard/categories',
        icon: FolderTree,
        allowedRoles: ['admin'],
    },
    {
        title: 'Noticias',
        url: '/dashboard/news',
        icon: Newspaper,
        allowedRoles: ['admin'],
    },
    {
        title: 'Publicidad',
        url: '/dashboard/ads',
        icon: Megaphone,
        allowedRoles: ['admin'],
    },
    {
        title: 'Contactos',
        url: '/dashboard/contact-messages',
        icon: Mail,
        allowedRoles: ['admin'],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const visibleMainNavItems = mainNavItems.filter((item) => hasRequiredRole(auth.user, item.allowedRoles));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {footerNavItems.length > 0 && <NavFooter items={footerNavItems} className="mt-auto" />}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
