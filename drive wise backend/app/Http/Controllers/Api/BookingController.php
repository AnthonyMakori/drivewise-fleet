<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller {
    public function index(Request $request) {
        $user = $request->user();
        if ($user->isAdmin()) {
            $bookings = Booking::with(['car','user'])->latest()->paginate(20);
        } else {
            $bookings = Booking::with(['car'])->where('user_id',$user->id)->latest()->paginate(20);
        }
        return response()->json($bookings);
    }

    public function show(Booking $booking) {
        $booking->load(['car','user','payments']);
        return response()->json($booking);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'notes' => 'nullable|string'
        ]);

        $car = Car::findOrFail($data['car_id']);

        $days = \Carbon\Carbon::parse($data['start_date'])->diffInDays(\Carbon\Carbon::parse($data['end_date'])) + 1;

        // check for conflicts
        $conflict = $car->bookings()
            ->whereIn('status', ['pending','approved','out'])
            ->where(function($q) use ($data) {
                 $q->whereBetween('start_date', [$data['start_date'],$data['end_date']])
                   ->orWhereBetween('end_date', [$data['start_date'],$data['end_date']])
                   ->orWhere(function($q2) use ($data) {
                      $q2->where('start_date','<=',$data['start_date'])
                         ->where('end_date','>=',$data['end_date']);
                   });
            })->exists();

        if ($conflict) {
            return response()->json(['message'=>'Car not available for selected dates'], 422);
        }

        $total = $car->daily_price * $days;

        DB::beginTransaction();
        try {
            $booking = Booking::create([
                'user_id' => $request->user()->id,
                'car_id' => $car->id,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'days' => $days,
                'total_price' => $total,
                'status' => 'pending',
                'notes' => $data['notes'] ?? null
            ]);
            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message'=>'Could not create booking','error'=>$e->getMessage()], 500);
        }

        return response()->json($booking, 201);
    }

    public function updateStatus(Request $request, Booking $booking) {
        $user = $request->user();
        if (!$user->isAdmin()) {
            return response()->json(['message'=>'Not allowed'], 403);
        }

        $data = $request->validate([
            'status' => 'required|in:pending,approved,declined,out,returned,cancelled'
        ]);

        $booking->status = $data['status'];
        $booking->save();
        return response()->json($booking);
    }

    public function cancel(Request $request, Booking $booking) {
        if ($booking->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message'=>'Not allowed'], 403);
        }

        if (!in_array($booking->status, ['pending','approved'])) {
            return response()->json(['message'=>'Cannot cancel booking in this state'], 422);
        }

        $booking->status = 'cancelled';
        $booking->save();
        return response()->json($booking);
    }
}
