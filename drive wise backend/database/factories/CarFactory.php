<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Car>
 */
class CarFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->vehicle ?: $this->faker->word(),
            'brand' => $this->faker->company(),
            'model' => $this->faker->word(),
            'year' => $this->faker->year(),
            'seats' => $this->faker->numberBetween(2,8),
            'gear_type' => $this->faker->randomElement(['Automatic','Manual']),
            'fuel_type' => $this->faker->randomElement(['Petrol','Diesel','Electric']),
            'daily_price' => $this->faker->randomFloat(2,20,200),
            'description' => $this->faker->paragraph(),
            'images' => [],
            'active' => true,
        ];
    }
}
