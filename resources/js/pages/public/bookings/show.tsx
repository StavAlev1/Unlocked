import { Head, Link } from '@inertiajs/react';
import { CalendarClock, Check, Copy, Users } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { show as showRoom } from '@/routes/public/rooms';
import type { PublicBooking } from '@/types';

type PageProps = {
    booking: PublicBooking;
};

// Booking times are stored and shown in UTC — see the js rules.
const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

export default function PublicBookingShow({ booking }: PageProps) {
    const [copiedText, copy] = useClipboard();
    const isCancelled = booking.status === 'cancelled';
    const reference = booking.uuid.slice(0, 8).toUpperCase();
    const pageUrl = typeof window === 'undefined' ? '' : window.location.href;

    return (
        <>
            <Head title={`Booking ${reference}`}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="mx-auto max-w-xl space-y-6">
                <div className="space-y-2">
                    <Badge variant={isCancelled ? 'secondary' : 'default'}>
                        {isCancelled ? 'Cancelled' : 'Confirmed'}
                    </Badge>
                    <h1 className="font-display text-3xl font-semibold tracking-tight">
                        {isCancelled
                            ? 'This booking was cancelled'
                            : `You're booked, ${booking.customer_name}`}
                    </h1>
                </div>

                <div className="border-border bg-card overflow-hidden rounded-xl border">
                    <div className="bg-muted flex aspect-[16/7] items-center justify-center overflow-hidden">
                        {booking.room.image_url ? (
                            <img
                                src={booking.room.image_url}
                                alt=""
                                className="size-full object-cover"
                            />
                        ) : (
                            <AppLogoIcon className="text-muted-foreground size-12 fill-current" />
                        )}
                    </div>

                    <dl className="space-y-4 p-5">
                        <div>
                            <dt className="text-muted-foreground text-xs uppercase">
                                Room
                            </dt>
                            <dd className="font-display text-lg font-semibold">
                                {booking.room.name}
                            </dd>
                        </div>

                        <div className="flex items-start gap-2">
                            <CalendarClock className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                            <div>
                                <dt className="sr-only">When</dt>
                                <dd
                                    className={isCancelled ? 'line-through' : ''}
                                >
                                    {dateTimeFormatter.format(
                                        new Date(booking.starts_at),
                                    )}{' '}
                                    –{' '}
                                    {timeFormatter.format(
                                        new Date(booking.ends_at),
                                    )}{' '}
                                    UTC
                                </dd>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Users className="text-muted-foreground size-4 shrink-0" />
                            <dt className="sr-only">Players</dt>
                            <dd>
                                {booking.party_size}{' '}
                                {booking.party_size === 1 ? 'player' : 'players'}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-muted-foreground text-xs uppercase">
                                Reference
                            </dt>
                            <dd className="font-mono-data">{reference}</dd>
                        </div>
                    </dl>
                </div>

                <div className="border-border space-y-3 rounded-xl border p-5 text-sm">
                    <p className="text-muted-foreground">
                        Keep this page's link — it's the private way to find
                        your booking. Anyone with the link can view it.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copy(pageUrl)}
                    >
                        {copiedText === pageUrl ? <Check /> : <Copy />}
                        {copiedText === pageUrl ? 'Copied' : 'Copy link'}
                    </Button>
                </div>

                {booking.room.is_bookable && (
                    <Button variant="secondary" asChild>
                        <Link href={showRoom(booking.room.uuid)}>
                            {isCancelled ? 'Book another time' : 'View room'}
                        </Link>
                    </Button>
                )}
            </div>
        </>
    );
}
