<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Sent to a room's owner when a customer books it themselves on the public
 * site, so they don't have to keep checking the dashboard to find out.
 * Not sent when the owner logs a booking themselves — they already know.
 */
class NewBookingReceived extends Notification implements ShouldQueue
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
            ->subject("New booking for {$room->name}")
            ->greeting('You\'ve got a new booking.')
            ->line("**Room:** {$room->name}")
            ->line('**When:** '.$booking->starts_at->clone()->utc()->format('l, F j, Y \a\t g:i A').' UTC')
            ->line("**Party size:** {$booking->party_size}")
            ->line("**Customer:** {$booking->customer_name} ({$booking->customer_email})");

        if ($booking->customer_phone !== null) {
            $message->line("**Phone:** {$booking->customer_phone}");
        }

        if ($booking->notes !== null) {
            $message->line("**Notes:** {$booking->notes}");
        }

        return $message->action('View booking', route('rooms.bookings.show', [
            'room' => $room->id,
            'booking' => $booking->id,
        ]));
    }
}
