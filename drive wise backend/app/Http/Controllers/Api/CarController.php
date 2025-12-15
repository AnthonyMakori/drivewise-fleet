<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\Request;

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
}
