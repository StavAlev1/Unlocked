import { Head, Link } from '@inertiajs/react';
import { Mail, Phone, Users } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import CancelBookingDialog from '@/components/rooms/cancel-booking-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { show as roomShow, index as roomsIndex } from '@/routes/rooms';
import { index as bookingsIndex } from '@/routes/rooms/bookings';
import type { Booking } from '@/types';

type PageProps = {
    room: {
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
    };
    booking: Booking;
    timezone: string;
};

// Booking times are stored and shown in UTC — see the js rules.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

const bookedAtFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
});

export default function BookingShow({ room, booking, timezone }: PageProps) {
    const isCancelled = booking.status === 'cancelled';
    const reference = booking.uuid?.slice(0, 8).toUpperCase();

    return (
        <>
            <Head title={`${booking.customer_name} — ${room.name}`} />

            <div className="mx-auto max-w-xl space-y-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1.5">
                        <Badge variant={isCancelled ? 'secondary' : 'default'}>
                            {isCancelled ? 'Cancelled' : 'Confirmed'}
                        </Badge>
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            {booking.customer_name}
                        </h1>
                    </div>

                    {!isCancelled && (
                        <CancelBookingDialog
                            roomId={room.id}
                            booking={booking}
                        />
                    )}
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-hidden rounded-xl border">
                    <div className="space-y-4 p-5">
                        <Link
                            href={roomShow(room.id)}
                            className="hover:text-primary flex items-center gap-3 font-medium"
                        >
                            <div className="bg-muted flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                {room.image_url ? (
                                    <img
                                        src={room.image_url}
                                        alt=""
                                        className="size-full object-cover"
                                    />
                                ) : (
                                    <AppLogoIcon className="text-muted-foreground size-5 fill-current" />
                                )}
                            </div>
                            {room.name}
                        </Link>

                        <div
                            className={
                                isCancelled
                                    ? 'text-muted-foreground line-through'
                                    : ''
                            }
                        >
                            <p className="font-mono-data">
                                {dateFormatter.format(
                                    new Date(booking.starts_at),
                                )}
                            </p>
                            <p className="font-mono-data text-muted-foreground text-sm">
                                {timeFormatter.format(
                                    new Date(booking.starts_at),
                                )}
                                {'–'}
                                {timeFormatter.format(
                                    new Date(booking.ends_at),
                                )}{' '}
                                {timezone}
                            </p>
                        </div>

                        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                            <Users className="size-4" />
                            {booking.party_size} players
                        </div>
                    </div>

                    {/* Marks the seam between what the booking is for and who it's for. */}
                    <div
                        aria-hidden="true"
                        className="bg-[image:radial-gradient(circle,var(--color-border)_1.5px,transparent_1.5px)] h-2 bg-[length:12px_100%]"
                    />

                    <div className="space-y-3 p-5 text-sm">
                        <a
                            href={`mailto:${booking.customer_email}`}
                            className="hover:text-primary flex items-center gap-2"
                        >
                            <Mail className="text-muted-foreground size-4" />
                            {booking.customer_email}
                        </a>

                        {booking.customer_phone && (
                            <a
                                href={`tel:${booking.customer_phone}`}
                                className="hover:text-primary flex items-center gap-2"
                            >
                                <Phone className="text-muted-foreground size-4" />
                                {booking.customer_phone}
                            </a>
                        )}

                        {booking.notes && (
                            <p className="border-sidebar-border/70 dark:border-sidebar-border text-muted-foreground border-t pt-3">
                                {booking.notes}
                            </p>
                        )}
                    </div>
                </div>

                {isCancelled && (
                    <div className="border-destructive/30 bg-destructive/5 text-destructive-foreground space-y-1 rounded-xl border p-4 text-sm">
                        <p className="font-medium">
                            Cancelled
                            {booking.cancelled_at &&
                                ` on ${bookedAtFormatter.format(new Date(booking.cancelled_at))}`}
                        </p>
                        {booking.cancellation_reason && (
                            <p className="text-muted-foreground">
                                {booking.cancellation_reason}
                            </p>
                        )}
                    </div>
                )}

                <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-mono-data">
                        {reference && `Ref ${reference}`}
                        {booking.created_at &&
                            ` · Booked ${bookedAtFormatter.format(new Date(booking.created_at))}`}
                    </span>
                    <Button
                        variant="link"
                        size="sm"
                        asChild
                        className="h-auto p-0"
                    >
                        <Link href={bookingsIndex(room.id)}>
                            All bookings for {room.name}
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

BookingShow.layout = {
    breadcrumbs: [
        { title: 'Rooms', href: roomsIndex() },
        { title: 'Booking details', href: '#' },
    ],
};
