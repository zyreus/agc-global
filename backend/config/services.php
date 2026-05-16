<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'openai' => [
        'key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
    ],

    'brevo' => [
        'key' => env('BREVO_API_KEY'),
        'base_url' => env('BREVO_BASE_URL', 'https://api.brevo.com/v3'),
        'sender_email' => env('BREVO_SENDER_EMAIL'),
        'sender_name' => env('BREVO_SENDER_NAME', env('APP_NAME', 'AGC')),
        'sms_sender' => env('BREVO_SMS_SENDER'),
        'default_list_id' => env('BREVO_DEFAULT_LIST_ID'),
        'team_notify_email' => env('BREVO_TEAM_NOTIFY_EMAIL'),
    ],

    'channels' => [
        'messenger_verify_token' => env('MESSENGER_VERIFY_TOKEN'),
        'whatsapp_verify_token' => env('WHATSAPP_VERIFY_TOKEN'),
    ],

    'admin' => [
        'portal_key' => env('ADMIN_PORTAL_KEY'),
    ],

];
