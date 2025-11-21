import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Verify Your Email Address</CardTitle>
                        <CardDescription>
                            Thanks for signing up! Before getting started, could you verify your email address by clicking on the
                            link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status === 'verification-link-sent' && (
                            <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                                A new verification link has been sent to the email address you provided during registration.
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mt-4 flex items-center justify-between">
                                <Button disabled={processing}>Resend Verification Email</Button>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}