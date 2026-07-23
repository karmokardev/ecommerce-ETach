<?php

namespace Database\Seeders;

use App\Models\EmailCampaign;
use Illuminate\Database\Seeder;

class EmailCampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $campaigns = [
            [
                'name' => 'Summer Sale Announcement',
                'subject' => '🔥 Summer Sale - Up to 50% Off!',
                'content' => 'Dear Customer,

Our biggest summer sale is here! Get up to 50% off on selected items. Don\'t miss out on these amazing deals.

Shop now and save big!

Best regards,
The Team',
                'type' => 'promotional',
                'status' => 'sent',
                'scheduled_at' => now()->subDays(5),
                'sent_at' => now()->subDays(5),
                'recipients_count' => 1500,
                'opened_count' => 890,
                'clicked_count' => 340,
            ],
            [
                'name' => 'Welcome Email Series',
                'subject' => 'Welcome to Our Store! Here\'s 10% Off Your First Order',
                'content' => 'Welcome to our store!

As a new customer, enjoy 10% off your first order with code WELCOME10.

We\'re excited to have you with us!

Best regards,
The Team',
                'type' => 'promotional',
                'status' => 'sent',
                'scheduled_at' => now()->subDays(15),
                'sent_at' => now()->subDays(15),
                'recipients_count' => 250,
                'opened_count' => 180,
                'clicked_count' => 95,
            ],
            [
                'name' => 'Order Confirmation Template',
                'subject' => 'Order Confirmation - Your Order #{{order_number}}',
                'content' => 'Dear Customer,

Thank you for your order!

Your order #{{order_number}} has been confirmed and is being processed.

Order Details:
- Items: {{items}}
- Total: {{total}}

You will receive another email when your order ships.

Best regards,
The Team',
                'type' => 'order_confirmation',
                'status' => 'draft',
                'scheduled_at' => null,
                'sent_at' => null,
                'recipients_count' => 0,
                'opened_count' => 0,
                'clicked_count' => 0,
            ],
            [
                'name' => 'Abandoned Cart Recovery',
                'subject' => 'You left something behind! 🛒',
                'content' => 'Hi there,

We noticed you left some items in your cart. Don\'t miss out on these great products!

Complete your purchase now and use code CART10 for 10% off.

Your cart items:
{{cart_items}}

Best regards,
The Team',
                'type' => 'abandoned_cart',
                'status' => 'draft',
                'scheduled_at' => null,
                'sent_at' => null,
                'recipients_count' => 0,
                'opened_count' => 0,
                'clicked_count' => 0,
            ],
            [
                'name' => 'Monthly Newsletter',
                'subject' => 'Monthly Newsletter - What\'s New This Month',
                'content' => 'Dear Customer,

Here\'s what\'s new this month:

- New product arrivals
- Featured categories
- Customer spotlight
- Tips and tricks

Read more on our blog!

Best regards,
The Team',
                'type' => 'newsletter',
                'status' => 'scheduled',
                'scheduled_at' => now()->addDays(3),
                'sent_at' => null,
                'recipients_count' => 5000,
                'opened_count' => 0,
                'clicked_count' => 0,
            ],
            [
                'name' => 'Flash Sale Alert',
                'subject' => '⚡ Flash Sale - 24 Hours Only!',
                'content' => 'Flash Sale Alert!

24-hour flash sale starting now. Get 30% off on selected items.

Use code FLASH30 at checkout.

Hurry, offer ends in 24 hours!

Best regards,
The Team',
                'type' => 'promotional',
                'status' => 'cancelled',
                'scheduled_at' => now()->subDays(2),
                'sent_at' => null,
                'recipients_count' => 0,
                'opened_count' => 0,
                'clicked_count' => 0,
            ],
        ];

        foreach ($campaigns as $campaign) {
            EmailCampaign::create($campaign);
        }

        $this->command->info('Email campaigns seeded successfully!');
    }
}
