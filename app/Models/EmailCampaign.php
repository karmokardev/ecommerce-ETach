<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $subject
 * @property string $content
 * @property string $type
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $scheduled_at
 * @property \Illuminate\Support\Carbon|null $sent_at
 * @property int $recipients_count
 * @property int $opened_count
 * @property int $clicked_count
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Support\Carbon|null $deleted_at
 */
#[Fillable([
    'name',
    'subject',
    'content',
    'type',
    'status',
    'scheduled_at',
    'sent_at',
    'recipients_count',
    'opened_count',
    'clicked_count',
])]
class EmailCampaign extends Model
{
    use HasFactory, SoftDeletes;

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'sent_at' => 'datetime',
            'recipients_count' => 'integer',
            'opened_count' => 'integer',
            'clicked_count' => 'integer',
        ];
    }

    /**
     * Scope to get only draft campaigns.
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    /**
     * Scope to get only scheduled campaigns.
     */
    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    /**
     * Scope to get only sent campaigns.
     */
    public function scopeSent($query)
    {
        return $query->where('status', 'sent');
    }

    /**
     * Scope to get only cancelled campaigns.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Get open rate.
     */
    public function getOpenRateAttribute(): float
    {
        if ($this->recipients_count == 0) {
            return 0;
        }

        return round(($this->opened_count / $this->recipients_count) * 100, 2);
    }

    /**
     * Get click rate.
     */
    public function getClickRateAttribute(): float
    {
        if ($this->recipients_count == 0) {
            return 0;
        }

        return round(($this->clicked_count / $this->recipients_count) * 100, 2);
    }

    /**
     * Check if campaign can be sent.
     */
    public function canBeSent(): bool
    {
        return $this->status === 'draft' || $this->status === 'scheduled';
    }

    /**
     * Mark as sent.
     */
    public function markAsSent(): void
    {
        $this->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    /**
     * Mark as cancelled.
     */
    public function markAsCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }
}
