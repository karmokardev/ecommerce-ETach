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
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->foreignId('shipping_method_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('shipping_zone_id')->nullable()->constrained()->onDelete('set null');
            $table->string('tracking_number')->unique()->nullable();
            $table->string('courier')->default('custom'); // pathao, redx, steadfast, custom
            $table->string('status')->default('pending'); // pending, picked_up, in_transit, out_for_delivery, delivered, failed, returned
            $table->text('tracking_url')->nullable();
            $table->json('tracking_history')->nullable(); // Array of tracking events
            $table->decimal('shipping_cost', 10, 2)->default(0);
            $table->string('recipient_name');
            $table->string('recipient_phone');
            $table->text('shipping_address');
            $table->string('pickup_address')->nullable();
            $table->decimal('weight', 10, 2)->default(0);
            $table->decimal('length', 10, 2)->nullable();
            $table->decimal('width', 10, 2)->nullable();
            $table->decimal('height', 10, 2)->nullable();
            $table->string('package_type')->default('standard'); // standard, express, fragile
            $table->text('notes')->nullable();
            $table->timestamp('picked_up_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('estimated_delivery_at')->nullable();
            $table->json('courier_response')->nullable(); // Store API response from courier
            $table->timestamps();
            $table->softDeletes();

            $table->index('order_id');
            $table->index('tracking_number');
            $table->index('status');
            $table->index('courier');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
