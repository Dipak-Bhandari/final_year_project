import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Eye, Trash2, BookOpen, Search, Upload, X } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import Modal from '@/components/ui/modal';
import { type BreadcrumbItem } from '@/types';

type Syllabus = {
    id: number;
    course: string;
    description?: string;
    file_name: string;
    file_path: string;
    file_size: number;
    semester: {
        id: number;
        name: string;
    };
};

type Semester = {
    id: number;
    name: string;
};

type Props = {
    syllabi: Syllabus[];
    semesters: Semester[];
    errors?: Record<string, string>;
};

export default function SyllabiPage({ syllabi, semesters, errors }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSemester, setSelectedSemester] = useState<number | ''>('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Course Management', href: '/admin/syllabi' },
        { title: 'Syllabi', href: '/admin/syllabi' },
    ];

    const filteredSyllabi = syllabi.filter(syllabus => {
        const matchesSearch = syllabus.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSemester = selectedSemester === '' || syllabus.semester.id === selectedSemester;
        return matchesSearch && matchesSemester;
    });

    const totalPages = Math.ceil(filteredSyllabi.length / itemsPerPage);
    const paginatedSyllabi = filteredSyllabi.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAdd = () => {
        setSelectedSyllabus(null);
        setIsModalOpen(true);
    };

    const handleEdit = (syllabus: Syllabus) => {
        setSelectedSyllabus(syllabus);
        setIsModalOpen(true);
    };

    const handleView = (syllabus: Syllabus) => {
        setSelectedSyllabus(syllabus);
        setIsViewModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this syllabus?')) {
            // Handle delete with Inertia
            // router.delete(`/syllabi/${id}`);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AdminLayout title="" breadcrumbs={breadcrumbs}>
            <Head title="" />

            <div>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Syllabus Management
                        </h2>
                        <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                            Manage course syllabi and learning materials
                        </p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="mt-4 sm:mt-0 inline-flex items-center px-5 py-3 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Syllabus
                    </button>
                </div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search syllabi..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                        />
                    </div>
                    <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value ? Number(e.target.value) : '')}
                        className="px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                    >
                        <option value="">All Semesters</option>
                        {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                                {semester.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Syllabi Table */}
                <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl overflow-hidden text-base">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Semester
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    File
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {paginatedSyllabi.map((syllabus, idx) => (
                                <tr key={syllabus.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/30`}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                                            {syllabus.course}
                                        </div>
                                        {syllabus.description && (
                                            <div className="text-base text-gray-500 dark:text-gray-400">
                                                {syllabus.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base text-gray-500 dark:text-gray-400">
                                            {syllabus.semester.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-base text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center space-x-2">
                                                <BookOpen className="w-5 h-5" />
                                                <span>{syllabus.file_name}</span>
                                                <span className="text-xs text-gray-400">
                                                    ({formatFileSize(syllabus.file_size)})
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-base font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            <button
                                                onClick={() => handleView(syllabus)}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(syllabus)}
                                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(syllabus.id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
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

                {filteredSyllabi.length === 0 && (
                    <div className="text-center py-12">
                        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                            No syllabi found
                        </h3>
                        <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                            Get started by creating a new syllabus.
                        </p>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedSyllabus ? 'Edit Syllabus' : 'Add Syllabus'}
                size="lg"
                className="animate-fade-in shadow-2xl rounded-2xl"
            >
                <SyllabusForm
                    syllabus={selectedSyllabus}
                    semesters={semesters}
                    onClose={() => setIsModalOpen(false)}
                    errors={errors}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                title="View Syllabus"
                size="lg"
            >
                {selectedSyllabus && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Course
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {selectedSyllabus.course}
                            </p>
                        </div>
                        {selectedSyllabus.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {selectedSyllabus.description}
                                </p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Semester
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                {selectedSyllabus.semester.name}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                File
                            </label>
                            <div className="mt-2 flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {selectedSyllabus.file_name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(selectedSyllabus.file_size)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </AdminLayout>
    );
}

// Syllabus Form Component
function SyllabusForm({ syllabus, semesters, onClose, errors }: {
    syllabus: Syllabus | null;
    semesters: Semester[];
    onClose: () => void;
    errors?: Record<string, string>;
}) {
    const { data, setData, post, put, processing, errors: formErrors } = useForm({
        course: syllabus?.course || '',
        semester_id: syllabus?.semester?.id || '',
        description: syllabus?.description || '',
        file: null as File | null,
        file_name: syllabus?.file_name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (syllabus) {
            put(`/syllabi/${syllabus.id}`, {
                onSuccess: () => onClose(),
            });
        } else {
            post('/syllabi', {
                onSuccess: () => onClose(),
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            // Auto-fill file name if not already set
            if (!data.file_name) {
                setData('file_name', file.name);
            }
        }
    };

    const removeFile = () => {
        setData('file', null);
    };

    const allErrors = { ...errors, ...formErrors };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Name *
                </label>
                <input
                    type="text"
                    value={data.course}
                    onChange={(e) => setData('course', e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ${allErrors.course ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    required
                />
                {allErrors.course && (
                    <p className="mt-1 text-sm text-red-600 transition-all duration-200">{allErrors.course}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Semester *
                </label>
                <select
                    value={data.semester_id}
                    onChange={(e) => setData('semester_id', e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ${allErrors.semester_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    required
                >
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                            {semester.name}
                        </option>
                    ))}
                </select>
                {allErrors.semester_id && (
                    <p className="mt-1 text-sm text-red-600 transition-all duration-200">{allErrors.semester_id}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ${allErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="Optional description of the syllabus..."
                />
                {allErrors.description && (
                    <p className="mt-1 text-sm text-red-600 transition-all duration-200">{allErrors.description}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    File Name *
                </label>
                <input
                    type="text"
                    value={data.file_name}
                    onChange={(e) => setData('file_name', e.target.value)}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ${allErrors.file_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    placeholder="Enter a descriptive name for the file"
                    required
                />
                {allErrors.file_name && (
                    <p className="mt-1 text-sm text-red-600 transition-all duration-200">{allErrors.file_name}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    PDF File {!syllabus && '*'}
                </label>
                <div className="mt-1">
                    {data.file ? (
                        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                            <BookOpen className="w-5 h-5 text-green-600" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                                    {data.file.name}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    {(data.file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={removeFile}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input
                                            type="file"
                                            className="sr-only"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PDF up to 10MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                {allErrors.file && (
                    <p className="mt-1 text-sm text-red-600">{allErrors.file}</p>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                    {processing && <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>}
                    {processing ? 'Saving...' : (syllabus ? 'Update' : 'Create') + ' Syllabus'}
                </button>
            </div>
        </form>
    );
} 