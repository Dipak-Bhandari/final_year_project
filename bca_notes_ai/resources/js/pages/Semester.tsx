import { Head } from "@inertiajs/react";

const mockSyllabus: Record<string, string[]> = {
    "1": ["Mathematics I", "Introduction to Programming", "Digital Logic", "English Communication"],
    "2": ["Mathematics II", "Data Structures", "Discrete Mathematics", "Computer Organization"],
    "3": ["Database Systems", "Object Oriented Programming", "Operating Systems", "Statistics"],
    "4": ["Computer Networks", "Software Engineering", "Web Technologies", "Design and Analysis of Algorithms"],
    "5": ["Theory of Computation", "Compiler Design", "Artificial Intelligence", "Elective I"],
    "6": ["Machine Learning", "Mobile Computing", "Cloud Computing", "Elective II"],
    "7": ["Project Work I", "Seminar", "Elective III", "Elective IV"],
    "8": ["Project Work II", "Internship", "Comprehensive Viva"],
};

type SemesterProps = {
    semester: string;
};

export default function Semester({ semester }: SemesterProps) {
    const courses = mockSyllabus[semester] || ["No data available"];
    return (
        <>
            <Head title={`Semester ${semester} Syllabus`} />
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Semester {semester} Syllabus</h1>
                <ul className="list-disc pl-6">
                    {courses.map((course, idx) => (
                        <li key={idx}>{course}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}