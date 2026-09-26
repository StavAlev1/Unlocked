import { Head, Link, router } from '@inertiajs/react';
import { CalendarX, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import CancelBookingDialog from '@/components/rooms/cancel-booking-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { index } from '@/routes/bookings';
import { index as roomBookingsIndex } from '@/routes/rooms/bookings';
import type { BookingWithRoom, Paginated, Room } from '@/types';

type PageProps = {
    bookings: Paginated<BookingWithRoom>;
    rooms: Pick<Room, 'id' | 'name'>[];
    filters: {
        search: string;
        room: number | null;
        status: string;
        from: string;
        to: string;
    };
};

const statusVariant: Record<string, 'default' | 'secondary'> = {
    confirmed: 'default',
    cancelled: 'secondary',
};

const statusLabel: Record<string, string> = {
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
};

// Bookings are validated and stored against business hours in UTC — see
// resources/js/pages/dashboard.tsx for why local-time formatting is wrong
// here.
const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

const ALL_ROOMS = 'all';
const ALL_STATUSES = 'all';

export default function BookingsIndex({ bookings, rooms, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search);
    const [roomId, setRoomId] = useState(
        filters.room !== null ? String(filters.room) : ALL_ROOMS,
    );
    const [status, setStatus] = useState(filters.status || ALL_STATUSES);
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    const hasActiveFilters =
        filters.search !== '' ||
        filters.room !== null ||
        filters.status !== '' ||
        filters.from !== '' ||
        filters.to !== '';

    function applyFilters(e: FormEvent) {
        e.preventDefault();

        router.get(
            index.url(),
            {
                search: search || undefined,
                room: roomId !== ALL_ROOMS ? roomId : undefined,
                status: status !== ALL_STATUSES ? status : undefined,
                from: from || undefined,
                to: to || undefined,
            },
            { preserveState: true, replace: true },
        );
    }

    function clearFilters() {
        setSearch('');
        setRoomId(ALL_ROOMS);
        setStatus(ALL_STATUSES);
        setFrom('');
        setTo('');
        router.get(index.url(), {}, { preserveState: true, replace: true });
    }

    const hasNoRoomsAtAll = rooms.length === 0;

    return (
        <>
            <Head title="Bookings" />

            <div className="space-y-6 p-4">
                <Heading
                    title="Bookings"
                    description="Every booking across all of your rooms"
                />

                {hasNoRoomsAtAll ? (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center">
                        <CalendarX className="text-muted-foreground size-8" />
                        <h3 className="text-lg font-semibold">No rooms yet</h3>
                        <p className="text-muted-foreground max-w-sm text-sm">
                            Add a room first — bookings are tracked per room, so
                            there's nothing to list here until you do.
                        </p>
                    </div>
                ) : (
                    <>
                        <form
                            onSubmit={applyFilters}
                            className="border-sidebar-border/70 dark:border-sidebar-border flex flex-wrap items-end gap-3 rounded-xl border p-4"
                        >
                            <div className="grid gap-1.5">
                                <Label htmlFor="search" className="text-xs">
                                    Search
                                </Label>
                                <Input
                                    id="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Customer name or email..."
                                    className="w-56"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="room" className="text-xs">
                                    Room
                                </Label>
                                <Select
                                    value={roomId}
                                    onValueChange={setRoomId}
                                >
                                    <SelectTrigger id="room" className="w-44">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL_ROOMS}>
                                            All rooms
                                        </SelectItem>
                                        {rooms.map((room) => (
                                            <SelectItem
                                                key={room.id}
                                                value={String(room.id)}
                                            >
                                                {room.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="status" className="text-xs">
                                    Status
                                </Label>
                                <Select
                                    value={status}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger id="status" className="w-36">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ALL_STATUSES}>
                                            All statuses
                                        </SelectItem>
                                        <SelectItem value="confirmed">
                                            Confirmed
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="from" className="text-xs">
                                    From
                                </Label>
                                <Input
                                    id="from"
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-40"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="to" className="text-xs">
                                    To
                                </Label>
                                <Input
                                    id="to"
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-40"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit">Filter</Button>
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={clearFilters}
                                    >
                                        <X />
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </form>

                        <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border">
                            <table className="w-full min-w-[760px] text-sm">
                                <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Room
                                        </th>
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
                                                colSpan={6}
                                                className="text-muted-foreground px-4 py-6 text-center"
                                            >
                                                No bookings match these filters.
                                            </td>
                                        </tr>
                                    )}

                                    {bookings.data.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={roomBookingsIndex(
                                                        booking.room.id,
                                                    )}
                                                    className="hover:text-primary font-medium"
                                                >
                                                    {booking.room.name}
                                                </Link>
                                            </td>
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
                                                            roomId={
                                                                booking.room.id
                                                            }
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
        {
            title: 'Bookings',
            href: index(),
        },
    ],
};
