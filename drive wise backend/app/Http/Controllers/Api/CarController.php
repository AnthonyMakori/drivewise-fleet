<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CarController extends Controller {
    public function index(Request $request) {
        $query = Car::query()->where('active', true);

        if ($q = $request->query('q')) {
            $query->where(function($q2) use ($q) {
                $q2->where('name','like',"%{$q}%")
                   ->orWhere('brand','like',"%{$q}%")
                   ->orWhere('model','like',"%{$q}%");
            });
        }

        if ($request->has('min_price')) $query->where('daily_price','>=',$request->query('min_price'));
        if ($request->has('max_price')) $query->where('daily_price','<=',$request->query('max_price'));
        if ($type = $request->query('gear_type')) $query->where('gear_type',$type);
        if ($fuel = $request->query('fuel_type')) $query->where('fuel_type',$fuel);

        $cars = $query->paginate(12);
        return response()->json($cars);
    }

    public function show(Car $car) {
        return response()->json($car);
    }

    public function checkAvailability(Request $request, Car $car) {
        $data = $request->validate([
            'start_date'=>'required|date',
            'end_date'=>'required|date|after_or_equal:start_date'
        ]);
        $available = $car->isAvailableForPeriod($data['start_date'], $data['end_date']);
        return response()->json(['available'=>$available]);
    }

    public function store(Request $request) {
        $user = $request->user();
        if (!$user || !method_exists($user, 'isAdmin') || ! $user->isAdmin()) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:2100',
            'seats' => 'required|integer|min:1|max:20',
            'gear_type' => 'required|string',
            'fuel_type' => 'required|string',
            'daily_price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'nullable|url',
            'images_files.*' => 'nullable|image|max:5120',
            'active' => 'nullable|boolean'
        ]);

        $images = $data['images'] ?? [];
        // handle uploaded image files (images_files[])
        if ($request->hasFile('images_files')) {
            foreach ($request->file('images_files') as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('cars', 'public');
                    $images[] = Storage::disk('public')->url($path);
                }
            }
        }

        $car = Car::create([
            'name' => $data['name'],
            'brand' => $data['brand'],
            'model' => $data['model'],
            'year' => $data['year'],
            'seats' => $data['seats'],
            'gear_type' => $data['gear_type'],
            'fuel_type' => $data['fuel_type'],
            'daily_price' => $data['daily_price'],
            'description' => $data['description'] ?? null,
            'images' => $images,
            'active' => $data['active'] ?? true,
        ]);

        return response()->json($car, 201);
    }

    public function update(Request $request, Car $car) {
        $user = $request->user();
        if (!$user || !method_exists($user, 'isAdmin') || ! $user->isAdmin()) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'sometimes|required|string|max:255',
            'model' => 'sometimes|required|string|max:255',
            'year' => 'sometimes|required|integer|min:1900|max:2100',
            'seats' => 'sometimes|required|integer|min:1|max:20',
            'gear_type' => 'sometimes|required|string',
            'fuel_type' => 'sometimes|required|string',
            'daily_price' => 'sometimes|required|numeric|min:0',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'nullable|url',
            'images_files.*' => 'nullable|image|max:5120',
            'active' => 'nullable|boolean'
        ]);
        // if images present in data start with them, else existing
        $images = $data['images'] ?? $car->images ?? [];
        if ($request->hasFile('images_files')) {
            foreach ($request->file('images_files') as $file) {
                if ($file && $file->isValid()) {
                    $path = $file->store('cars', 'public');
                    $images[] = Storage::disk('public')->url($path);
                }
            }
        }

        $car->fill($data);
        $car->images = $images;
        $car->save();

        return response()->json($car);
    }

    public function destroy(Request $request, Car $car) {
        $user = $request->user();
        if (!$user || !method_exists($user, 'isAdmin') || ! $user->isAdmin()) {
            return response()->json(['message' => 'Not allowed'], 403);
        }

        try {
            $car->delete();
            return response()->json(['message' => 'Deleted']);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Delete failed', 'error' => $e->getMessage()], 500);
        }
    }
}
