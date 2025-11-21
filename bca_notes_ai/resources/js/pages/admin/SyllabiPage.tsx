import { useMemo, useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { PageHeader } from '@/components/page-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import InputError from '@/components/input-error';
import { Eye, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Semester = {
    id: number;
    name: string;
};

type SyllabusRecord = {
    id: number;
    course: string;
    description?: string | null;
    file_name: string;
    file_path: string;
    file_size: number;
    semester: Semester;
};

type Props = {
    syllabi: SyllabusRecord[];
    semesters: Semester[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Course Management', href: '/admin/syllabi' },
];

export default function SyllabiPage({ syllabi, semesters }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [viewing, setViewing] = useState<SyllabusRecord | null>(null);
    const [editing, setEditing] = useState<SyllabusRecord | null>(null);
    const itemsPerPage = 8;

    const filtered = useMemo(() => {
        return syllabi.filter((syllabus) => {
            const matchesSearch = syllabus.course
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesSemester =
                semesterFilter === 'all' ||
                String(syllabus.semester.id) === semesterFilter;
            return matchesSearch && matchesSemester;
        });
    }, [syllabi, searchTerm, semesterFilter]);

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (syllabus: SyllabusRecord) => {
        setEditing(syllabus);
        setFormOpen(true);
    };

    const handleDelete = (syllabus: SyllabusRecord) => {
        if (
            confirm(
                `Delete "${syllabus.course}" syllabus? This will remove the associated file.`,
            )
        ) {
            router.delete(route('syllabi.destroy', { syllabus: syllabus.id }), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout title="" breadcrumbs={breadcrumbs}>
            <Head title="Syllabus Management" />
            <PageHeader
                title="Syllabus Management"
                description="Centralize and maintain every course syllabus from a single place."
                actions={
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add syllabus
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Courses</CardTitle>
                    <CardDescription>
                        Filter syllabi by semester or search for a specific course.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr,200px]">
                        <Input
                            placeholder="Search by course name"
                            value={searchTerm}
                            onChange={(event) => {
                                setCurrentPage(1);
                                setSearchTerm(event.target.value);
                            }}
                        />
                        <Select
                            value={semesterFilter}
                            onValueChange={(value) => {
                                setCurrentPage(1);
                                setSemesterFilter(value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All semesters" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All semesters</SelectItem>
                                {semesters.map((semester) => (
                                    <SelectItem key={semester.id} value={String(semester.id)}>
                                        {semester.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-border">
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
                                {paginated.length > 0 ? (
                                    paginated.map((syllabus) => (
                                        <TableRow key={syllabus.id}>
                                            <TableCell className="space-y-1">
                                                <p className="font-medium">{syllabus.course}</p>
                                                {syllabus.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {syllabus.description}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {syllabus.semester.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {syllabus.file_name}{' '}
                                                <span className="text-xs">
                                                    ({formatFileSize(syllabus.file_size)})
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setViewing(syllabus)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => openEdit(syllabus)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(syllabus)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                                                <FileText className="h-10 w-10 text-muted-foreground" />
                                                <p className="text-sm text-muted-foreground">
                                                    No syllabi match your filters.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {filtered.length > itemsPerPage && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setCurrentPage((page) => Math.max(1, page - 1));
                                        }}
                                    />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href="#"
                                            isActive={currentPage === index + 1}
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setCurrentPage(index + 1);
                                            }}
                                        >
                                            {index + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setCurrentPage((page) =>
                                                Math.min(totalPages, page + 1),
                                            );
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </CardContent>
            </Card>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit syllabus' : 'Create syllabus'}
                        </DialogTitle>
                        <DialogDescription>
                            Upload PDF files and describe the learning materials students can
                            access.
                        </DialogDescription>
                    </DialogHeader>
                    <SyllabusForm
                        semesters={semesters}
                        syllabus={editing}
                        onClose={() => setFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Syllabus details</DialogTitle>
                    </DialogHeader>
                    {viewing && (
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-xs uppercase text-muted-foreground">Course</p>
                                <p className="text-base font-medium">{viewing.course}</p>
                            </div>
                            {viewing.description && (
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Description
                                    </p>
                                    <p>{viewing.description}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between rounded-md border border-dashed border-border px-4 py-3">
                                <div>
                                    <p className="font-medium">{viewing.file_name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(viewing.file_size)}
                                    </p>
                                </div>
                                <Button asChild variant="outline">
                                    <a
                                        href={route('syllabi.download', { syllabus: viewing.id })}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Download
                                    </a>
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

type SyllabusFormProps = {
    syllabus: SyllabusRecord | null;
    semesters: Semester[];
    onClose: () => void;
};

function SyllabusForm({ syllabus, semesters, onClose }: SyllabusFormProps) {
    const form = useForm<{
        course: string;
        description: string;
        semester_id: string;
        file_name: string;
        file: File | null;
    }>({
        course: syllabus?.course ?? '',
        description: syllabus?.description ?? '',
        semester_id: syllabus ? String(syllabus.semester.id) : '',
        file_name: syllabus?.file_name ?? '',
        file: null,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (syllabus) {
            form.transform((data) => ({
                ...data,
                _method: 'put',
            }));
            form.post(route('syllabi.update', { syllabus: syllabus.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    onClose();
                },
            });
        } else {
            form.post(route('syllabi.store'), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    onClose();
                },
            });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        form.setData('file', file);
        if (file && !form.data.file_name) {
            form.setData('file_name', file.name);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Input
                        id="course"
                        value={form.data.course}
                        onChange={(event) => form.setData('course', event.target.value)}
                        placeholder="Advanced Database Systems"
                    />
                    <InputError message={form.errors.course} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select
                        value={form.data.semester_id}
                        onValueChange={(value) => form.setData('semester_id', value)}
                    >
                        <SelectTrigger id="semester">
                            <SelectValue placeholder="Select a semester" />
                        </SelectTrigger>
                        <SelectContent>
                            {semesters.map((semester) => (
                                <SelectItem key={semester.id} value={String(semester.id)}>
                                    {semester.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.semester_id} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={form.data.description}
                    onChange={(event) => form.setData('description', event.target.value)}
                    placeholder="Provide a short summary of the course content…"
                    rows={4}
                />
                <InputError message={form.errors.description} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="file_name">File name</Label>
                <Input
                    id="file_name"
                    value={form.data.file_name}
                    onChange={(event) => form.setData('file_name', event.target.value)}
                    placeholder="dbms-course-outline.pdf"
                />
                <InputError message={form.errors.file_name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="file">
                    Upload PDF {syllabus ? <span className="text-muted-foreground">(optional)</span> : '*'}
                </Label>
                <div
                    className={cn(
                        'flex flex-col items-center justify-center rounded-md border border-dashed border-border px-6 py-8 text-center',
                        form.errors.file && 'border-destructive',
                    )}
                >
                    <input
                        id="file"
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="sr-only"
                    />
                    {form.data.file ? (
                        <div className="space-y-1">
                            <p className="font-medium">{form.data.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(form.data.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Button
                                type="button"
                                variant="link"
                                className="text-sm"
                                onClick={() => form.setData('file', null)}
                            >
                                Remove file
                            </Button>
                        </div>
                    ) : (
                        <label
                            htmlFor="file"
                            className="cursor-pointer text-sm font-medium text-primary"
                        >
                            Click to upload or drag and drop your PDF (max 10MB)
                        </label>
                    )}
                </div>
                <InputError message={form.errors.file} />
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing
                        ? 'Saving…'
                        : syllabus
                        ? 'Update syllabus'
                        : 'Create syllabus'}
                </Button>
            </div>
        </form>
    );
}

function formatFileSize(bytes: number) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, index);
    return `${value.toFixed(1)} ${units[index]}`;
}