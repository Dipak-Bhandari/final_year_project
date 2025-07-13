import { Head } from '@inertiajs/react';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { AppContent } from '@/components/app-content';
import { type BreadcrumbItem } from '@/types';

type AdminLayoutProps = {
    children: React.ReactNode;
    title: string;
    breadcrumbs?: BreadcrumbItem[];
};

export default function AdminLayout({ children, title, breadcrumbs = [] }: AdminLayoutProps) {
    return (
        <AppShell variant="header">
            <Head title={title} />
            <AppHeader breadcrumbs={breadcrumbs} />
            {/* <AppContent variant="header" className="p-3 md:p-4 lg:p-6 max-w-7xl mx-auto" style={{ fontSize: '1.2em' }}> */}
            <AppContent variant="header" className="px-10 lg:px-60" style={{ fontSize: '1.2em' }}>
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        {title}
                    </h1>
                </div>

                {/* Main Content Area */}
                <main className="animate-fade-in">
                    {children}
                </main>
            </AppContent>
        </AppShell>
    );
} 