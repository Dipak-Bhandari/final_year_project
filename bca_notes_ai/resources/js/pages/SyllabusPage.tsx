import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type Syllabus = {
    id: number;
    course: string;
    units: string[];
};

type Semester = {
    id: number;
    name: string;
};

type Props = {
    semester: Semester;
    syllabi: Syllabus[];
};

export default function SyllabusPage({ semester, syllabi }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Semesters',
            href: '/semesters',
        },
        {
            title: semester.name,
            href: `/syllabus/${semester.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${semester.name} Syllabus`} />

            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/semesters"
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back to Semesters</span>
                    </Link>
                </div>

                <div className="text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {semester.name} Syllabus
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Complete course structure and learning units
                    </p>
                </div>

                {syllabi.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            No syllabi available
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Syllabus content will be added soon.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {syllabi.map((syllabus) => (
                            <div
                                key={syllabus.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {syllabus.course}
                                </h3>

                                <div className="space-y-3">
                                    {syllabus.units.map((unit, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3 rounded-md bg-gray-50 p-3 dark:bg-gray-700"
                                        >
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                {unit}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center pt-6">
                    <Link
                        href={`/papers/${semester.id}`}
                        className="inline-flex items-center space-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                    >
                        <span>View Question Papers</span>
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
} 