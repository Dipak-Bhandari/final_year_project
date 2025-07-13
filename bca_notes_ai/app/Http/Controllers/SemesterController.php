<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Inertia\Inertia;
use Inertia\Response;

class SemesterController extends Controller
{
    /**
     * Display a listing of the semesters.
     */
    public function index(): Response
    {
        $semesters = Semester::withCount(['syllabi', 'questionPapers'])
            ->orderBy('id')
            ->get();

        return Inertia::render('SemesterListPage', [
            'semesters' => $semesters,
        ]);
    }
} 