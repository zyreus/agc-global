<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'identifier' => ['required', 'string', 'max:120'],
            'password' => ['required', 'string', 'max:120'],
        ]);

        $identifier = trim($data['identifier']);
        $password = $data['password'];

        $admin = AdminUser::query()
            ->where('username', $identifier)
            ->orWhere('email', $identifier)
            ->first();

        if (!$admin || !Hash::check($password, $admin->password)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $token = $admin->createToken('admin-portal')->plainTextToken;

        return response()->json([
            'token' => $token,
            'admin' => [
                'id' => $admin->id,
                'username' => $admin->username,
                'email' => $admin->email,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user instanceof AdminUser) {
            $user->currentAccessToken()?->delete();
        }

        return response()->json(['ok' => true]);
    }

    public function verify(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!($user instanceof AdminUser)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'ok' => true,
            'admin' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
            ],
        ]);
    }
}

