<?php

namespace App\Services\Brevo;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Brevo (Sendinblue) REST API — keys only from config/env, never from requests or logs.
 */
class BrevoClient
{
    private function baseUrl(): string
    {
        return rtrim((string) config('services.brevo.base_url', 'https://api.brevo.com/v3'), '/');
    }

    private function apiKey(): ?string
    {
        $key = config('services.brevo.key');
        return is_string($key) && $key !== '' ? $key : null;
    }

    public function isConfigured(): bool
    {
        return $this->apiKey() !== null;
    }

    /**
     * Create or update a CRM contact (attributes are optional Brevo custom fields).
     */
    public function upsertContact(string $email, array $attributes = [], ?int $listId = null): bool
    {
        if (!$this->apiKey()) {
            return false;
        }

        $payload = [
            'email' => strtolower(trim($email)),
            'updateEnabled' => true,
            'attributes' => $attributes,
        ];
        if ($listId !== null) {
            $payload['listIds'] = [(int) $listId];
        }

        try {
            $response = Http::withHeaders([
                'api-key' => $this->apiKey(),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl() . '/contacts', $payload);

            if ($response->successful() || $response->status() === 400) {
                return true;
            }
            Log::warning('Brevo upsertContact failed', ['status' => $response->status()]);
        } catch (\Throwable $e) {
            Log::warning('Brevo upsertContact exception', ['message' => $e->getMessage()]);
        }

        return false;
    }

    /**
     * Transactional email (verified sender domain required in Brevo).
     */
    public function sendTransactionalEmail(
        string $toEmail,
        string $toName,
        string $subject,
        string $htmlContent,
        ?string $senderEmail = null,
        ?string $senderName = null
    ): bool {
        if (!$this->apiKey()) {
            return false;
        }

        $fromEmail = $senderEmail ?: (string) config('services.brevo.sender_email');
        $fromName = $senderName ?: (string) config('services.brevo.sender_name', config('app.name'));
        if ($fromEmail === '') {
            Log::warning('Brevo sendTransactionalEmail: missing sender email');
            return false;
        }

        $payload = [
            'sender' => ['email' => $fromEmail, 'name' => $fromName],
            'to' => [['email' => strtolower(trim($toEmail)), 'name' => $toName]],
            'subject' => $subject,
            'htmlContent' => $htmlContent,
        ];

        try {
            $response = Http::withHeaders([
                'api-key' => $this->apiKey(),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl() . '/smtp/email', $payload);

            if ($response->successful()) {
                return true;
            }
            Log::warning('Brevo sendTransactionalEmail failed', ['status' => $response->status(), 'body' => $response->body()]);
        } catch (\Throwable $e) {
            Log::warning('Brevo sendTransactionalEmail exception', ['message' => $e->getMessage()]);
        }

        return false;
    }

    /**
     * SMS — requires Brevo SMS credits and registered sender name.
     */
    public function sendSms(string $e164Phone, string $content, ?string $senderName = null): bool
    {
        if (!$this->apiKey()) {
            return false;
        }

        $sender = $senderName ?: (string) config('services.brevo.sms_sender');
        if ($sender === '') {
            Log::warning('Brevo sendSms: missing SMS sender');
            return false;
        }

        $payload = [
            'sender' => $sender,
            'recipient' => $e164Phone,
            'content' => $content,
            'type' => 'transactional',
        ];

        try {
            $response = Http::withHeaders([
                'api-key' => $this->apiKey(),
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl() . '/transactionalSMS/sms', $payload);

            if ($response->successful()) {
                return true;
            }
            Log::warning('Brevo sendSms failed', ['status' => $response->status()]);
        } catch (\Throwable $e) {
            Log::warning('Brevo sendSms exception', ['message' => $e->getMessage()]);
        }

        return false;
    }
}
