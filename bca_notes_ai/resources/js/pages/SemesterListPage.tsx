import { Head, Link } from '@inertiajs/react';
import { BookOpen, FileText, GraduationCap } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Semesters',
        href: '/semesters',
    },
];

type Semester = {
    id: number;
    name: string;
    syllabi_count: number;
    question_papers_count: number;
};

type Props = {
    semesters: Semester[];
};

export default function SemesterListPage({ semesters }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Semesters" />

            <div className="space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        BCA Semester Overview
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Browse through all semesters to access syllabi and question papers
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {semesters.map((semester) => (
                        <div
                            key={semester.id}
                            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                        <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {semester.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="h-4 w-4" />
                                        <span>Syllabi</span>
                                    </div>
                                    <span className="font-medium">{semester.syllabi_count}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4" />
                                        <span>Question Papers</span>
                                    </div>
                                    <span className="font-medium">{semester.question_papers_count}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex space-x-2">
                                <Link
                                    href={`/syllabus/${semester.id}`}
                                    className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    View Syllabus
                                </Link>
                                <Link
                                    href={`/papers/${semester.id}`}
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    View Papers
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
} 