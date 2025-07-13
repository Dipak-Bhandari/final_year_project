<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Inertia\Inertia;
use Inertia\Response;

class QuestionPaperController extends Controller
{
    /**
     * Display the question papers for the specified semester.
     */
    public function show(Semester $semester): Response
    {
        $questionPapers = $semester->questionPapers()
            ->orderBy('course')
            ->orderBy('year', 'desc')
            ->get()
            ->groupBy('course');

        return Inertia::render('QuestionPaperPage', [
            'semester' => $semester,
            'questionPapers' => $questionPapers,
        ]);
    }
} 