<?php

namespace Database\Factories;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    public function definition()
    {
        $start = $this->faker->dateTimeBetween('now', '+30 days');
        $end = (clone $start)->modify('+'. $this->faker->numberBetween(1,7) .' days');

        return [
            'user_id' => User::factory(),
            'car_id' => Car::factory(),
            'start_date' => $start->format('Y-m-d'),
            'end_date' => $end->format('Y-m-d'),
            'days' => (strtotime($end->format('Y-m-d')) - strtotime($start->format('Y-m-d'))) / 86400 + 1,
            'total_price' => 0,
            'status' => $this->faker->randomElement(['pending','approved','declined']),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}
