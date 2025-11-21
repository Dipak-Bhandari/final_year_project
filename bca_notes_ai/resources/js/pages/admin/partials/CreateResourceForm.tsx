import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Semester } from '@/types';
import { FormEvent } from 'react';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';

export function CreateResourceForm({ setOpen, semesters }: { setOpen: (open: boolean) => void; semesters: Semester[] }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        description: string;
        semester_id: string;
        file: File | null;
    }>({
        title: '',
        description: '',
        semester_id: '',
        file: null,
    });

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('resources.store'), {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="e.g. Lecture Notes"
                />
                <InputError message={errors.title} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="A brief description of the resource..."
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select onValueChange={(value) => setData('semester_id', value)} value={data.semester_id}>
                    <SelectTrigger id="semester">
                        <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                    <SelectContent>
                        {semesters.map((semester) => (
                            <SelectItem key={semester.id} value={String(semester.id)}>
                                {semester.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.semester_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="file">Resource File (PDF)</Label>
                <Input
                    id="file"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                />
                <InputError message={errors.file} />
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Resource'}
                </Button>
            </div>
        </form>
    );
}
