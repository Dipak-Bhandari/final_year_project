<?php

namespace App\Http\Controllers;

use App\Models\QuestionPaper;
use App\Models\Semester;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
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
            ->orderByDesc('year')
            ->orderBy('course')
            ->get()
            ->map(function (QuestionPaper $paper) {
                $fileName = $paper->file_name ?? ($paper->file_path ? basename($paper->file_path) : 'question-paper.pdf');

                return [
                    'id' => $paper->id,
                    'course' => $paper->course,
                    'year' => $paper->year,
                    'file_name' => $fileName,
                    'download_url' => route('question-papers.download', $paper),
                ];
            });

        return Inertia::render('QuestionPaperPage', [
            'semester' => $semester->only(['id', 'name']),
            'questionPapers' => $questionPapers,
        ]);
    }

    /**
     * Download a stored question paper file.
     */
    public function download(QuestionPaper $questionPaper)
    {
        if (!$questionPaper->file_path || !Storage::disk('public')->exists($questionPaper->file_path)) {
            abort(404, 'File not found.');
        }

        $fallbackName = Str::slug($questionPaper->course . '-' . $questionPaper->year, '_') . '.pdf';
        $fileName = $questionPaper->file_name ?? $fallbackName;

        $fullPath = Storage::disk('public')->path($questionPaper->file_path);

        return response()->download($fullPath, $fileName);
    }
}