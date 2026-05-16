<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_leads', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->index();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->text('concern')->nullable();
            $table->string('status', 24)->default('open')->index(); // open | in_progress | closed
            $table->timestamp('archived_at')->nullable()->index();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_leads');
    }
};

