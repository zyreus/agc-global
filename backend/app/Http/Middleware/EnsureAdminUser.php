<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use Closure;
use Illuminate\Http\Request;

class EnsureAdminUser
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (!$user || !($user instanceof AdminUser)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $next($request);
    }
}

