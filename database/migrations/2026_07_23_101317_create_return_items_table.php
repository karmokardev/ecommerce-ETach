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
        Schema::create('return_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('return_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_variant_id')->constrained()->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('refund_price', 10, 2);
            $table->string('condition')->default('new'); // new, used, damaged
            $table->string('restock_status')->default('pending'); // pending, completed, rejected
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('return_id');
            $table->index('product_variant_id');
            $table->index('restock_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('return_items');
    }
};
