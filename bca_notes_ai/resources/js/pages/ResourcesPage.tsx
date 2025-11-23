import { useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import NavIndex from '@/components/nav-index';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { route } from 'ziggy-js';
import { type PageProps, type SharedData } from '@/types';

type PublicResource = {
    id: number;
    title: string;
    description?: string | null;
    file_name: string;
    file_size?: number | null;
    download_url: string;
};

type Props = PageProps<{
    semester: { id: number; name: string };
    resources: PublicResource[];
}>;

export default function ResourcesPage({ semester, resources }: Props) {
    const { globalSemesters = [] } = usePage<SharedData>().props;
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) {
            return resources;
        }
        return resources.filter((item: PublicResource) => {
            const text = [item.title, item.description ?? ''].join(' ').toLowerCase();
            return text.includes(term);
        });
    }, [query, resources]);

    const breadcrumbs = [
        { title: 'Home', href: route('home') },
        { title: semester.name, href: route('resources.show', { semester: semester.id }) },
    ];

    return (
        <div className="bg-cream text-[#1b1b18] w-full dark:bg-[#0a0a0a] min-h-screen">
            <Head title={`Resources • ${semester.name}`} />
            <header className="mb-6 w-full text-sm">
                <NavIndex globalSemesters={globalSemesters} />
            </header>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto z-0 flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                <div className="space-y-8">
                    <div className="space-y-4 text-center">
                        <Badge variant="outline" className="px-4 py-1 text-base">
                            {semester.name}
                        </Badge>
                        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                            Study Resources & Materials
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Download lecture notes, study guides, and additional resources for {semester.name}. All materials are shared by the admin team.
                        </p>
                        <div className="mx-auto max-w-lg">
                            <Input
                                placeholder="Search by title or description…"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                className="h-12 rounded-full"
                            />
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground">No resources found for this semester.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {filtered.map((resource: PublicResource) => (
                                <Card key={resource.id} className="border border-gray-200 dark:border-gray-800">
                                    <CardHeader className="space-y-3">
                                        <CardTitle className="text-xl">{resource.title}</CardTitle>
                                        {resource.description && (
                                            <CardDescription>{resource.description}</CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            {formatFileSize(resource.file_size)} • {resource.file_name}
                                        </span>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={resource.download_url}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function formatFileSize(size?: number | null) {
    if (!size) {
        return 'File';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
    const value = size / Math.pow(1024, index);
    return `${value.toFixed(1)} ${units[index]}`;
}

