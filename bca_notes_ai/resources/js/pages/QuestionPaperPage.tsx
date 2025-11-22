import { type PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import NavIndex from '@/components/nav-index';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { route } from 'ziggy-js';

type PublicPaper = {
    id: number;
    course: string;
    year: number;
    file_name: string;
    download_url: string;
};

type Props = PageProps<{
    semester: { id: number; name: string };
    questionPapers: PublicPaper[];
}>;

export default function QuestionPaperPage({ semester, questionPapers }: Props) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const term = query.trim().toLowerCase();
        if (!term) {
            return questionPapers;
        }
        return questionPapers.filter((paper: PublicPaper) => {
            return (
                paper.course.toLowerCase().includes(term) ||
                String(paper.year).includes(term)
            );
        });
    }, [query, questionPapers]);

    const breadcrumbs = [
        { title: 'Home', href: route('home') },
        { title: semester.name, href: route('papers.show', { semester: semester.id }) },
    ];

    return (
        <div className="bg-cream text-[#1b1b18] w-full dark:bg-[#0a0a0a] min-h-screen">
            <Head title={`Question Papers • ${semester.name}`} />
            <header className="mb-6 w-full text-sm">
                <NavIndex />
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
                        Question Papers & Practice Sets
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Download past year exam papers for {semester.name}. Use them to practice and understand exam patterns.
                    </p>
                    <div className="mx-auto max-w-lg">
                        <Input
                            placeholder="Search by course or year…"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="h-12 rounded-full"
                        />
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground">No question papers available for this semester.</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {filtered.map((paper: PublicPaper) => (
                            <Card key={paper.id} className="border border-gray-200 dark:border-gray-800">
                                <CardHeader className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{paper.year}</Badge>
                                    </div>
                                    <CardTitle className="text-xl">{paper.course}</CardTitle>
                                    <CardDescription>Past exam paper for {paper.course}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{paper.file_name}</span>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={paper.download_url}>
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