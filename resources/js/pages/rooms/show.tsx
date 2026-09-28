import { Head, Link } from '@inertiajs/react';
import { CalendarClock, Clock, Pencil, Ticket, Users } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { difficultyLabel, difficultyVariant, formatPrice } from '@/lib/rooms';
import { edit, index } from '@/routes/rooms';
import {
    show as bookingShow,
    index as bookingsIndex,
} from '@/routes/rooms/bookings';
import { edit as scheduleEdit } from '@/routes/rooms/schedule';
import type { Room, Schedule } from '@/types';

type UpcomingBooking = {
    id: number;
    starts_at: string;
    ends_at: string;
    party_size: number;
    status: 'confirmed' | 'cancelled';
    customer_name: string;
};

type PageProps = {
    room: Room;
    schedule: Pick<
        Schedule,
        'open_days' | 'open_time' | 'close_time' | 'timezone' | 'is_active'
    >;
    stats: {
        upcoming_count: number;
        total_bookings: number;
    };
    upcomingBookings: UpcomingBooking[];
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Booking and schedule times are stored and shown in UTC — see the js rules.
const timeFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

const addedFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
});

function formatOpenDays(openDays: number[]): string {
    const sorted = [...openDays].sort((a, b) => a - b);

    if (sorted.length === 7) {
        return 'every day';
    }

    return sorted.map((day) => DAY_LABELS[day]).join(', ');
}

export default function RoomShow({
    room,
    schedule,
    stats,
    upcomingBookings,
}: PageProps) {
    return (
        <>
            <Head title={room.name} />

            <div className="space-y-8 p-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-display text-2xl font-semibold tracking-tight">
                            {room.name}
                        </h1>
                        <Badge variant={difficultyVariant[room.difficulty]}>
                            {difficultyLabel[room.difficulty]}
                        </Badge>
                        <Badge
                            variant={room.is_active ? 'default' : 'secondary'}
                        >
                            {room.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={scheduleEdit(room.id)}>
                                <CalendarClock />
                                Schedule
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={edit(room.id)}>
                                <Pencil />
                                Edit room
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-6">
                        <div className="bg-muted flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl">
                            {room.image_url ? (
                                <img
                                    src={room.image_url}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <AppLogoIcon className="text-muted-foreground size-14 fill-current" />
                            )}
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            {room.description}
                        </p>

                        {room.created_at && (
                            <p className="text-muted-foreground font-mono-data text-xs">
                                Added{' '}
                                {addedFormatter.format(
                                    new Date(room.created_at),
                                )}
                            </p>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="border-sidebar-border/70 dark:border-sidebar-border grid grid-cols-3 divide-x rounded-xl border">
                            <div className="space-y-1 p-4">
                                <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                    <Clock className="size-3.5" />
                                    Duration
                                </dt>
                                <dd className="font-mono-data text-lg">
                                    {room.duration_minutes}
                                    <span className="text-muted-foreground text-sm">
                                        {' '}
                                        min
                                    </span>
                                </dd>
                            </div>
                            <div className="space-y-1 p-4">
                                <dt className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                    <Users className="size-3.5" />
                                    Players
                                </dt>
                                <dd className="font-mono-data text-lg">
                                    {room.min_players}–{room.max_players}
                                </dd>
                            </div>
                            <div className="space-y-1 p-4">
                                <dt className="text-muted-foreground text-xs">
                                    Price
                                </dt>
                                <dd className="font-mono-data text-lg">
                                    {formatPrice(room.price_cents)}
                                </dd>
                            </div>
                        </div>

                        <div className="border-sidebar-border/70 dark:border-sidebar-border space-y-2 rounded-xl border p-4 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Schedule</span>
                                <Badge
                                    variant={
                                        schedule.is_active
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {schedule.is_active ? 'Open' : 'Closed'}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                Open {formatOpenDays(schedule.open_days)} from{' '}
                                {schedule.open_time}–{schedule.close_time} (
                                {schedule.timezone})
                            </p>
                        </div>

                        <div className="border-sidebar-border/70 dark:border-sidebar-border space-y-1 rounded-xl border p-4">
                            <p className="font-mono-data text-2xl">
                                {stats.total_bookings}
                            </p>
                            <p className="text-muted-foreground text-sm">
                                total bookings ({stats.upcoming_count} upcoming)
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="font-display text-lg font-semibold">
                            Upcoming bookings
                        </h2>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={bookingsIndex(room.id)}>
                                <Ticket />
                                View all
                            </Link>
                        </Button>
                    </div>

                    {upcomingBookings.length === 0 ? (
                        <div className="border-sidebar-border/70 dark:border-sidebar-border text-muted-foreground rounded-xl border border-dashed px-4 py-10 text-center text-sm">
                            Nothing booked yet.
                        </div>
                    ) : (
                        <div className="border-sidebar-border/70 dark:border-sidebar-border divide-y rounded-xl border">
                            {upcomingBookings.map((booking) => (
                                <Link
                                    key={booking.id}
                                    href={bookingShow([room.id, booking.id])}
                                    className="hover:bg-accent flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors"
                                >
                                    <span className="font-medium">
                                        {booking.customer_name}
                                    </span>
                                    <span className="font-mono-data text-muted-foreground">
                                        {timeFormatter.format(
                                            new Date(booking.starts_at),
                                        )}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

RoomShow.layout = {
    breadcrumbs: [
        { title: 'Rooms', href: index() },
        { title: 'Room details', href: '#' },
    ],
};
