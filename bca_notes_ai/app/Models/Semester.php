<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    /**
     * Get the syllabi for the semester.
     */
    public function syllabi(): HasMany
    {
        return $this->hasMany(Syllabus::class);
    }

    /**
     * Get the question papers for the semester.
     */
    public function questionPapers(): HasMany
    {
        return $this->hasMany(QuestionPaper::class);
    }
} 