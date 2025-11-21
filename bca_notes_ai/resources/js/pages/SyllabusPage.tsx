import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Eye, File, PlusCircle, Trash } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { CreateSyllabusForm } from './Syllabus/partials/CreateSyllabusForm';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Semester, Syllabus } from '@/types/model';

export default function SyllabusPage({ syllabi, semesters }: PageProps<{ syllabi: Syllabus[], semesters: Semester[] }>) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const deleteSyllabus = (syllabus: Syllabus) => {
        if (!confirm('Are you sure you want to delete this syllabus?')) {
            return;
        }
        destroy(route('syllabi.destroy', { syllabus: syllabus.id }));
    };

    return (
        <AdminLayout
            title="Syllabus Management"
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: 'Course Management', href: '#' },
                { title: 'Syllabi', href: route('admin.syllabi.index') },
            ]}
        >
            <Head title="Syllabus Management" />

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Syllabus Management</CardTitle>
                            <CardDescription>Manage course syllabi and learning materials</CardDescription>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Syllabus
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Syllabus</DialogTitle>
                                    <DialogDescription>
                                        Fill in the form below to add a new syllabus.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateSyllabusForm setOpen={setOpen} semesters={semesters} />
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="w-1/3">
                                <Input placeholder="Search syllabi..." />
                            </div>
                            <div className="w-1/4">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All Semesters" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Semesters</SelectItem>
                                        {semesters.map((semester) => (
                                            <SelectItem key={semester.id} value={String(semester.id)}>
                                                {semester.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>File</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {syllabi.length > 0 ? (
                                    syllabi.map((syllabus) => (
                                        <TableRow key={syllabus.id}>
                                            <TableCell>
                                                <div className="font-medium">{syllabus.course}</div>
                                                <div className="text-sm text-muted-foreground">{syllabus.description}</div>
                                            </TableCell>
                                            <TableCell>{syllabus.semester?.name}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={route('syllabi.download', { syllabus: syllabus.id })}
                                                    className="flex items-center text-sm text-blue-600 hover:underline"
                                                >
                                                    <File className="mr-2 h-4 w-4" />
                                                    {syllabus.file_name} ({syllabus.file_size})
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <Link href={route('syllabi.download', { syllabus: syllabus.id })}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => deleteSyllabus(syllabus)}
                                                    disabled={processing}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No syllabi found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}