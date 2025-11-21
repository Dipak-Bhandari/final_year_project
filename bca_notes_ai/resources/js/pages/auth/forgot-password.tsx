import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Forgot your password?</CardTitle>
                        <CardDescription>
                            No problem. Just let us know your email address and we will email you a password reset link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-4">
                                <Button disabled={processing}>Email Password Reset Link</Button>
                            </div>
                        </form>
                         <div className="text-center mt-4 text-sm text-muted-foreground">
                            Remembered your password?{' '}
                            <Link
                                href={route('login')}
                                className="underline hover:text-primary"
                            >
                                Log in
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}