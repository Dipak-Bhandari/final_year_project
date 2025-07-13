<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionPaper extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester_id',
        'course',
        'year',
        'file_path',
    ];

    /**
     * Get the semester that owns the question paper.
     */
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    /**
     * Get the full URL for the question paper file.
     */
    public function getFileUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
} 