import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, FileText, Calendar } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type QuestionPaper = {
    id: number;
    course: string;
    year: number;
    file_path: string;
    file_url: string;
};

type Semester = {
    id: number;
    name: string;
};

type Props = {
    semester: Semester;
    questionPapers: Record<string, QuestionPaper[]>;
};

export default function QuestionPaperPage({ semester, questionPapers }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Semesters',
            href: '/semesters',
        },
        {
            title: semester.name,
            href: `/papers/${semester.id}`,
        },
    ];

    const courses = Object.keys(questionPapers);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${semester.name} Question Papers`} />

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
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {semester.name} Question Papers
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Download past year question papers by course
                    </p>
                </div>

                {courses.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            No question papers available
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Question papers will be uploaded soon.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {courses.map((course) => (
                            <div
                                key={course}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                    {course}
                                </h3>

                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {questionPapers[course].map((paper) => (
                                        <div
                                            key={paper.id}
                                            className="flex items-center justify-between rounded-md border border-gray-200 p-4 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {paper.year}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Question Paper
                                                    </p>
                                                </div>
                                            </div>

                                            <a
                                                href={paper.file_url}
                                                download
                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                                                title="Download PDF"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center pt-6">
                    <Link
                        href={`/syllabus/${semester.id}`}
                        className="inline-flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                        <span>View Syllabus</span>
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
} 