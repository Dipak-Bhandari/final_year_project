import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FileText, Users, Settings, BarChart3, Upload, GraduationCap, Database, Shield, LayoutGrid, ChevronDown } from 'lucide-react';
import AppLogo from './app-logo';
import { useState } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const isSuperAdmin = auth?.user?.role === 'super_admin' || auth?.user?.isAdmin;
    const page = usePage();
    const [expandedSections, setExpandedSections] = useState<string[]>(['course-management']);
    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };
    return (
        <Sidebar variant="inset" className="shadow-lg border-r-0">
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

            <SidebarContent className="overflow-hidden max-h-screen">
                <NavMain items={mainNavItems} />
                {isSuperAdmin && (
                    <SidebarGroup className="px-2 py-0 space-y-1 mt-4  bg-gray-50 dark:bg-gray-900/60 ">
                        <SidebarGroupLabel className="uppercase tracking-wide text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 pl-2 text-[13px]">Admin</SidebarGroupLabel>
                        <SidebarMenu>
                            {/* Course Management expandable group */}
                            <SidebarMenuItem>
                                <button
                                    type="button"
                                    onClick={() => toggleSection('course-management')}
                                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-base font-medium text-gray-700 dark:text-gray-200"
                                >
                                    <span className="flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Course Management
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.includes('course-management') ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedSections.includes('course-management') && (
                                    <SidebarMenu className="ml-6 mt-1">
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild tooltip={{ children: 'Syllabi' }} className={`rounded-lg px-2 py-2 flex items-center gap-2 transition-colors text-base font-medium ${page.url.startsWith('/admin/syllabi') ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200'}`}>
                                                <Link href="/admin/syllabi" prefetch>
                                                    <BookOpen className="w-5 h-5" />
                                                    <span>Syllabus</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild tooltip={{ children: 'Question Papers' }} className={`rounded-lg px-2 py-2 flex items-center gap-2 transition-colors text-base font-medium ${page.url.startsWith('/admin/question-papers') ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200'}`}>
                                                <Link href="/admin/question-papers" prefetch>
                                                    <FileText className="w-5 h-5" />
                                                    <span>Question Papers</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild tooltip={{ children: 'Upload Resources' }} className={`rounded-lg px-2 py-2 flex items-center gap-2 transition-colors text-base font-medium ${page.url.startsWith('/admin/upload') ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200'}`}>
                                                <Link href="/admin/upload" prefetch>
                                                    <Upload className="w-5 h-5" />
                                                    <span>Upload Resources</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                )}
                            </SidebarMenuItem>
                            {/* User Management link */}
                            {/* <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={{ children: 'User Management' }} className={`rounded-lg px-2 py-2 flex items-center gap-2 transition-colors text-base font-medium ${page.url.startsWith('/admin/users') ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200'}`}>
                                    <Link href="/admin/users" prefetch>
                                        <Users className="w-5 h-5" />
                                        <span>User Management</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem> */}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-2 px-4 bg-[#f5f5f5]/90 dark:bg-gray-900/80">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
