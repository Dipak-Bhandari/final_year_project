import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'System Settings', href: '/admin/settings' },
];

export default function SettingsPage() {
    return (
        <AdminLayout title="System Settings" breadcrumbs={breadcrumbs}>
            <Head title="System Settings" />
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center animate-fade-in">
                <h2 className="text-2xl font-bold mb-2">System Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">This page will allow admins to configure system settings. Feature coming soon!</p>
            </div>
        </AdminLayout>
    );
} 