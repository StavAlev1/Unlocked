<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent to the customer's email address (on demand — a customer has no
 * account) the moment their booking is created, whether they booked it
 * themselves on the public site or the room's owner logged it for them. It
 * doubles as the customer's durable copy of their booking link, since the
 * page they land on right after booking is otherwise their only copy.
 */
class BookingConfirmed extends Notification implements ShouldQueue
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

        return (new MailMessage)
            ->subject("Your booking at {$room->name} is confirmed")
            ->greeting("Hi {$booking->customer_name},")
            ->line("You're booked in for **{$room->name}**.")
            ->line('**When:** '.$booking->starts_at->clone()->utc()->format('l, F j, Y \a\t g:i A').' UTC')
            ->line("**Party size:** {$booking->party_size}")
            ->action('View your booking', route('public.bookings.show', ['booking' => $booking->uuid]))
            ->line('Keep this link — it\'s the only way to find your booking again.')
            ->line('Reference: '.strtoupper(substr($booking->uuid, 0, 8)));
    }
}
