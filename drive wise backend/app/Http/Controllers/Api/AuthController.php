<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string',
            'password' => 'required|min:6|confirmed'
        ]);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'phone'    => $data['phone'] ?? null,
            'password' => Hash::make($data['password']),
            'role'     => 'customer'
        ]);

        // Create Passport access token
        $token = $user->createToken('API Token')->accessToken;

        return response()->json([
            'user'  => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ], 201);
    }


    public function login(Request $request)
    {
        $data = $request->validate([
            'email'=>'required|email',
            'password'=>'required'
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->suspended) {
            return response()->json(['message' => 'Account suspended'], 403);
        }

        // Generate Passport access token
        $token = $user->createToken('API Token')->accessToken;

        return response()->json([
            'user'  => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }


    public function me(Request $request)
    {
        return response()->json($request->user());
    }


    public function logout(Request $request)
    {
        // Revoke ONLY current access token
        $request->user()->token()->revoke();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
