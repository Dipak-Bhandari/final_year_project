import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
import { PageProps as InertiaPageProps } from '@inertiajs/react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    globalSemesters?: Semester[];
    publicSyllabi?: Syllabus[];
    publicQuestionPapers?: QuestionPaper[];
    [key: string]: unknown;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = InertiaPageProps<
    T & SharedData
>;

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    isAdmin: boolean;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Semester {
    id: number;
    name: string;
    [key: string]: unknown;
}

export interface Syllabus {
    id: number;
    course: string;
    description: string;
    file_name: string;
    file_size?: number | string | null;
    semester_id: number;
    semester?: Semester;
    [key: string]: unknown;
}

export interface Resource {
    id: number;
    title: string;
    description: string;
    file_path: string;
    file_name: string;
    file_size?: number | string | null;
    semester_id: number;
    semester?: Semester;
    [key: string]: unknown;
}

export interface QuestionPaper {
    id: number;
    title?: string;
    course?: string;
    year: number;
    file_name: string;
    file_size?: number | string | null;
    file_path: string;
    semester_id: number;
    semester?: Semester;
    [key: string]: unknown;
}

