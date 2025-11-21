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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Eye, FileText, Pencil, Plus, Trash2 } from 'lucide-react';

type Semester = {
    id: number;
    name: string;
};

type QuestionPaperRecord = {
    id: number;
    title: string;
    year?: string | number;
    file_name: string;
    file_size: number;
    file_path: string;
    semester?: Semester | null;
};

type Props = {
    questionPapers: QuestionPaperRecord[];
    semesters: Semester[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Course Management', href: '/admin/question-papers' },
];

export default function QuestionPapersPage({ questionPapers, semesters }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewing, setViewing] = useState<QuestionPaperRecord | null>(null);
    const [editing, setEditing] = useState<QuestionPaperRecord | null>(null);

    const filtered = useMemo(() => {
        return questionPapers.filter((paper) => {
            const matchesSearch = paper.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesSemester =
                semesterFilter === 'all' ||
                String(paper.semester?.id) === semesterFilter;
            return matchesSearch && matchesSemester;
        });
    }, [questionPapers, searchTerm, semesterFilter]);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (paper: QuestionPaperRecord) => {
        setEditing(paper);
        setDialogOpen(true);
    };

    const handleDelete = (paper: QuestionPaperRecord) => {
        if (!confirm(`Delete ${paper.title}? This action cannot be undone.`)) {
            return;
        }
        router.delete(route('question-papers.destroy', { questionPaper: paper.id }), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title="Question Papers" breadcrumbs={breadcrumbs}>
            <Head title="Question Papers" />
            <PageHeader
                title="Question Papers"
                description="Organize and distribute past papers across every semester from a single workspace."
                actions={
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add paper
                    </Button>
                }
            />

                <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Archive</CardTitle>
                    <CardDescription>
                        Search by title or filter by semester to find the paper you need.
                    </CardDescription>
                    </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr,220px]">
                        <Input
                            placeholder="Search papers"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                        <Select
                            value={semesterFilter}
                            onValueChange={(value) => setSemesterFilter(value)}
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
                                    <TableHead>Title</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>File</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.length > 0 ? (
                                    filtered.map((paper) => (
                                        <TableRow key={paper.id}>
                                            <TableCell className="space-y-1">
                                                <p className="font-medium">{paper.title}</p>
                                                {paper.year && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Year: {paper.year}
                                                    </p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {paper.semester ? (
                                                    paper.semester.name
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {paper.file_name}{' '}
                                                <span className="text-xs">
                                                    ({formatFileSize(paper.file_size)})
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => setViewing(paper)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => openEdit(paper)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                        variant="ghost"
                                                    size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDelete(paper)}
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
                                                    No papers match your filters.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit question paper' : 'Add question paper'}
                        </DialogTitle>
                        <DialogDescription>
                            Upload a PDF and provide metadata so students can find it later.
                        </DialogDescription>
                    </DialogHeader>
                    <QuestionPaperForm
                        semesters={semesters}
                        paper={editing}
                        onClose={() => setDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Paper details</DialogTitle>
                    </DialogHeader>
                    {viewing && (
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-xs uppercase text-muted-foreground">Title</p>
                                <p className="text-base font-medium">{viewing.title}</p>
                            </div>
                            {viewing.semester && (
                                <div>
                                    <p className="text-xs uppercase text-muted-foreground">
                                        Semester
                                    </p>
                                    <p>{viewing.semester.name}</p>
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
                                        href={`/storage/${viewing.file_path}`}
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

type QuestionPaperFormProps = {
    paper: QuestionPaperRecord | null;
    semesters: Semester[];
    onClose: () => void;
};

function QuestionPaperForm({ paper, semesters, onClose }: QuestionPaperFormProps) {
    const form = useForm<{
        title: string;
        semester_id: string;
        year: string;
        file_name: string;
        file: File | null;
    }>({
        title: paper?.title ?? '',
        semester_id: paper?.semester ? String(paper.semester.id) : '',
        year: paper?.year ? String(paper.year) : '',
        file_name: paper?.file_name ?? '',
        file: null,
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (paper) {
            form.transform((data) => ({
                ...data,
                _method: 'put',
            }));
            form.post(route('question-papers.update', { questionPaper: paper.id }), {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    onClose();
                },
            });
        } else {
            form.post(route('question-papers.store'), {
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
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={form.data.title}
                    onChange={(event) => form.setData('title', event.target.value)}
                    placeholder="Final Examination"
                />
                <InputError message={form.errors.title} />
                    </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                        id="year"
                        type="number"
                        inputMode="numeric"
                        value={form.data.year}
                        onChange={(event) => form.setData('year', event.target.value)}
                        placeholder="2024"
                    />
                    <InputError message={form.errors.year} />
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
                <Label htmlFor="file_name">File name</Label>
                <Input
                    id="file_name"
                    value={form.data.file_name}
                    onChange={(event) => form.setData('file_name', event.target.value)}
                    placeholder="cs-final-2024.pdf"
                />
                <InputError message={form.errors.file_name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="file">
                    Upload PDF {paper ? <span className="text-muted-foreground">(optional)</span> : '*'}
                </Label>
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border px-6 py-8 text-center">
                    <input
                        id="file"
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                    />
                    {form.data.file ? (
                        <>
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
                        </>
                    ) : (
                        <label htmlFor="file" className="cursor-pointer text-sm font-medium text-primary">
                            Click to upload or drag and drop (PDF, max 10MB)
                                    </label>
                    )}
                </div>
                <InputError message={form.errors.file} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={form.processing}>
                    {form.processing
                        ? 'Saving…'
                        : paper
                        ? 'Update paper'
                        : 'Create paper'}
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
