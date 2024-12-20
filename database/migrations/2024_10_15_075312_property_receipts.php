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
        Schema::create('property_receipts', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number')->unique(); // For the unique PROPERTY ACKNOWLEDGEMENT RECEIPT number
            $table->string('user_id');
            $table->foreign('user_id')->references('hris_id')->on('users');
            $table->bigInteger('property_number');
            $table->date('issued_at'); // Date when the receipt is issued
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_receipts');
    }
};
