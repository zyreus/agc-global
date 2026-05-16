<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Crypt;

class CustomerProfile extends Model
{
    protected $fillable = [
        'session_id',
        'email_hash',
        'email_encrypted',
        'phone_encrypted',
        'name_encrypted',
        'segment',
        'gdpr_consent_at',
        'marketing_opt_in',
        'attributes',
    ];

    protected $casts = [
        'gdpr_consent_at' => 'datetime',
        'marketing_opt_in' => 'boolean',
        'attributes' => 'array',
    ];

    public function chatbotConversations(): HasMany
    {
        return $this->hasMany(ChatbotConversation::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function getEmailPlain(): ?string
    {
        if (empty($this->email_encrypted)) {
            return null;
        }
        try {
            return Crypt::decryptString($this->email_encrypted);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Upsert profile from a lead form (PII encrypted at rest; email_hash for dedupe).
     */
    public static function upsertFromLead(
        string $sessionId,
        string $email,
        string $name,
        ?string $phone,
        bool $marketingOptIn,
        ?\DateTimeInterface $gdprConsentAt = null
    ): self {
        $normalizedEmail = strtolower(trim($email));
        $hash = hash('sha256', $normalizedEmail);

        $profile = static::query()->firstOrNew(['email_hash' => $hash]);
        $profile->session_id = $sessionId;
        $profile->email_encrypted = Crypt::encryptString($normalizedEmail);
        $profile->name_encrypted = Crypt::encryptString(trim($name));
        $profile->phone_encrypted = $phone ? Crypt::encryptString(trim($phone)) : null;
        $profile->marketing_opt_in = $marketingOptIn;
        if ($gdprConsentAt) {
            $profile->gdpr_consent_at = $gdprConsentAt;
        }
        $profile->segment = $profile->exists ? $profile->segment : 'lead';
        $profile->save();

        return $profile;
    }
}
