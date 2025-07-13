<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Syllabus extends Model
{
    use HasFactory;

    protected $fillable = [
        'semester_id',
        'course',
        'units',
    ];

    protected $casts = [
        'units' => 'array',
    ];

    /**
     * Get the semester that owns the syllabus.
     */
    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }
} 