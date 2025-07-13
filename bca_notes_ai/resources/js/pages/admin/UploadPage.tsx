import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import Modal from '@/components/ui/modal';
import { Plus, Eye, Edit, Trash2, FileText, Search } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Course Management', href: '/admin/syllabi' },
    { title: 'Upload Resources', href: '/admin/upload' },
];

const semesters = [
    { value: '1', label: 'Semester 1' },
    { value: '2', label: 'Semester 2' },
    { value: '3', label: 'Semester 3' },
    { value: '4', label: 'Semester 4' },
    { value: '5', label: 'Semester 5' },
    { value: '6', label: 'Semester 6' },
];

export default function UploadPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchResources = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/resources');
            setResources(res.data.resources);
        } catch (err: any) {
            setError('Failed to load resources.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleAdd = () => {
        setSelectedResource(null);
        setIsModalOpen(true);
    };
    const handleEdit = (resource: any) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };
    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            try {
                await axios.delete(`/resources/${id}`);
                setResources(resources.filter(r => r.id !== id));
            } catch {
                alert('Failed to delete resource.');
            }
        }
    };

    const filteredResources = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const paginatedResources = filteredResources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <AdminLayout title="" breadcrumbs={breadcrumbs}>
            <Head title="Upload Resources" />
            <div className="animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Resources</h2>
                        <p className="mt-1 text-base text-gray-600 dark:text-gray-400">Upload and manage resource files for students</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="mt-4 sm:mt-0 inline-flex items-center px-5 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Resource
                    </button>
                </div>
                <div className="mb-6">
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading resources...</div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl overflow-hidden text-base">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semester</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">File</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedResources.map((resource, idx) => (
                                    <tr key={resource.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/30`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-base font-semibold text-gray-900 dark:text-white">{resource.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{semesters.find(s => s.value === resource.semester)?.label}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <a href={resource.file_path ? `/storage/${resource.file_path}` : '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1"><FileText className="w-5 h-5" />{resource.file_path?.split('/').pop()}</a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-base text-gray-500 dark:text-gray-400">{resource.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button onClick={() => { }} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" title="View"><Eye className="w-5 h-5" /></button>
                                                <button onClick={() => handleEdit(resource)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors" title="Edit"><Edit className="w-5 h-5" /></button>
                                                <button onClick={() => handleDelete(resource.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Pagination Controls */}
                {totalPages > 1 && !loading && !error && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => handlePageChange(idx + 1)}
                                className={`px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
                {filteredResources.length === 0 && !loading && !error && (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No resources found</h3>
                        <p className="mt-1 text-base text-gray-500 dark:text-gray-400">Get started by adding a new resource.</p>
                    </div>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedResource ? 'Edit Resource' : 'Add Resource'}
                size="lg"
                className="animate-fade-in shadow-2xl rounded-2xl"
            >
                <ResourceForm
                    resource={selectedResource}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchResources();
                    }}
                    afterSave={fetchResources}
                />
            </Modal>
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