<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailCampaign;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmailCampaignController extends Controller
{
    /**
     * Display a listing of email campaigns.
     */
    public function index(Request $request)
    {
        $query = EmailCampaign::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('subject', 'like', "%{$request->search}%");
        }

        if ($request->status === 'draft') {
            $query->draft();
        } elseif ($request->status === 'scheduled') {
            $query->scheduled();
        } elseif ($request->status === 'sent') {
            $query->sent();
        } elseif ($request->status === 'cancelled') {
            $query->cancelled();
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $campaigns = $query->orderBy('created_at', 'desc')->paginate(10);

        return Inertia::render('admin/email-campaigns/index', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    /**
     * Show the form for creating a new email campaign.
     */
    public function create()
    {
        return Inertia::render('admin/email-campaigns/create');
    }

    /**
     * Store a newly created email campaign.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:order_confirmation,promotional,newsletter,abandoned_cart',
            'status' => 'required|in:draft,scheduled',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $campaign = EmailCampaign::create($validated);

        return redirect()->route('email-campaigns.index')->with('success', 'Email campaign created successfully.');
    }

    /**
     * Display the specified email campaign.
     */
    public function show(EmailCampaign $campaign)
    {
        return Inertia::render('admin/email-campaigns/show', [
            'campaign' => $campaign,
        ]);
    }

    /**
     * Show the form for editing the specified email campaign.
     */
    public function edit(EmailCampaign $campaign)
    {
        return Inertia::render('admin/email-campaigns/edit', [
            'campaign' => $campaign,
        ]);
    }

    /**
     * Update the specified email campaign.
     */
    public function update(Request $request, EmailCampaign $campaign)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:order_confirmation,promotional,newsletter,abandoned_cart',
            'status' => 'required|in:draft,scheduled',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $campaign->update($validated);

        return redirect()->route('email-campaigns.index')->with('success', 'Email campaign updated successfully.');
    }

    /**
     * Remove the specified email campaign.
     */
    public function destroy(EmailCampaign $campaign)
    {
        $campaign->delete();

        return redirect()->route('email-campaigns.index')->with('success', 'Email campaign deleted successfully.');
    }

    /**
     * Send the email campaign immediately.
     */
    public function send(EmailCampaign $campaign)
    {
        if (!$campaign->canBeSent()) {
            return back()->with('error', 'This campaign cannot be sent.');
        }

        // TODO: Implement actual email sending logic
        $campaign->markAsSent();

        return back()->with('success', 'Email campaign sent successfully.');
    }

    /**
     * Cancel the email campaign.
     */
    public function cancel(EmailCampaign $campaign)
    {
        $campaign->markAsCancelled();

        return back()->with('success', 'Email campaign cancelled successfully.');
    }
}
