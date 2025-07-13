import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Semester Management', href: '/admin/semesters' },
];

export default function SemestersPage() {
    return (
        <AdminLayout title="Semester Management" breadcrumbs={breadcrumbs}>
            <Head title="Semester Management" />
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center animate-fade-in">
                <h2 className="text-2xl font-bold mb-2">Semester Management</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">This page will allow admins to manage semesters. Feature coming soon!</p>
            </div>
        </AdminLayout>
    );
} 