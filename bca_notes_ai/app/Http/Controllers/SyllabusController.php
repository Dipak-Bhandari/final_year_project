<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use App\Models\Syllabus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SyllabusController extends Controller
{
    /**
     * Display the syllabus for the specified semester.
     */
    public function show(Semester $semester): Response
    {
        $syllabi = $semester->syllabi()
            ->orderBy('course')
            ->get()
            ->map(function (Syllabus $syllabus) {
                return [
                    'id' => $syllabus->id,
                    'course' => $syllabus->course,
                    'description' => $syllabus->description,
                    'file_name' => $syllabus->file_name ?? ($syllabus->file_path ? basename($syllabus->file_path) : 'syllabus.pdf'),
                    'file_size' => $syllabus->file_size,
                    'download_url' => route('syllabi.download', $syllabus),
                ];
            });

        return Inertia::render('SyllabusPage', [
            'semester' => $semester->only(['id', 'name']),
            'syllabi' => $syllabi,
        ]);
    }

    /**
     * Store a newly created syllabus.
     */
    public function store(Request $request)
    {
        $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'course' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'file' => 'required|file|mimes:pdf|max:10240', // 10MB max
            'file_name' => 'required|string|max:255',
        ]);

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('syllabi', $fileName, 'public');

        $syllabus = Syllabus::create([
            'semester_id' => $request->semester_id,
            'course' => $request->course,
            'description' => $request->description,
            'file_path' => $filePath,
            'file_name' => $request->file_name,
            'file_size' => $file->getSize(),
        ]);

        return redirect()->back()->with('success', 'Syllabus created successfully.');
    }

    /**
     * Update the specified syllabus.
     */
    public function update(Request $request, Syllabus $syllabus)
    {
        $request->validate([
            'course' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'file' => 'nullable|file|mimes:pdf|max:10240', // 10MB max
            'file_name' => 'required|string|max:255',
        ]);

        $data = [
            'course' => $request->course,
            'description' => $request->description,
            'file_name' => $request->file_name,
        ];

        if ($request->hasFile('file')) {
            // Delete old file
            if ($syllabus->file_path) {
                Storage::disk('public')->delete($syllabus->file_path);
            }

            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('syllabi', $fileName, 'public');

            $data['file_path'] = $filePath;
            $data['file_size'] = $file->getSize();
        }

        $syllabus->update($data);

        return redirect()->back()->with('success', 'Syllabus updated successfully.');
    }

    /**
     * Remove the specified syllabus.
     */
    public function destroy(Syllabus $syllabus)
    {
        if ($syllabus->file_path) {
            Storage::disk('public')->delete($syllabus->file_path);
        }

        $syllabus->delete();

        return redirect()->back()->with('success', 'Syllabus deleted successfully.');
    }

    /**
     * Download the specified syllabus file.
     */
    public function download(Syllabus $syllabus)
    {
        if (!$syllabus->file_path || !Storage::disk('public')->exists($syllabus->file_path)) {
            abort(404, 'File not found.');
        }

        $fullPath = Storage::disk('public')->path($syllabus->file_path);

        return response()->download($fullPath, $syllabus->file_name);
    }
}