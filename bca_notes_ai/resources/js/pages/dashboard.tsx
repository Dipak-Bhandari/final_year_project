import { Head } from '@inertiajs/react';
import { BookOpen, FileText, GraduationCap, Users, Upload, Settings } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs} title="">
            <Head title="Admin Dashboard" />
            <div className="space-y-4 animate-fade-in">
                <div className="text-center">
                    <p className=" text-black text-2xl text-left dark:text-white">
                        Manage BCA Notes platform content and users
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-gray-200 bg-[#f5f5f5] p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 transition-transform hover:scale-[1.03] hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Semesters</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">8</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 transition-transform hover:scale-[1.03] hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Syllabi</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">32</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 transition-transform hover:scale-[1.03] hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Question Papers</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 transition-transform hover:scale-[1.03] hover:shadow-lg">
                        <div className="flex items-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                                <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">2</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <Link href="/admin/question-papers" className="flex items-center space-x-3 rounded-xl border border-blue-200 p-4 bg-blue-50 hover:bg-blue-100 transition-all dark:border-blue-900 dark:bg-blue-950 dark:hover:bg-blue-900 shadow-sm">
                            <Upload className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                                Upload Question Paper
                            </span>
                        </Link>
                        <Link href="/admin/syllabi" className="flex items-center space-x-3 rounded-xl border border-green-200 p-4 bg-green-50 hover:bg-green-100 transition-all dark:border-green-900 dark:bg-green-950 dark:hover:bg-green-900 shadow-sm">
                            <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-semibold text-green-900 dark:text-green-200">
                                Manage Syllabi
                            </span>
                        </Link>
                        <Link href="/admin/settings" className="flex items-center space-x-3 rounded-xl border border-purple-200 p-4 bg-purple-50 hover:bg-purple-100 transition-all dark:border-purple-900 dark:bg-purple-950 dark:hover:bg-purple-900 shadow-sm">
                            <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                                Platform Settings
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>Database seeded with 8 semesters</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>Syllabi added for first 2 semesters</span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            <span>Super admin account created</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
