<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable {
    use HasApiTokens, Notifiable, HasFactory;

    protected $fillable = [
        'name','email','phone','password','role'
    ];

    protected $hidden = [
        'password','remember_token'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime'
    ];

    public function bookings() {
        return $this->hasMany(Booking::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }

    public function isAdmin(): bool {
        return $this->role === 'admin';
    }
}
