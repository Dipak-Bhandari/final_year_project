<?php

namespace Database\Seeders;

use App\Models\Semester;
use Illuminate\Database\Seeder;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semesters = [
            ['name' => 'First Semester'],
            ['name' => 'Second Semester'],
            ['name' => 'Third Semester'],
            ['name' => 'Fourth Semester'],
            ['name' => 'Fifth Semester'],
            ['name' => 'Sixth Semester'],
            ['name' => 'Seventh Semester'],
            ['name' => 'Eighth Semester'],
        ];

        foreach ($semesters as $semester) {
            Semester::create($semester);
        }
    }
} 