<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller {
    public function index(Request $request) {
        $user = $request->user();
        if (!$user || !method_exists($user, 'isAdmin') || ! $user->isAdmin()) {
            return response()->json(['message'=>'Not allowed'], 403);
        }

        $query = User::query();
        if ($q = $request->query('q')) {
            $query->where(function($qb) use ($q) {
                $qb->where('name','like',"%{$q}%")
                   ->orWhere('email','like',"%{$q}%");
            });
        }

        $users = $query->paginate(20);
        return response()->json($users);
    }
}
