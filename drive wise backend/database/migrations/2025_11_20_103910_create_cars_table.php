<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->string('brand')->nullable();
            $table->string('model')->nullable();
            $table->string('year')->nullable();
            $table->integer('seats')->nullable();
            $table->string('gear_type')->nullable(); 
            $table->string('fuel_type')->nullable();
            $table->decimal('daily_price', 10, 2)->default(0.00);
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists('cars');
    }
};
