import AppLogoIcon from '@/components/app-logo-icon';
import NavIndex from '@/components/nav-index';
import AppFooter from '@/components/app-footer';
import { type SharedData, type User } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import LoginRegPopupStart from '@/components/login-reg-popup-start';
import { ReactNode } from 'react';
import { BookOpen, FileText, GraduationCap, User as UserIcon } from 'lucide-react';

type WelcomeProps = {
    children?: ReactNode;
}

export default function Welcome({ children }: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="bg-cream text-[#1b1b18] w-full  dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full text-sm not-has-[nav]:hidden">
                    <NavIndex />
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <LoginRegPopupStart />
                </div>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-12 mb-24 md:max-w-7xl">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <AppLogoIcon className="h-16 w-16" />
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                Bcai Notes
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Your comprehensive BCA learning platform with AI-powered assistance
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {/* <Link
                                href="/semesters"
                                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                            >
                                <GraduationCap className="h-5 w-5" />
                                <span>Browse Semesters</span>
                            </Link>
                            <Link
                                href="/syllabus/1"
                                className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <BookOpen className="h-5 w-5" />
                                <span>View Syllabus</span>
                            </Link> */}
                            {user?.isAdmin && (
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition-colors"
                                >
                                    <UserIcon className="h-5 w-5" />
                                    <span>Admin Dashboard</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto mb-4 dark:bg-blue-900">
                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Complete Syllabus
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Access detailed course structures and learning units for all 8 semesters
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4 dark:bg-green-900">
                                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Question Papers
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Download past year question papers to prepare for your exams
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mx-auto mb-4 dark:bg-purple-900">
                                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                AI-Powered Learning
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enhanced learning experience with AI assistance (coming soon)
                            </p>
                        </div>
                    </div>
                </main>

                {children}
                <footer className=' w-full'>
                    <AppFooter />
                </footer>
            </div>
        </>
    );
}
