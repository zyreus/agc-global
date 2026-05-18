<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AttachPerformanceHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        if ($request->isMethod('GET') && $request->is('api/announcements', 'api/privacy/*')) {
            $maxAge = (int) config('performance.http_cache.public_get_max_age', 60);
            $response->headers->set('Cache-Control', "public, max-age={$maxAge}, stale-while-revalidate=30");
        }

        $map = [
            'x_content_type_options' => 'X-Content-Type-Options',
            'x_frame_options' => 'X-Frame-Options',
            'referrer_policy' => 'Referrer-Policy',
            'permissions_policy' => 'Permissions-Policy',
        ];
        foreach (config('performance.security_headers', []) as $key => $value) {
            $name = $map[$key] ?? $key;
            $response->headers->set($name, $value);
        }

        return $response;
    }
}
