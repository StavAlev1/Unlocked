<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent to the customer's email address when the room's owner cancels their
 * booking. A customer would otherwise have no way to find out — nothing
 * else notifies them.
 */
class BookingCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Booking $booking)
    {
        //
    }

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $booking = $this->booking;
        $room = $booking->schedule->room;

        $message = (new MailMessage)
            ->subject("Your booking at {$room->name} has been cancelled")
            ->level('error')
            ->greeting("Hi {$booking->customer_name},")
            ->line("Your booking for **{$room->name}** has been cancelled.")
            ->line('**It was booked for:** '.$booking->starts_at->clone()->utc()->format('l, F j, Y \a\t g:i A').' UTC');

        if ($booking->cancellation_reason !== null) {
            $message->line("**Reason:** {$booking->cancellation_reason}");
        }

        return $message
            ->action('View booking', route('public.bookings.show', ['booking' => $booking->uuid]))
            ->line('Reference: '.strtoupper(substr($booking->uuid, 0, 8)));
    }
}
