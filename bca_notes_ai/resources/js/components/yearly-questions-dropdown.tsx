import { Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { type User } from "@/types";

type Semester = {
    id: number;
    name: string;
};

type Props = {
    semesters?: Semester[];
};

export default function YearlyQuestionDropdown({ semesters = [] }: Props) {
    const [open, setOpen] = useState(false);

    // Fallback to hardcoded semesters if none provided
    const semesterList = semesters.length > 0 ? semesters : [
        { id: 1, name: "First Semester" },
        { id: 2, name: "Second Semester" },
        { id: 3, name: "Third Semester" },
        { id: 4, name: "Fourth Semester" },
        { id: 5, name: "Fifth Semester" },
        { id: 6, name: "Sixth Semester" },
        { id: 7, name: "Seventh Semester" },
        { id: 8, name: "Eighth Semester" },
    ];

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                className={`px-4 py-2 text-sm rounded-t flex items-center space-x-1 ${open ? " text-black dark:text-white" : "text-gray-600 dark:text-gray-400"} hover:text-black dark:hover:text-white transition-colors`}
            >
                <span>Question Papers</span>
                <ChevronDown className={`inline h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute left-0 mt-0 w-56 bg-white text-black shadow-lg z-50 rounded-b dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-700">
                    <ul className="py-2">
                        {semesterList.map((sem) => (
                            <li key={sem.id}>
                                <Link
                                    href={`/papers/${sem.id}`}
                                    className="block px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 transition-colors"
                                >
                                    {sem.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}