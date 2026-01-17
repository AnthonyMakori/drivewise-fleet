<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Serve SPA build if present in public/ (frontend build output)
Route::get('/{any}', function () {
    $index = public_path('index.html');
    if (File::exists($index)) {
        return response(File::get($index), 200)->header('Content-Type', 'text/html');
    }
    return view('welcome');
})->where('any', '.*');
