<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 120)->nullable()->index();
            $table->string('email_hash', 64)->nullable()->unique();
            $table->text('email_encrypted')->nullable();
            $table->text('phone_encrypted')->nullable();
            $table->text('name_encrypted')->nullable();
            $table->string('segment', 64)->default('default')->index();
            $table->timestamp('gdpr_consent_at')->nullable();
            $table->boolean('marketing_opt_in')->default(false);
            $table->json('attributes')->nullable();
            $table->timestamps();
        });

        Schema::create('chatbot_conversations', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 120)->unique();
            $table->string('channel', 32)->default('website')->index();
            $table->foreignId('customer_profile_id')->nullable()->constrained('customer_profiles')->onDelete('set null');
            $table->string('segment', 64)->default('default')->index();
            $table->string('last_detected_intent', 64)->nullable()->index();
            $table->timestamp('escalation_requested_at')->nullable()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        Schema::create('faq_training_data', function (Blueprint $table) {
            $table->id();
            $table->string('category', 64)->default('general')->index();
            $table->string('title')->nullable();
            $table->text('question');
            $table->text('answer');
            $table->text('keywords')->nullable();
            $table->unsignedSmallInteger('priority')->default(0)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('customer_intents', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 120)->index();
            $table->foreignId('chat_message_id')->nullable()->constrained('chat_messages')->onDelete('set null');
            $table->string('intent_label', 64)->index();
            $table->decimal('confidence', 6, 4)->default(0);
            $table->string('source', 24)->default('openai');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('chatbot_messages', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 120)->index();
            $table->foreignId('chat_message_id')->unique()->constrained('chat_messages')->onDelete('cascade');
            $table->string('detected_intent', 64)->nullable()->index();
            $table->decimal('intent_confidence', 6, 4)->nullable();
            $table->boolean('uncertain')->default(false);
            $table->boolean('escalate_triggered')->default(false);
            $table->string('model_used', 64)->nullable();
            $table->unsignedInteger('response_tokens')->nullable();
            $table->timestamps();
        });

        Schema::create('escalation_logs', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 120)->index();
            $table->text('reason');
            $table->string('triggered_by', 24)->default('ai')->index();
            $table->json('context')->nullable();
            $table->timestamps();
        });

        Schema::create('campaign_automations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('brevo_template_id')->nullable();
            $table->unsignedBigInteger('brevo_list_id')->nullable();
            $table->string('trigger', 64)->index();
            $table->json('segment_filter')->nullable();
            $table->json('schedule_config')->nullable();
            $table->boolean('is_active')->default(false)->index();
            $table->timestamps();
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 120)->nullable()->index();
            $table->foreignId('customer_profile_id')->nullable()->constrained('customer_profiles')->onDelete('set null');
            $table->string('subject');
            $table->string('priority', 16)->default('normal')->index();
            $table->string('status', 24)->default('open')->index();
            $table->string('channel', 32)->default('website');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('campaign_automations');
        Schema::dropIfExists('escalation_logs');
        Schema::dropIfExists('chatbot_messages');
        Schema::dropIfExists('customer_intents');
        Schema::dropIfExists('faq_training_data');
        Schema::dropIfExists('chatbot_conversations');
        Schema::dropIfExists('customer_profiles');
    }
};
