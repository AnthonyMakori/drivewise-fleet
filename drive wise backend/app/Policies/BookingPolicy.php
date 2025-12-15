<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    public function update(User $user, Booking $booking)
    {
        // Admins or booking owners can update (you can tighten this)
        return $user->isAdmin() || $user->id === $booking->user_id
            ? Response::allow()
            : Response::deny('You do not own this booking.');
    }
}
