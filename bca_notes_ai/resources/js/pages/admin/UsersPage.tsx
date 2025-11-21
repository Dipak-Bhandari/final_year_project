import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
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
import { Search, Plus, Edit2, Trash2, Users as UsersIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

type UserRecord = {
    id: number;
    name: string;
    email: string;
    role: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'User Management', href: '/admin/users' },
];

export default function UsersPage() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/users');
            setUsers(response.data.users);
        } catch (err) {
            setError('Unable to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term),
        );
    }, [users, searchTerm]);

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this user? This action cannot be undone.')) {
            return;
        }
        try {
            await axios.delete(`/users/${id}`);
            setUsers((prev) => prev.filter((user) => user.id !== id));
        } catch {
            alert('Failed to delete user. Please try again.');
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setDialogOpen(true);
    };

    const handleEdit = (user: UserRecord) => {
        setSelectedUser(user);
        setDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setDialogOpen(false);
            setSelectedUser(null);
        } else {
            setDialogOpen(true);
        }
    };

    return (
        <AdminLayout title="" breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <PageHeader
                title="User Management"
                description="Invite, edit, and remove users who can access the platform."
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                }
            />

            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-lg">Directory</CardTitle>
                    <CardDescription>
                        Search by name or email, then manage individual permissions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="w-full sm:max-w-sm">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    placeholder="Search users"
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    {loading && (
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <Skeleton key={index} className="h-12 w-full" />
                            ))}
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>Something went wrong</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!loading && !error && (
                        <div className="overflow-hidden rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="capitalize">
                                                        {user.role.replace('_', ' ')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            onClick={() => handleEdit(user)}
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => handleDelete(user.id)}
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
                                                <div className="flex flex-col items-center justify-center gap-1 py-8 text-center text-muted-foreground">
                                                    <UsersIcon className="h-10 w-10" />
                                                    <p className="text-sm">No users match your search.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-[480px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser ? 'Edit user' : 'Invite user'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser
                                ? 'Update user information and access level.'
                                : 'Add a new collaborator to the platform.'}
                        </DialogDescription>
                    </DialogHeader>
                    <UserForm
                        user={selectedUser}
                        onSaved={fetchUsers}
                        onClose={() => handleDialogClose(false)}
                    />
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

type UserFormProps = {
    user: UserRecord | null;
    onSaved: () => void;
    onClose: () => void;
};

function UserForm({ user, onSaved, onClose }: UserFormProps) {
    const [formState, setFormState] = useState({
        name: user?.name ?? '',
        email: user?.email ?? '',
        role: user?.role ?? 'user',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setFormState({
            name: user?.name ?? '',
            email: user?.email ?? '',
            role: user?.role ?? 'user',
            password: '',
        });
        setErrors({});
    }, [user]);

    const handleChange = (field: keyof typeof formState) => (value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});

        const payload: Record<string, string> = {
            name: formState.name,
            email: formState.email,
            role: formState.role,
        };

        if (!user || formState.password) {
            payload.password = formState.password;
        }

        try {
            if (user) {
                await axios.put(`/users/${user.id}`, payload);
            } else {
                await axios.post('/users', payload);
            }
            onSaved();
            onClose();
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert('Unable to save user. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={formState.name}
                    onChange={(event) => handleChange('name')(event.target.value)}
                    placeholder="Jane Doe"
                />
                <InputError message={errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(event) => handleChange('email')(event.target.value)}
                    placeholder="jane@example.com"
                />
                <InputError message={errors.email} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                    value={formState.role}
                    onValueChange={(value) => handleChange('role')(value)}
                >
                    <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.role} />
            </div>

            {!user && (
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formState.password}
                        onChange={(event) =>
                            handleChange('password')(event.target.value)
                        }
                        placeholder="Minimum 8 characters"
                    />
                    <InputError message={errors.password} />
                </div>
            )}

            {user && (
                <div className="space-y-2">
                    <Label htmlFor="password">Password (optional)</Label>
                    <Input
                        id="password"
                        type="password"
                        value={formState.password}
                        onChange={(event) =>
                            handleChange('password')(event.target.value)
                        }
                        placeholder="Leave blank to keep current password"
                    />
                    <InputError message={errors.password} />
                </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Saving…' : user ? 'Update User' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}