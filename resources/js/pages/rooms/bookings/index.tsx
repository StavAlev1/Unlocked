import { Head, Link, router } from '@inertiajs/react';
import { CalendarClock, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import CancelBookingDialog from '@/components/rooms/cancel-booking-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { index as roomsIndex } from '@/routes/rooms';
import { create, index } from '@/routes/rooms/bookings';
import { edit as editSchedule } from '@/routes/rooms/schedule';
import type { Booking, BookingStatus, Paginated, Room } from '@/types';

type PageProps = {
    room: Pick<Room, 'id' | 'name' | 'slug'>;
    bookings: Paginated<Booking>;
    filters: { search: string };
    timezone: string;
};

const statusVariant: Record<BookingStatus, 'default' | 'secondary'> = {
    confirmed: 'default',
    cancelled: 'secondary',
};

const statusLabel: Record<BookingStatus, string> = {
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
};

// `dateStyle`/`timeStyle` cannot be combined with `timeZoneName` in every
// Intl implementation (it threw during SSR), so the format is spelled out
// with individual components instead.
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
};

function makeDateFormatter(timezone: string): Intl.DateTimeFormat {
    try {
        return new Intl.DateTimeFormat('en-US', {
            ...DATE_FORMAT_OPTIONS,
            timeZone: timezone,
        });
    } catch {
        // Schedule.timezone is a free-text field on the backend, so an
        // owner could save something Intl doesn't recognize as a zone.
        return new Intl.DateTimeFormat('en-US', DATE_FORMAT_OPTIONS);
    }
}

export default function BookingsIndex({
    room,
    bookings,
    filters,
    timezone,
}: PageProps) {
    const [search, setSearch] = useState(filters.search);
    const dateFormatter = makeDateFormatter(timezone);

    function onSearch(e: FormEvent) {
        e.preventDefault();

        router.get(
            index.url(room.id),
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    }

    const hasNoBookingsAtAll =
        bookings.data.length === 0 && filters.search === '';

    return (
        <>
            <Head title={`${room.name} bookings`} />

            <div className="space-y-6 p-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={`${room.name} bookings`}
                        description="Manage this room's bookings"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={editSchedule(room.id)}>
                                <CalendarClock />
                                Manage schedule
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={create(room.id)}>
                                <Plus />
                                New booking
                            </Link>
                        </Button>
                    </div>
                </div>

                {hasNoBookingsAtAll ? (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center">
                        <h3 className="text-lg font-semibold">
                            No bookings yet
                        </h3>
                        <p className="text-muted-foreground max-w-sm text-sm">
                            This room doesn't have any bookings yet. Log a
                            booking for a phone or walk-in customer to get
                            started.
                        </p>
                        <Button asChild>
                            <Link href={create(room.id)}>
                                <Plus />
                                New booking
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <form
                            onSubmit={onSearch}
                            className="flex items-center gap-2"
                        >
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by customer name or email..."
                                className="max-w-sm"
                            />
                            <Button type="submit" variant="secondary">
                                Search
                            </Button>
                        </form>

                        <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border">
                            <table className="w-full min-w-[640px] text-sm">
                                <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Date &amp; time
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Party size
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="text-muted-foreground px-4 py-6 text-center"
                                            >
                                                No bookings found.
                                            </td>
                                        </tr>
                                    )}

                                    {bookings.data.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {booking.customer_name}
                                                    </span>
                                                    <span className="text-muted-foreground text-xs">
                                                        {booking.customer_email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {dateFormatter.format(
                                                    new Date(booking.starts_at),
                                                )}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {booking.party_size}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        statusVariant[
                                                            booking.status
                                                        ]
                                                    }
                                                >
                                                    {
                                                        statusLabel[
                                                            booking.status
                                                        ]
                                                    }
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    {booking.status ===
                                                        'confirmed' && (
                                                        <CancelBookingDialog
                                                            roomId={room.id}
                                                            booking={booking}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {bookings.last_page > 1 && (
                            <Pagination links={bookings.links} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}

BookingsIndex.layout = {
    breadcrumbs: [
        { title: 'Rooms', href: roomsIndex() },
        { title: 'Bookings', href: '#' },
    ],
};
