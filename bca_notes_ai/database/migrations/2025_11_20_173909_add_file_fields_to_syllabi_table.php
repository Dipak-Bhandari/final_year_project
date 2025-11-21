<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('syllabi', function (Blueprint $table) {
            $table->string('description')->nullable()->after('course');
            $table->string('file_path')->nullable()->after('description');
            $table->string('file_name')->nullable()->after('file_path');
            $table->integer('file_size')->nullable()->after('file_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('syllabi', function (Blueprint $table) {
            $table->dropColumn(['description', 'file_path', 'file_name', 'file_size']);
        });
    }
};
