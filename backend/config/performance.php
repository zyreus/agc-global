<?php

return [
    'public_cache' => [
        'announcements_ttl' => (int) env('CACHE_ANNOUNCEMENTS_TTL', 300),
        'cookie_config_ttl' => (int) env('CACHE_COOKIE_CONFIG_TTL', 600),
    ],

    'http_cache' => [
        'public_get_max_age' => (int) env('HTTP_CACHE_PUBLIC_MAX_AGE', 60),
        'static_max_age' => (int) env('HTTP_CACHE_STATIC_MAX_AGE', 86400),
    ],

    'security_headers' => [
        'x_content_type_options' => 'nosniff',
        'x_frame_options' => 'SAMEORIGIN',
        'referrer_policy' => 'strict-origin-when-cross-origin',
        'permissions_policy' => 'camera=(), microphone=(), geolocation=()',
    ],
];
