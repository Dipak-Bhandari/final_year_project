<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Resource;
use App\Models\Semester;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\StoreResourceRequest;
use App\Http\Requests\Admin\UpdateResourceRequest;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $resources = Resource::all();
        return response()->json(['resources' => $resources]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request)
    {
        $data = $request->validated();
        
        // Map semester_id to semester name
        if (isset($data['semester_id'])) {
            $semester = Semester::findOrFail($data['semester_id']);
            $data['semester'] = $semester->name;
            unset($data['semester_id']);
        }
        
        if ($request->hasFile('file')) {
            $data['file_path'] = $request->file('file')->store('uploads/resources', 'public');
        }
        
        Resource::create($data);
        
        return redirect()->route('admin.resources.index');
    }

    /**
     * Display resources for a specific semester (public).
     */
    public function show(Semester $semester)
    {
        $resources = Resource::where('semester', $semester->name)
            ->latest('created_at')
            ->get()
            ->map(function ($resource) use ($semester) {
                $fileExists = $resource->file_path
                    ? Storage::disk('public')->exists($resource->file_path)
                    : false;

                return [
                    'id' => $resource->id,
                    'title' => $resource->title,
                    'description' => $resource->description,
                    'file_name' => $resource->file_path ? basename($resource->file_path) : 'resource.pdf',
                    'file_size' => $fileExists ? Storage::disk('public')->size($resource->file_path) : null,
                    'download_url' => route('resources.download', $resource),
                ];
            });

        return Inertia::render('ResourcesPage', [
            'semester' => $semester->only(['id', 'name']),
            'resources' => $resources,
        ]);
    }

    /**
     * Download the specified resource file.
     */
    public function download(Resource $resource)
    {
        if (!$resource->file_path || !Storage::disk('public')->exists($resource->file_path)) {
            abort(404, 'File not found.');
        }

        $fileName = $resource->file_path ? basename($resource->file_path) : 'resource';
        $fullPath = Storage::disk('public')->path($resource->file_path);

        return response()->download($fullPath, $fileName);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resource $resource)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResourceRequest $request, Resource $resource)
    {
        $data = $request->validated();
        
        // Map semester_id to semester name
        if (isset($data['semester_id'])) {
            $semester = Semester::findOrFail($data['semester_id']);
            $data['semester'] = $semester->name;
            unset($data['semester_id']);
        }
        
        if ($request->hasFile('file')) {
            // Delete old file
            if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
                Storage::disk('public')->delete($resource->file_path);
            }
            $data['file_path'] = $request->file('file')->store('uploads/resources', 'public');
        }
        
        $resource->update($data);
        
        return redirect()->route('admin.resources.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource)
    {
        if ($resource->file_path && Storage::disk('public')->exists($resource->file_path)) {
            Storage::disk('public')->delete($resource->file_path);
        }
        $resource->delete();
        
        return redirect()->route('admin.resources.index');
    }
}
