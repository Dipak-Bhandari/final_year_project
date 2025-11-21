import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';

const formSchema = z.object({
    course: z.string().min(2, {
        message: 'Course name must be at least 2 characters.',
    }),
    year: z.coerce.number().min(2000, {
        message: 'Year must be 2000 or later.',
    }),
    file: z.instanceof(File).refine(file => file.size > 0, 'File is required.'),
});

export function CreateQuestionPaperForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const { semester } = usePage<PageProps<{ semester: any }>>().props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            course: '',
            year: new Date().getFullYear(),
            file: undefined,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        router.post(route('semesters.question-papers.store', { semester: semester.id }), values, {
            onSuccess: () => {
                setOpen(false);
                form.reset();
            },
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Data Structures" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g. 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                            <FormLabel>Question Paper File (PDF)</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            onChange(e.target.files[0]);
                                        }
                                    }}
                                    {...rest}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Save Paper'}
                </Button>
            </form>
        </Form>
    );
}