import { ArrowDown, ChevronDown } from "lucide-react";
import { useState } from "react";

const semesters = [
    "First semester",
    "Second semester",
    "Third Semester",
    "Fourth semester",
    "Fifth semester",
    "Sixth semester",
    "Seventh semester",
    "Eight Semester",
];

export default function YearlyQuestionDropdown() {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                className={`px-4 py-2 font-sm rounded-t ${open ? " text-black dark:text-white" : ""}`}
            >
                Yearly Question Paper
                <ChevronDown className="inline ml-2 h-4 w-4" />
            </button>
            {open && (
                <div className="absolute left-0 mt-0 w-56 bg-white text-black shadow-lg z-50 rounded-b">
                    <ul className="py-2">
                        {semesters.map((sem, idx) => (
                            <li
                                key={idx}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                {sem}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}