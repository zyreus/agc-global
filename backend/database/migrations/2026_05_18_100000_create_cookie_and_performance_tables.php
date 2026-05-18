<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cookie_settings', function (Blueprint $table) {
            $table->id();
            $table->json('settings');
            $table->timestamps();
        });

        Schema::create('cookie_consents', function (Blueprint $table) {
            $table->id();
            $table->string('visitor_id', 64)->index();
            $table->string('consent_version', 20)->default('1.0');
            $table->string('action', 32);
            $table->json('categories');
            $table->string('region', 16)->default('ALL');
            $table->string('ip_hash', 64)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamps();

            $table->index(['created_at', 'action']);
        });

        Schema::create('performance_logs', function (Blueprint $table) {
            $table->id();
            $table->string('event', 64);
            $table->string('actor', 120)->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();

            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('performance_logs');
        Schema::dropIfExists('cookie_consents');
        Schema::dropIfExists('cookie_settings');
    }
};
