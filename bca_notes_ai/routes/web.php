<?php

use App\Http\Controllers\Admin\ResourceController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\QuestionPaperController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\SyllabusController;
use App\Models\QuestionPaper;
use App\Models\Resource;
use App\Models\Semester;
use App\Models\Syllabus;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

Route::get('/', function () {
    $semesters = Semester::select('id', 'name')->orderBy('id')->get();

    $syllabi = Syllabus::with('semester:id,name')
        ->latest('updated_at')
        ->take(24)
        ->get()
        ->map(function (Syllabus $syllabus) {
            $fileExists = $syllabus->file_path
                ? Storage::disk('public')->exists($syllabus->file_path)
                : false;

            return [
                'id' => $syllabus->id,
                'course' => $syllabus->course,
                'description' => $syllabus->description,
                'file_name' => $syllabus->file_name ?? ($syllabus->file_path ? basename($syllabus->file_path) : 'syllabus.pdf'),
                'file_size' => $syllabus->file_size ?? ($fileExists ? Storage::disk('public')->size($syllabus->file_path) : null),
                'download_url' => route('syllabi.download', $syllabus),
                'semester' => $syllabus->semester ? $syllabus->semester->only(['id', 'name']) : null,
            ];
        });

    $questionPapers = QuestionPaper::with('semester:id,name')
        ->orderByDesc('year')
        ->take(24)
        ->get()
        ->map(function (QuestionPaper $paper) {
            $hasFile = $paper->file_path
                ? Storage::disk('public')->exists($paper->file_path)
                : false;

            return [
                'id' => $paper->id,
                'course' => $paper->course,
                'year' => $paper->year,
                'file_name' => $paper->file_name ?? ($paper->file_path ? basename($paper->file_path) : 'question-paper.pdf'),
                'file_size' => $hasFile ? Storage::disk('public')->size($paper->file_path) : null,
                'download_url' => route('question-papers.download', $paper),
                'semester' => $paper->semester ? $paper->semester->only(['id', 'name']) : null,
            ];
        });

    $resources = Resource::latest('created_at')
        ->take(24)
        ->get()
        ->map(function ($resource) {
            $fileExists = $resource->file_path
                ? Storage::disk('public')->exists($resource->file_path)
                : false;
            
            $semester = Semester::where('name', $resource->semester)->first();

            return [
                'id' => $resource->id,
                'title' => $resource->title,
                'description' => $resource->description,
                'file_name' => $resource->file_path ? basename($resource->file_path) : 'resource.pdf',
                'file_size' => $fileExists ? Storage::disk('public')->size($resource->file_path) : null,
                'download_url' => route('resources.download', $resource),
                'semester' => $semester ? $semester->only(['id', 'name']) : null,
            ];
        });

    return Inertia::render('welcome', [
        'publicSyllabi' => $syllabi,
        'publicQuestionPapers' => $questionPapers,
        'publicResources' => $resources,
        'globalSemesters' => $semesters,
    ]);
})->name('home');

// Admin-only routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard', [
            'totalSyllabi' => Syllabus::count(),
            'totalQuestionPapers' => QuestionPaper::count(),
            'totalUsers' => User::count(),
        ]);
    })->name('dashboard');

    // Syllabus management routes
    Route::get('/admin/syllabi', function () {
        return Inertia::render('admin/SyllabiPage', [
            'syllabi' => Syllabus::with('semester')->get(),
            'semesters' => Semester::all(),
        ]);
    })->name('admin.syllabi.index');

    Route::post('/syllabi', [SyllabusController::class, 'store'])->name('syllabi.store');
    Route::put('/syllabi/{syllabus}', [SyllabusController::class, 'update'])->name('syllabi.update');
    Route::delete('/syllabi/{syllabus}', [SyllabusController::class, 'destroy'])->name('syllabi.destroy');

    // Question Paper management routes
    Route::get('/admin/question-papers', function () {
        return Inertia::render('admin/QuestionPapersPage', [
            'questionPapers' => QuestionPaper::with('semester')->get(),
            'semesters' => Semester::all(),
        ]);
    })->name('admin.question-papers.index');

    Route::post('/question-papers', [QuestionPaperController::class, 'store'])->name('question-papers.store');
    Route::put('/question-papers/{questionPaper}', [QuestionPaperController::class, 'update'])->name('question-papers.update');
    Route::delete('/question-papers/{questionPaper}', [QuestionPaperController::class, 'destroy'])->name('question-papers.destroy');

    // User management routes
    Route::inertia('/admin/users', 'admin/UsersPage')->name('admin.users.index');
    Route::apiResource('users', UserController::class)->except(['create', 'edit', 'show']);

    // Resource upload management routes
    Route::inertia('/admin/upload', 'admin/UploadPage', [
        'resources' => fn () => Resource::all()->map(function ($resource) {
            // Find semester by name match
            $semester = Semester::where('name', $resource->semester)->first();
            // Extract file name from file path
            $file_name = $resource->file_path ? basename($resource->file_path) : null;
            return [
                ...$resource->toArray(),
                'semester' => $semester ? ['id' => $semester->id, 'name' => $semester->name] : null,
                'file_name' => $file_name,
            ];
        }),
        'semesters' => fn () => Semester::all(),
    ])->name('admin.resources.index');
    Route::apiResource('resources', ResourceController::class)->except(['create', 'edit', 'show']);
});

// Academic content routes (public)
Route::middleware(['auth'])->group(function () {

    Route::get('/semesters', [SemesterController::class, 'index'])->name('semesters.index');
});

Route::get('/syllabus/{semester}', [SyllabusController::class, 'show'])->name('syllabus.show');
Route::get('/papers/{semester}', [QuestionPaperController::class, 'show'])->name('papers.show');
Route::get('/syllabi/{syllabus}/download', [SyllabusController::class, 'download'])->name('syllabi.download');
Route::get('/question-papers/{questionPaper}/download', [QuestionPaperController::class, 'download'])->name('question-papers.download');
Route::get('/resources/{resource}/download', [ResourceController::class, 'download'])->name('resources.download');
Route::get('/resources/{semester}', [ResourceController::class, 'show'])->name('resources.show');

// Legacy route for backward compatibility
Route::get('/semester/{number}', function ($number) {
    return Inertia::render('Semester', [
        'semester' => $number,
    ]);
})->name('semester.show');


// Chat routes
Route::post('/chat', [ChatController::class, 'ask'])->name('chat.ask');
Route::get('/chat/models', [ChatController::class, 'getModels'])->name('chat.models');
Route::get('/chat/health', [ChatController::class, 'getHealth'])->name('chat.health');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
