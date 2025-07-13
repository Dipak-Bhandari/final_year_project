import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import Modal from '@/components/ui/modal';
import { Plus, Eye, Edit, Trash2, Users, Search, X } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Management', href: '/admin/users' },
];

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/users');
            setUsers(res.data.users);
        } catch (err: any) {
            setError('Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAdd = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };
    const handleEdit = (user: any) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };
    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/users/${id}`);
                setUsers(users.filter(u => u.id !== id));
            } catch {
                alert('Failed to delete user.');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="User Management" breadcrumbs={breadcrumbs}>
            <Head title="User Management" />
            <div className="p-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Manage platform users and roles</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </button>
                </div>
                <div className="mb-6">
                    <div className="relative max-w-xs">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading users...</div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl shadow border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 rounded-2xl overflow-hidden">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredUsers.map((user, idx) => (
                                    <tr key={user.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} hover:bg-blue-50 dark:hover:bg-blue-900/30`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">{user.role.replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button onClick={() => { }} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                                                <button onClick={() => handleEdit(user)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {filteredUsers.length === 0 && !loading && !error && (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new user.</p>
                    </div>
                )}
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedUser ? 'Edit User' : 'Add User'}
                size="lg"
                className="animate-fade-in shadow-2xl rounded-2xl"
            >
                <UserForm
                    user={selectedUser}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchUsers();
                    }}
                    afterSave={fetchUsers}
                />
            </Modal>
        </AdminLayout>
    );
}

function UserForm({ user, onClose, afterSave }: { user: any; onClose: () => void; afterSave: () => void }) {
    const { data, setData, reset, processing, errors, setError } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'user',
        password: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (user) {
                await axios.put(`/users/${user.id}`, data);
            } else {
                await axios.post('/users', data);
            }
            afterSave();
            onClose();
            reset();
        } catch (err: any) {
            if (err.response && err.response.data && err.response.data.errors) {
                Object.entries(err.response.data.errors).forEach(([key, val]) => setError(key, val as string));
            } else {
                alert('Failed to save user.');
            }
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name *</label>
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required />
                {errors.name && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.name}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required />
                {errors.email && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.email}</p>}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role *</label>
                <select value={data.role} onChange={e => setData('role', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required>
                    <option value="user">User</option>
                    <option value="super_admin">Super Admin</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.role}</p>}
            </div>
            {!user && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password *</label>
                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="mt-1 block w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 border-gray-300 dark:border-gray-600" required />
                    {errors.password && <p className="mt-1 text-sm text-red-600 transition-all duration-200">{errors.password}</p>}
                </div>
            )}
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" disabled={processing || submitting} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all">{submitting ? 'Saving...' : (user ? 'Update' : 'Create') + ' User'}</button>
            </div>
        </form>
    );
} 