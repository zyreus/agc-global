<?php

return [
    'consent_version' => env('COOKIE_CONSENT_VERSION', '1.0'),
    'visitor_cookie' => env('COOKIE_VISITOR_NAME', 'agc_visitor_id'),
    'visitor_ttl_days' => (int) env('COOKIE_VISITOR_TTL_DAYS', 365),

    'banner' => [
        'enabled' => env('COOKIE_BANNER_ENABLED', true),
        'title' => 'We value your privacy',
        'description' => 'We use cookies to improve site performance, analyze traffic, and personalize content. You control what we store.',
        'privacy_policy_url' => env('COOKIE_PRIVACY_URL', 'https://agctek.co/#contact'),
        'accept_label' => 'Accept all',
        'reject_label' => 'Reject non-essential',
        'customize_label' => 'Customize',
    ],

    'categories' => [
        'essential' => [
            'label' => 'Essential',
            'description' => 'Required for security, session stability, and core site features.',
            'required' => true,
            'default' => true,
        ],
        'functional' => [
            'label' => 'Functional',
            'description' => 'Remember preferences such as theme and form progress.',
            'required' => false,
            'default' => false,
        ],
        'analytics' => [
            'label' => 'Analytics',
            'description' => 'Help us understand usage and improve performance (anonymous metrics).',
            'required' => false,
            'default' => false,
        ],
        'marketing' => [
            'label' => 'Marketing',
            'description' => 'Enable relevant offers and campaign measurement.',
            'required' => false,
            'default' => false,
        ],
    ],

    'compliance' => [
        'gdpr_regions' => ['EU', 'EEA', 'UK'],
        'require_consent_before_tracking' => true,
        'log_consents' => env('COOKIE_LOG_CONSENTS', true),
        'retention_days' => (int) env('COOKIE_CONSENT_RETENTION_DAYS', 730),
    ],
];
