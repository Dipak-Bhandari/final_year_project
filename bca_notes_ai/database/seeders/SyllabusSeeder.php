<?php

namespace Database\Seeders;

use App\Models\Semester;
use App\Models\Syllabus;
use Illuminate\Database\Seeder;

class SyllabusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $syllabiData = [
            1 => [
                [
                    'course' => 'Mathematics I',
                    'units' => [
                        'Unit 1: Sets, Relations and Functions',
                        'Unit 2: Complex Numbers and Quadratic Equations',
                        'Unit 3: Matrices and Determinants',
                        'Unit 4: Permutations and Combinations',
                        'Unit 5: Binomial Theorem and Mathematical Induction'
                    ]
                ],
                [
                    'course' => 'Introduction to Programming',
                    'units' => [
                        'Unit 1: Introduction to Computer Programming',
                        'Unit 2: Data Types and Variables',
                        'Unit 3: Control Structures',
                        'Unit 4: Functions and Arrays',
                        'Unit 5: Pointers and Structures'
                    ]
                ],
                [
                    'course' => 'Digital Logic',
                    'units' => [
                        'Unit 1: Number Systems and Codes',
                        'Unit 2: Boolean Algebra and Logic Gates',
                        'Unit 3: Combinational Logic Circuits',
                        'Unit 4: Sequential Logic Circuits',
                        'Unit 5: Memory and Programmable Logic Devices'
                    ]
                ],
                [
                    'course' => 'English Communication',
                    'units' => [
                        'Unit 1: Communication Skills',
                        'Unit 2: Technical Writing',
                        'Unit 3: Business Communication',
                        'Unit 4: Presentation Skills',
                        'Unit 5: Report Writing'
                    ]
                ]
            ],
            2 => [
                [
                    'course' => 'Mathematics II',
                    'units' => [
                        'Unit 1: Differential Calculus',
                        'Unit 2: Integral Calculus',
                        'Unit 3: Differential Equations',
                        'Unit 4: Vector Calculus',
                        'Unit 5: Numerical Methods'
                    ]
                ],
                [
                    'course' => 'Data Structures',
                    'units' => [
                        'Unit 1: Introduction to Data Structures',
                        'Unit 2: Arrays and Linked Lists',
                        'Unit 3: Stacks and Queues',
                        'Unit 4: Trees and Graphs',
                        'Unit 5: Searching and Sorting Algorithms'
                    ]
                ],
                [
                    'course' => 'Discrete Mathematics',
                    'units' => [
                        'Unit 1: Logic and Proofs',
                        'Unit 2: Set Theory and Relations',
                        'Unit 3: Functions and Combinatorics',
                        'Unit 4: Graph Theory',
                        'Unit 5: Algebraic Structures'
                    ]
                ],
                [
                    'course' => 'Computer Organization',
                    'units' => [
                        'Unit 1: Basic Computer Organization',
                        'Unit 2: Central Processing Unit',
                        'Unit 3: Memory Organization',
                        'Unit 4: Input/Output Organization',
                        'Unit 5: Advanced Computer Architecture'
                    ]
                ]
            ]
        ];

        foreach ($syllabiData as $semesterId => $syllabi) {
            $semester = Semester::find($semesterId);
            if ($semester) {
                foreach ($syllabi as $syllabus) {
                    Syllabus::create([
                        'semester_id' => $semester->id,
                        'course' => $syllabus['course'],
                        'units' => $syllabus['units'],
                    ]);
                }
            }
        }
    }
} 