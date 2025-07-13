import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    BookOpen,
    FileText,
    Users,
    Settings,
    BarChart3,
    Upload,
    ChevronDown,
    GraduationCap,
    Database,
    Shield,
    LucideIcon
} from 'lucide-react';
import { type SharedData } from '@/types';

type AdminSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

type MenuItem = {
    title: string;
    href?: string;
    icon: LucideIcon;
    section?: string;
    items?: {
        title: string;
        href: string;
        icon: LucideIcon;
    }[];
};

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const { auth } = usePage<SharedData>().props;
    const [expandedSections, setExpandedSections] = useState<string[]>(['course-management']);

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const menuItems: MenuItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: BarChart3,
        },
        {
            title: 'Course Management',
            icon: BookOpen,
            section: 'course-management',
            items: [
                { title: 'Syllabi', href: '/admin/syllabi', icon: BookOpen },
                { title: 'Question Papers', href: '/admin/question-papers', icon: FileText },
                { title: 'Upload Resources', href: '/admin/upload', icon: Upload },
            ]
        },
        {
            title: 'User Management',
            href: '/admin/users',
            icon: Users,
        },
        {
            title: 'Semester Management',
            href: '/admin/semesters',
            icon: GraduationCap,
        }
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
                transform transition-transform duration-300 ease-in-out z-50
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Admin Panel
                    </h2>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {auth.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {auth.user?.name || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Super Admin
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.title}>
                                {item.section ? (
                                    // Expandable section
                                    <div>
                                        <button
                                            onClick={() => toggleSection(item.section!)}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <item.icon className="w-5 h-5" />
                                                <span>{item.title}</span>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 transition-transform ${expandedSections.includes(item.section!) ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>
                                        {expandedSections.includes(item.section!) && (
                                            <ul className="mt-2 ml-8 space-y-1">
                                                {item.items?.map((subItem) => (
                                                    <li key={subItem.title}>
                                                        <Link
                                                            href={subItem.href}
                                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                                        >
                                                            <subItem.icon className="w-4 h-4" />
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    // Regular menu item
                                    <Link
                                        href={item.href!}
                                        className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.title}</span>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                        href="/"
                        className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Site</span>
                    </Link>
                </div>
            </div>
        </>
    );
} 