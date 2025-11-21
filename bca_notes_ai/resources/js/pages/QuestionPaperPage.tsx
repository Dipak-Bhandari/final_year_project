import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Download, PlusCircle, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CreateQuestionPaperForm } from './QuestionPaper/partials/CreateQuestionPaperForm';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type QuestionPaper = {
    id: number;
    course: string;
    year: number;
    file_name: string;
    file_url: string;
};

type Semester = {
    id: number;
    name: string;
};

export default function QuestionPaperPage({
    semester,
    questionPapers,
}: PageProps<{ semester: Semester; questionPapers: QuestionPaper[] }>) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDelete = (paperId: number) => {
        router.delete(route('question-papers.destroy', paperId), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            title={`Question Papers - ${semester.name}`}
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: 'Semesters', href: route('semesters.index') },
                { title: semester.name, href: route('semesters.show', semester.id) },
            ]}
        >
            <Head title={`Question Papers - ${semester.name}`} />

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Question Paper Details</CardTitle>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Question Paper
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create New Question Paper</DialogTitle>
                                <DialogDescription>
                                    Fill in the form below to add a new paper for {semester.name}.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateQuestionPaperForm setOpen={setDialogOpen} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>File Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questionPapers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No question papers found.
                                    </TableCell>
                                </TableRow>
                            )}
                            {questionPapers.map((paper) => (
                                <TableRow key={paper.id}>
                                    <TableCell>{paper.course}</TableCell>
                                    <TableCell>{paper.year}</TableCell>
                                    <TableCell>{paper.file_name}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={paper.file_url} download>
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the
                                                        question paper.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(paper.id)}>
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}