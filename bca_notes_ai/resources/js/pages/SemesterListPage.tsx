import { PageProps } from '@/types';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, GraduationCap } from 'lucide-react';

type Semester = {
    id: number;
    name: string;
    syllabi_count: number;
    question_papers_count: number;
};

export default function SemesterListPage({ semesters }: PageProps<{ semesters: Semester[] }>) {
    return (
        <AdminLayout
            title="Semesters"
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: 'Semesters', href: route('semesters.index') },
            ]}
        >
            <Head title="All Semesters" />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {semesters.map((semester) => (
                    <Card key={semester.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-6 w-6" />
                                {semester.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <BookOpen className="h-4 w-4" />
                                    <span>Syllabi</span>
                                </div>
                                <span className="font-medium">{semester.syllabi_count}</span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4" />
                                    <span>Question Papers</span>
                                </div>
                                <span className="font-medium">{semester.question_papers_count}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="grid grid-cols-2 gap-2">
                            <Button asChild variant="outline">
                                <Link href={route('semesters.syllabi.index', { semester: semester.id })}>
                                    View Syllabus
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('semesters.question-papers.index', { semester: semester.id })}>
                                    View Papers
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </AdminLayout>
    );
}