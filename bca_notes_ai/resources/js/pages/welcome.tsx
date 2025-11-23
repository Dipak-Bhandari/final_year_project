import AppLogoIcon from '@/components/app-logo-icon';
import NavIndex from '@/components/nav-index';
import AppFooter from '@/components/app-footer';
import { type PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import LoginRegPopupStart from '@/components/login-reg-popup-start';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, BotMessageSquare, FileText, GraduationCap, Search, User as UserIcon } from 'lucide-react';
import ChatAI from '@/components/chat-ai-component';
import { Button } from '@/components/ui/button';

type WelcomeProps = {
    children?: ReactNode;
};

type PublicSyllabus = {
    id: number;
    course: string;
    description?: string | null;
    file_name: string;
    file_size?: number | null;
    download_url: string;
    semester?: { id: number; name: string } | null;
};

type PublicQuestionPaper = {
    id: number;
    course: string;
    year: number;
    file_name: string;
    file_size?: number | null;
    download_url: string;
    semester?: { id: number; name: string } | null;
};

type PublicResource = {
    id: number;
    title: string;
    description?: string | null;
    file_name: string;
    file_size?: number | null;
    download_url: string;
    semester?: { id: number; name: string } | null;
};

type WelcomePageProps = PageProps<{
    publicSyllabi: PublicSyllabus[];
    publicQuestionPapers: PublicQuestionPaper[];
    publicResources: PublicResource[];
}>;

export default function Welcome({ children }: WelcomeProps) {
    const { auth, publicSyllabi = [], publicQuestionPapers = [], publicResources = [] } = usePage<WelcomePageProps>().props;
    const user = auth.user;
    const [chatOpen, setChatOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const handler = (event: Event) => {
            const detail = (event as CustomEvent<string>).detail ?? '';
            setSearchValue(detail);
        };

        window.addEventListener('landing-search', handler);
        return () => window.removeEventListener('landing-search', handler);
    }, []);

    const normalizedSearch = searchValue.trim().toLowerCase();
    const searchResults = useMemo(() => {
        if (!normalizedSearch) {
            return [];
        }

        const syllabusMatches = publicSyllabi
            .filter((item: PublicSyllabus) => {
                const text = [
                    item.course,
                    item.description,
                    item.semester?.name,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return text.includes(normalizedSearch);
            })
            .map((item: PublicSyllabus) => ({
                id: `syllabus-${item.id}`,
                type: 'Syllabus' as const,
                title: item.course,
                meta: item.semester?.name ?? 'All semesters',
                description: item.description ?? 'Course outline',
                downloadUrl: item.download_url,
                fileSize: item.file_size,
                badgeTone: 'default' as const,
            }));

        const paperMatches = publicQuestionPapers
            .filter((item: PublicQuestionPaper) => {
                const text = [
                    item.course,
                    item.year,
                    item.semester?.name,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return text.includes(normalizedSearch);
            })
            .map((item: PublicQuestionPaper) => ({
                id: `paper-${item.id}`,
                type: 'Question Paper' as const,
                title: item.course ?? 'Question Paper',
                meta: `${item.semester?.name ?? 'Semester'} • ${item.year}`,
                description: 'Past exam paper',
                downloadUrl: item.download_url,
                fileSize: item.file_size,
                badgeTone: 'secondary' as const,
            }));

        const resourceMatches = publicResources
            .filter((item: PublicResource) => {
                const text = [
                    item.title,
                    item.description,
                    item.semester?.name,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                return text.includes(normalizedSearch);
            })
            .map((item: PublicResource) => ({
                id: `resource-${item.id}`,
                type: 'Resource' as const,
                title: item.title,
                meta: item.semester?.name ?? 'All semesters',
                description: item.description ?? 'Study resource',
                downloadUrl: item.download_url,
                fileSize: item.file_size,
                badgeTone: 'outline' as const,
            }));

        return [...syllabusMatches, ...paperMatches, ...resourceMatches].slice(0, 8);
    }, [normalizedSearch, publicSyllabi, publicQuestionPapers, publicResources]);

    const syllabusPreview = publicSyllabi.slice(0, 6);
    const paperPreview = publicQuestionPapers.slice(0, 6);
    const resourcePreview = publicResources.slice(0, 6);

    return (
        <>
            <Head title="Bcai Notes">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="bg-cream text-[#1b1b18] w-full  dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full text-sm not-has-[nav]:hidden">
                    <NavIndex />
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <LoginRegPopupStart />
                </div>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-12 mb-24 md:max-w-7xl">
                    <div className="text-center mb-12">
                        {/*Chat bot trigger button */}
                        <Button
                            onClick={() => setChatOpen(!chatOpen)}
                            className={`fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full
                                    bg-purple-600 text-white shadow-xl hover:bg-purple-700 focus:ring hover:focus:ring-4 hover:focus:ring-purple-400
                                    transition-all duration-300`}
                            aria-label={chatOpen ? "Close chat" : "Open chat"}
                            title={chatOpen ? "Close Chat" : "Open Chat"}
                        >
                            <BotMessageSquare className="h-8 w-8" />
                        </Button>

                        {/* Chat Panel */}
                        {chatOpen && (
                            <div
                                className="fixed bottom-20 right-4 z-50 flex flex-col w-96 max-w-full h-[550px] rounded-lg shadow-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                            >
                                <ChatAI />
                            </div>
                        )}
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <AppLogoIcon className="h-16 w-16" />
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                                Bcai Notes
                            </h1>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                            Your comprehensive BCA learning platform with AI-powered assistance
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {/* <Link
                                href="/semesters"
                                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
                            >
                                <GraduationCap className="h-5 w-5" />
                                <span>Browse Semesters</span>
                            </Link>
                            <Link
                                href="/syllabus/1"
                                className="inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <BookOpen className="h-5 w-5" />
                                <span>View Syllabus</span>
                            </Link> */}
                            {user?.isAdmin && (
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition-colors"
                                >
                                    <UserIcon className="h-5 w-5" />
                                    <span>Admin Dashboard</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Search + resource cards */}
                    <section id="public-library" className="mt-16 space-y-8">
                        <div className="mx-auto max-w-3xl text-center space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                                <Search className="h-4 w-4" />
                                Explore our open library
                            </div>
                            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                Search syllabi & question papers
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                All resources published by admins are now publicly accessible—no login required.
                                Download the PDF you need or browse the latest uploads below.
                            </p>
                            <Input
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Search by course, semester, or year…"
                                className="h-12 rounded-full border-gray-300 text-base dark:border-gray-700"
                            />
                        </div>

                        {normalizedSearch && (
                            <div className="rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/60">
                                {searchResults.length ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {searchResults.map((result) => (
                                            <Card key={result.id} className="border border-gray-200 dark:border-gray-800">
                                                <CardHeader className="space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={result.badgeTone}>{result.type}</Badge>
                                                        <span className="text-sm text-muted-foreground">{result.meta}</span>
                                                    </div>
                                                    <CardTitle className="text-lg">{result.title}</CardTitle>
                                                    <CardDescription>{result.description}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex items-center justify-between">
                                                    <div className="text-sm text-muted-foreground">
                                                        {result.fileSize ? formatFileSize(result.fileSize) : 'PDF'}
                                                    </div>
                                                    <Button asChild variant="outline" size="sm">
                                                        <a href={result.downloadUrl}>Download</a>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-sm text-muted-foreground">
                                        No resources matched “{searchValue}”. Try another course, semester, or year.
                                    </p>
                                )}
                            </div>
                        )}
                    </section>

                    {/* Public resource sections */}
                    <section className="mt-16 space-y-10">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Syllabus</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Download official course outlines shared by the admin team.
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {syllabusPreview.map((syllabus: PublicSyllabus) => (
                                    <Card key={syllabus.id} className="border border-gray-200 dark:border-gray-800">
                                        <CardHeader className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{syllabus.semester?.name ?? 'All semesters'}</Badge>
                                            </div>
                                            <CardTitle className="text-xl">{syllabus.course}</CardTitle>
                                            {syllabus.description && (
                                                <CardDescription>{syllabus.description}</CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {syllabus.file_size ? formatFileSize(syllabus.file_size) : syllabus.file_name}
                                            </span>
                                            <Button asChild variant="outline" size="sm">
                                                <a href={syllabus.download_url}>Download</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {!syllabusPreview.length && (
                                    <p className="text-sm text-muted-foreground">
                                        No syllabi have been published yet.
                                    </p>
                                )}
                            </div>
                        </div>
{/* 
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Question papers</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Practice with previous exam papers shared by the faculty.
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {paperPreview.map((paper: PublicQuestionPaper) => (
                                    <Card key={paper.id} className="border border-gray-200 dark:border-gray-800">
                                        <CardHeader className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">{paper.semester?.name ?? 'Semester'}</Badge>
                                                <span className="text-sm text-muted-foreground">{paper.year}</span>
                                            </div>
                                            <CardTitle className="text-xl">{paper.course}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {paper.file_size ? formatFileSize(paper.file_size) : paper.file_name}
                                            </span>
                                            <Button asChild variant="outline" size="sm">
                                                <a href={paper.download_url}>Download</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {!paperPreview.length && (
                                    <p className="text-sm text-muted-foreground">
                                        No question papers are available yet.
                                    </p>
                                )}
                            </div>
                        </div> */}

                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Resources</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Access lecture notes, study materials, and additional resources shared by the admin team.
                                </p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {resourcePreview.map((resource: PublicResource) => (
                                    <Card key={resource.id} className="border border-gray-200 dark:border-gray-800">
                                        <CardHeader className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">{resource.semester?.name ?? 'All semesters'}</Badge>
                                            </div>
                                            <CardTitle className="text-xl">{resource.title}</CardTitle>
                                            {resource.description && (
                                                <CardDescription>{resource.description}</CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                {resource.file_size ? formatFileSize(resource.file_size) : resource.file_name}
                                            </span>
                                            <Button asChild variant="outline" size="sm">
                                                <a href={resource.download_url}>Download</a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {!resourcePreview.length && (
                                    <p className="text-sm text-muted-foreground">
                                        No resources have been published yet.
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mx-auto mb-4 dark:bg-blue-900">
                                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Complete Syllabus
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Access detailed course structures and learning units for all 8 semesters
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mx-auto mb-4 dark:bg-green-900">
                                <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Question Papers
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Download past year question papers to prepare for your exams
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mx-auto mb-4 dark:bg-purple-900">
                                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                AI-Powered Learning
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Enhanced learning experience with AI assistance (coming soon)
                            </p>
                        </div>
                    </div>
                </main>

                {children}
                <footer className=' w-full'>
                    <AppFooter />
                </footer>
            </div>
        </>
    );
}

function formatFileSize(size?: number | string | null) {
    if (size === undefined || size === null || size === '') {
        return 'PDF';
    }
    const numeric = typeof size === 'string' ? parseFloat(size) : size;
    if (!numeric || Number.isNaN(numeric)) {
        return 'PDF';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(numeric) / Math.log(1024)), units.length - 1);
    const value = numeric / Math.pow(1024, index);
    return `${value.toFixed(1)} ${units[index]}`;
}
