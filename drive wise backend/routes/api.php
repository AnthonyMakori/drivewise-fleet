<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;

Route::post('register', [AuthController::class,'register']);
Route::post('login', [AuthController::class,'login']);

Route::get('cars', [CarController::class,'index']);
Route::get('cars/{car}', [CarController::class,'show']);
Route::get('cars/{car}/availability', [CarController::class,'checkAvailability']);


Route::middleware('auth:api')->group(function() {
    Route::get('me', [AuthController::class,'me']);
    Route::post('logout',[AuthController::class,'logout']);

    Route::get('bookings', [BookingController::class,'index']);
    Route::post('bookings', [BookingController::class,'store']);
    Route::get('bookings/{booking}', [BookingController::class,'show']);
    Route::patch('bookings/{booking}/status', [BookingController::class,'updateStatus']);
    Route::post('bookings/{booking}/cancel', [BookingController::class,'cancel']);
    
    // Admin car management
    Route::post('cars', [CarController::class,'store']);
    Route::match(['put','patch'],'cars/{car}', [CarController::class,'update']);
    Route::delete('cars/{car}', [CarController::class,'destroy']);

    // Admin users
    Route::get('users', [UserController::class,'index']);
    Route::post('payments', [PaymentController::class,'store']);
});

// public webhook endpoint for payments
Route::post('payments/webhook', [PaymentController::class,'webhook']);
