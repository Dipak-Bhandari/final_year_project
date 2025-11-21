import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageProps, Semester, Syllabus } from '@/types';
import { FormEventHandler } from 'react';
import { Loader2 } from 'lucide-react';

export default function CreateSyllabusForm({
    syllabus,
    semesters,
    onClose,
}: {
    syllabus: Syllabus | null;
    semesters: Semester[];
    onClose: () => void;
}) {
    const { data, setData, post, processing, errors, reset } =
        useForm<Syllabus>({
            id: syllabus?.id || 0,
            course: syllabus?.course || '',
            description: syllabus?.description || '',
            file_path: syllabus?.file_path || '',
            file_name: syllabus?.file_name || '',
            file_size: syllabus?.file_size || 0,
            semester_id: syllabus?.semester_id || 0,
            semester: syllabus?.semester,
        });

    const handleSubmit: FormEventHandler = e => {
        e.preventDefault();
        post(route('admin.syllabi.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="course">Course Name</Label>
                <Input
                    id="course"
                    value={data.course}
                    onChange={e => setData('course', e.target.value)}
                    required
                />
                {errors.course && (
                    <p className="text-sm text-red-500">{errors.course}</p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                />
                {errors.description && (
                    <p className="text-sm text-red-500">
                        {errors.description}
                    </p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                    onValueChange={value =>
                        setData('semester_id', parseInt(value))
                    }
                    defaultValue={
                        data.semester_id
                            ? data.semester_id.toString()
                            : undefined
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                    <SelectContent>
                        {semesters.map(semester => (
                            <SelectItem
                                key={semester.id}
                                value={semester.id.toString()}
                            >
                                {semester.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.semester_id && (
                    <p className="text-sm text-red-500">
                        {errors.semester_id}
                    </p>
                )}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="file">Syllabus PDF</Label>
                <Input
                    id="file"
                    type="file"
                    onChange={e =>
                        setData('file_path', e.target.files?.[0] as any)
                    }
                    required
                />
                {errors.file_path && (
                    <p className="text-sm text-red-500">{errors.file_path}</p>
                )}
            </div>
            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onClose()}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save
                </Button>
            </div>
        </form>
    );
}
