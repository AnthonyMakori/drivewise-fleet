<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Car extends Model {
    use HasFactory;

    protected $fillable = [
        'name','brand','model','year','seats','gear_type','fuel_type','daily_price','description','images','active'
    ];

    protected $casts = [
        'images' => 'array',
        'active' => 'boolean'
    ];

    public function bookings() {
        return $this->hasMany(Booking::class);
    }

    // returns true if car is available (no conflicts)
    public function isAvailableForPeriod($start_date, $end_date) {
        return !$this->bookings()
            ->whereIn('status', ['pending','approved','out'])
            ->where(function($q) use ($start_date, $end_date) {
              $q->whereBetween('start_date', [$start_date, $end_date])
                  ->orWhereBetween('end_date', [$start_date, $end_date])
                  ->orWhere(function($q2) use ($start_date, $end_date) {
                     $q2->where('start_date', '<=', $start_date)
                        ->where('end_date', '>=', $end_date);
                  });
            })->exists();
    }
}
