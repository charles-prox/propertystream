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
        Schema::create('property_details', function (Blueprint $table) {
            $table->id();
            $table->string('property_id')->unique();
            $table->string('iac_no');
            $table->string('pr_no');
            $table->string('si_no');
            $table->string('dr_no');
            $table->string('po_no');
            $table->string('iar_no');
            $table->string('useful_time');
            $table->text('remarks');
            $table->string('added_by', 8);
            $table->foreign('added_by')->references('hris_id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_details');
    }
};
