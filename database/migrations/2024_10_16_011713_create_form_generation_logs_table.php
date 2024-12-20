<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('form_generation_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_receipt_id')->constrained('property_receipts')->onDelete('cascade'); // Linked receipt
            $table->string('user_id');
            $table->foreign('user_id')->references('hris_id')->on('users');
            $table->ipAddress('user_ip')->nullable(); // IP address
            $table->string('device')->nullable(); // Device used
            $table->timestamp('generated_at')->useCurrent(); // Generation time
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('form_generation_logs');
    }
};
