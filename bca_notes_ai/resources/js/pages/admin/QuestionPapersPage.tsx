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
import { QuestionPaper, Semester } from '@/types';
import { CreateQuestionPaperForm } from './partials/CreateQuestionPaperForm';

export default function QuestionPapersPage({ questionPapers, semesters }: PageProps<{ questionPapers: QuestionPaper[], semesters: Semester[] }>) {
    const [open, setOpen] = useState(false);
    const { delete: destroy, processing } = useForm();

    const deletePaper = (paper: QuestionPaper) => {
        if (!confirm('Are you sure you want to delete this question paper?')) {
            return;
        }
        destroy(route('question-papers.destroy', { questionPaper: paper.id }));
    };

    return (
        <AdminLayout
            title="Question Papers"
            breadcrumbs={[
                { title: 'Dashboard', href: route('dashboard') },
                { title: 'Course Management', href: '#' },
                { title: 'Question Papers', href: route('admin.question-papers.index') },
            ]}
        >
            <Head title="Question Papers" />

            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Question Paper Management</CardTitle>
                            <CardDescription>Manage and upload question papers for each semester</CardDescription>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Paper
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New Question Paper</DialogTitle>
                                    <DialogDescription>
                                        Fill in the form below to add a new paper.
                                    </DialogDescription>
                                </DialogHeader>
                                <CreateQuestionPaperForm setOpen={setOpen} semesters={semesters} />
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 flex items-center justify-between">
                            <div className="w-1/3">
                                <Input placeholder="Search papers..." />
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
                                {questionPapers.length > 0 ? (
                                    questionPapers.map((paper) => (
                                        <TableRow key={paper.id}>
                                            <TableCell>
                                                <div className="font-medium">{paper.title}</div>
                                                <div className="text-sm text-muted-foreground">Year: {paper.year}</div>
                                            </TableCell>
                                            <TableCell>{paper.semester?.name}</TableCell>
                                            <TableCell>
                                                <a
                                                    href={`/storage/${paper.file_path}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm text-blue-600 hover:underline"
                                                >
                                                    <FileIcon className="mr-2 h-4 w-4" />
                                                    {paper.file_name} ({paper.file_size})
                                                </a>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="icon" asChild>
                                                    <a href={`/storage/${paper.file_path}`} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => deletePaper(paper)}
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
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No papers found</h3>
                                                <p className="text-base text-gray-500 dark:text-gray-400">Get started by adding a new paper.</p>
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

// Dummy data for now
const dummyPapers = [
    { id: 1, title: '2022 Midterm', semester: 'First Semester', file_name: 'midterm2022.pdf', file_size: 1024000 },
    { id: 2, title: '2021 Final', semester: 'Second Semester', file_name: 'final2021.pdf', file_size: 2048000 },
];
const dummySemesters = [
    { id: 1, name: 'First Semester' },
    { id: 2, name: 'Second Semester' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Course Management', href: '/admin/syllabi' },
    { title: 'Question Papers', href: '/admin/question-papers' },
];

function formatFileSize(bytes: number) {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function QuestionPapersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPaper, setSelectedPaper] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState<number | ''>('');

    const filteredPapers = dummyPapers.filter(paper => {
        const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = selectedSemester === '' || paper.semester === dummySemesters.find(s => s.id === selectedSemester)?.name;
        return matchesSearch && matchesSemester;
    });

    const handleAdd = () => {
        setSelectedPaper(null);
        setIsModalOpen(true);
    };
    const handleEdit = (paper: any) => {
        setSelectedPaper(paper);
        setIsModalOpen(true);
    };
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this question paper?')) {
            // Handle delete
        }
    };

    return (
        <AdminLayout title="Question Papers" breadcrumbs={breadcrumbs}>
            <Head title="Question Papers" />
            <div className="p-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Question Papers Management
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Manage and upload question papers for each semester
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Question Paper
                    </button>
                </div>
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search question papers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value ? Number(e.target.value) : '')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All Semesters</option>
                        {dummySemesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl overflow-hidden">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">File</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPapers.map((paper, idx) => (
                                <tr key={paper.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/30`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{paper.title}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{paper.semester}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                            <FileText className="w-4 h-4" />
                                            <span>{paper.file_name}</span>
                                            <span className="text-xs text-gray-400">({formatFileSize(paper.file_size)})</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button onClick={() => { }} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                                            <button onClick={() => handleEdit(paper)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(paper.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredPapers.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No question papers found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by uploading a new question paper.</p>
                    </div>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedPaper ? 'Edit Question Paper' : 'Add Question Paper'}
                size="lg"
                className="animate-fade-in shadow-2xl rounded-2xl"
            >
                <QuestionPaperForm
                    paper={selectedPaper}
                    semesters={dummySemesters}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </AdminLayout>
    );
}

function QuestionPaperForm({ paper, semesters, onClose }: { paper: any; semesters: any[]; onClose: () => void }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: paper?.title || '',
        semester_id: paper?.semester_id || '',
        file: null as File | null,
        file_name: paper?.file_name || '',
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement backend logic
        onClose();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            if (!data.file_name) setData('file_name', file.name);
        }
    };
    const removeFile = () => setData('file', null);
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required />
                {errors.title && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.title}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester *</label>
                <select value={data.semester_id} onChange={e => setData('semester_id', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required>
                    <option value="">Select Semester</option>
                    {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {errors.semester_id && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.semester_id}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">File Name *</label>
                <input type="text" value={data.file_name} onChange={e => setData('file_name', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required />
                {errors.file_name && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.file_name}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">PDF File *</label>
                <div className="mt-1">
                    {data.file ? (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                            <FileText className="w-5 h-5 text-green-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900 dark:text-green-100">{data.file.name}</p>
                                <p className="text-xs text-green-600 dark:text-green-400">{(data.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button type="button" onClick={removeFile} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"><X className="w-4 h-4" /></button>
                        </div>
                    ) : (
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">PDF up to 10MB</p>
                            </div>
                        </div>
                    )}
                </div>
                {errors.file && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.file}</p>}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all">{processing ? 'Saving...' : (paper ? 'Update' : 'Create') + ' Paper'}</button>
            </div>
        </form>
    );
} 