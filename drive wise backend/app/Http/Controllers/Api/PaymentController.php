<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;

class PaymentController extends Controller {
    public function store(Request $request) {
        $data = $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'amount' => 'required|numeric|min:0',
            'method' => 'nullable|string',
            'reference' => 'nullable|string'
        ]);

        $booking = Booking::findOrFail($data['booking_id']);

        // optional: validate that requester is booking owner or admin
        if ($request->user()->id !== $booking->user_id && !$request->user()->isAdmin()) {
            return response()->json(['message'=>'Not allowed'], 403);
        }

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'user_id' => $request->user()->id,
            'amount' => $data['amount'],
            'method' => $data['method'] ?? null,
            'reference' => $data['reference'] ?? null,
            'status' => 'completed'
        ]);

        return response()->json($payment, 201);
    }

    public function webhook(Request $request) {
        // Placeholder for payment provider webhook handling
        // Parse provider payload and update payments accordingly
        return response()->json(['message'=>'ok']);
    }
}
