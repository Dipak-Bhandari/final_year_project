<?php

use App\Http\Controllers\QuestionPaperController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\SyllabusController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Admin-only routes
Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Syllabus management routes
    Route::get('/admin/syllabi', function () {
        return Inertia::render('admin/SyllabiPage', [
            'syllabi' => \App\Models\Syllabus::with('semester')->get(),
            'semesters' => \App\Models\Semester::all(),
        ]);
    })->name('admin.syllabi.index');
    
    Route::post('/syllabi', [SyllabusController::class, 'store'])->name('syllabi.store');
    Route::put('/syllabi/{syllabus}', [SyllabusController::class, 'update'])->name('syllabi.update');
    Route::delete('/syllabi/{syllabus}', [SyllabusController::class, 'destroy'])->name('syllabi.destroy');

    // User management routes
    Route::inertia('/admin/users', 'admin/UsersPage')->name('admin.users.index');
    Route::apiResource('users', App\Http\Controllers\Admin\UserController::class)->except(['create', 'edit', 'show']);

    // Resource upload management routes
    Route::inertia('/admin/upload', 'admin/UploadPage')->name('admin.resources.index');
    Route::apiResource('resources', App\Http\Controllers\Admin\ResourceController::class)->except(['create', 'edit', 'show']);
});

// Academic content routes (public)
Route::get('/semesters', [SemesterController::class, 'index'])->name('semesters.index');
Route::get('/syllabus/{semester}', [SyllabusController::class, 'show'])->name('syllabus.show');
Route::get('/papers/{semester}', [QuestionPaperController::class, 'show'])->name('papers.show');

// Legacy route for backward compatibility
Route::get('/semester/{number}', function ($number) {
    return Inertia::render('Semester', [
        'semester' => $number,
    ]);
})->name('semester.show');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
