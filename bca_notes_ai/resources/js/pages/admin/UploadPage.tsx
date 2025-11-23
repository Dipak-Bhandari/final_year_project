import { useMemo, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { type Resource, type Semester } from '@/types';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Eye, FileText, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { CreateResourceForm } from './partials/CreateResourceForm';

type PageProps = {
    resources: Resource[];
    semesters: Semester[];
};

export default function UploadPage({ resources, semesters }: PageProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('all');
    const { delete: destroy, processing } = useForm();

    const filtered = useMemo(() => {
        return resources.filter((resource) => {
            const matchesSearch = resource.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesSemester =
                semesterFilter === 'all' ||
                String(resource.semester?.id) === semesterFilter;
            return matchesSearch && matchesSemester;
        });
    }, [resources, searchTerm, semesterFilter]);

    const deleteResource = (resource: Resource) => {
        if (!confirm(`Delete ${resource.title}? This action cannot be undone.`)) {
            return;
        }
        destroy(route('resources.destroy', { resource: resource.id }), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout
            title=""
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: 'Course Management', href: '#' },
                { title: 'Upload Resources', href: route('admin.resources.index') },
            ]}
        >
            <Head title="Upload Resources" />
            <PageHeader
                title="Upload Resources"
                description="Publish lecture notes, assignments, images, and supporting files for students."
                actions={
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add resource
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[480px]">
                            <DialogHeader>
                                <DialogTitle>Create new resource</DialogTitle>
                                <DialogDescription>
                                    Upload PDF files or images and map them to the right semester.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateResourceForm setOpen={setDialogOpen} semesters={semesters} />
                        </DialogContent>
                    </Dialog>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Resource library</CardTitle>
                    <CardDescription>
                        Search or filter to quickly find the asset you want to share.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 grid gap-3 sm:grid-cols-[1fr,200px]">
                        <Input
                            placeholder="Search resources..."
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
                                filtered.map((resource) => (
                                    <TableRow key={resource.id}>
                                        <TableCell>
                                            <div className="font-medium">{resource.title}</div>
                                            {resource.description && (
                                                <div className="text-sm text-muted-foreground">
                                                    {resource.description}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{resource.semester?.name ?? '—'}</TableCell>
                                        <TableCell>
                                            <a
                                                href={`/storage/${resource.file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-sm text-blue-600 hover:underline"
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                {resource.file_name}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <a
                                                        href={`/storage/${resource.file_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive"
                                                    disabled={processing}
                                                    onClick={() => deleteResource(resource)}
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
                                            <h3 className="text-base font-medium">
                                                No resources found
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                Try adjusting your filters or add a new resource.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}