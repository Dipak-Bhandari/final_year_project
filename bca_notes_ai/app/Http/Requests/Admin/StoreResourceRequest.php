<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'semester_id' => ['required', 'exists:semesters,id'],
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,gif,webp', 'max:20480'], // 20MB - supports PDFs and images
            'description' => ['nullable', 'string'],
        ];
    }
} 