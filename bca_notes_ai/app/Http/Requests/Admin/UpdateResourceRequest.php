<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'semester' => ['required', 'string', 'max:10'],
            'file' => ['nullable', 'file', 'mimes:pdf', 'max:10240'], // 10MB
            'description' => ['nullable', 'string'],
        ];
    }
} 