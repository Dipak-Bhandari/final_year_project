import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';
import AuthLayout from '@/layouts/auth-layout';
import { FormDataConvertible } from '@inertiajs/core';

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
}

interface LoginData extends Record<string, FormDataConvertible> {
    email: string;
    password: string;
    remember: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm<LoginData>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AuthLayout title="Log in to your account" description="Enter your email and password below to log in">
            <Head title="Log in" />
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked === true)}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                    Remember me
                                </Label>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>

                        <Button className="w-full" disabled={processing}>
                            Log in
                        </Button>
                    </form>
                    <div className="text-center mt-4 text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="underline hover:text-primary"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}