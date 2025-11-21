import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/admin-layout';
import { Eye, File as FileIcon, PlusCircle, Trash } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Resource, Semester } from '@/types';
import { CreateResourceForm } from './partials/CreateResourceForm';

export default function UploadPage({ resources, semesters }: PageProps<{ resources: Resource[], semesters: Semester[] }>) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const deleteResource = (resource: Resource) => {
        if (!confirm('Are you sure you want to delete this resource?')) {
            return;
        }
        destroy(route('resources.destroy', { resource: resource.id }));
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

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Upload Resources</CardTitle>
                            <CardDescription>Upload and manage resource files for students</CardDescription>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Resource
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Resource</DialogTitle>
                                    <DialogDescription>
                                        Fill in the form below to add a new resource.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateResourceForm setOpen={setOpen} semesters={semesters} />
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="w-1/3">
                                <Input placeholder="Search resources..." />
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
                                    <TableHead>Title</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>File</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {resources.length > 0 ? (
                                    resources.map((resource) => (
                                        <TableRow key={resource.id}>
                                            <TableCell>
                                                <div className="font-medium">{resource.title}</div>
                                                <div className="text-sm text-muted-foreground">{resource.description}</div>
                                            </TableCell>
                                            <TableCell>{resource.semester?.name}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={`/storage/${resource.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm text-blue-600 hover:underline"
                                                >
                                                    <FileIcon className="mr-2 h-4 w-4" />
                                                    {resource.file_name} ({resource.file_size})
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <a href={`/storage/${resource.file_path}`} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => deleteResource(resource)}
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
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <FileIcon className="h-12 w-12 text-gray-400" />
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
                                                <p className="text-base text-gray-500 dark:text-gray-400">Get started by adding a new resource.</p>
                                            </div>
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

function ResourceForm({ resource, onClose, afterSave }: { resource: any; onClose: () => void; afterSave: () => void }) {
    const { data, setData, reset, processing, errors, setError } = useForm({
        title: resource?.title || '',
        semester: resource?.semester || '',
        file: null as File | null,
        description: resource?.description || '',
    });
    const [fileError, setFileError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            if (file.type !== 'application/pdf') {
                setFileError('Only PDF files are allowed.');
                setData('file', null);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setFileError('File size must be less than 10MB.');
                setData('file', null);
                return;
            }
            setFileError(null);
            setData('file', file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('semester', data.semester);
        if (data.file) formData.append('file', data.file);
        formData.append('description', data.description || '');
        try {
            if (resource) {
                await axios.post(`/resources/${resource.id}?_method=PUT`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                await axios.post('/resources', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            afterSave();
            onClose();
            reset();
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.errors) {
                Object.entries(err.response.data.errors).forEach(([key, val]) => setError(key as keyof typeof data, val as string));
            } else {
                alert('Failed to save resource.');
            }
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required />
                {errors.title && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.title}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester *</label>
                <select value={data.semester} onChange={e => setData('semester', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required>
                    <option value="">Select semester</option>
                    {semesters.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                {errors.semester && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.semester}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">File (PDF, max 10MB) *</label>
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required={!resource} />
                {fileError && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{fileError}</p>}
                {errors.file && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.file}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea value={data.description} onChange={e => setData('description', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" rows={3} />
                {errors.description && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.description}</p>}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={processing || submitting} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all">{submitting ? 'Saving...' : (resource ? 'Update' : 'Create') + ' Resource'}</button>
            </div>
        </form>
    );
} 