<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS vector');

        Schema::create('question_vectors', function (Blueprint $table) {
            $table->id()->primary();
            $table->text('question_path');
            $table->text('chunk_text');
             $table->text('course_title');
            $table->text('course_code');
            $table->text('keywords');
            $table->string('year');
            $table->timestamps();
        });
        DB::statement('ALTER TABLE question_vectors ADD COLUMN embedding VECTOR(2560)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_vectors');
    }
};
