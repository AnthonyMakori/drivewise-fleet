<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Car;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // sample customers
        User::factory(5)->create();

        // sample cars
        Car::factory(15)->create();
    }
}
