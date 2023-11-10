<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('milestone', function (Blueprint $table) {
            $table->bigIncrements('[Index]');
            $table->string('customer', 12);
            $table->string('delivery', 50);
            $table->string('email', 50);
            $table->string('phone_num', 11);
            $table->integer('miles');
            $table->integer('miles_last');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('milestone');
    }
};
