import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import MonthCalendar from '@/components/dashboard/month-calendar';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { create, edit as editRoom } from '@/routes/rooms';
import type { DashboardBooking } from '@/types';

type PageProps = {
    month: string;
    calendarBookings: DashboardBooking[];
    upcomingBookings: DashboardBooking[];
    hasAnyRooms: boolean;
};

// Bookings are stored and validated against the schedule's business hours
// in UTC (Schedule.timezone isn't wired into real conversion yet — see
// backend), so times are formatted in UTC here too. Using the viewer's
// local zone instead would shift a 10:00–20:00 booking to whatever the
// browser's offset happens to be, making it look like it's outside the
// room's open hours.
const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

const dayHeadingFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
});

function dateKey(iso: string): string {
    const d = new Date(iso);

    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export default function Dashboard({
    month,
    calendarBookings,
    upcomingBookings,
    hasAnyRooms,
}: PageProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const countsByDate = useMemo(() => {
        const counts: Record<string, number> = {};

        for (const booking of calendarBookings) {
            const key = dateKey(booking.starts_at);
            counts[key] = (counts[key] ?? 0) + 1;
        }

        return counts;
    }, [calendarBookings]);

    const selectedDayBookings = useMemo(() => {
        if (selectedDate === null) {
            return null;
        }

        return calendarBookings
            .filter((booking) => dateKey(booking.starts_at) === selectedDate)
            .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    }, [calendarBookings, selectedDate]);

    const listTitle =
        selectedDate !== null
            ? dayHeadingFormatter.format(new Date(`${selectedDate}T00:00:00Z`))
            : 'Upcoming bookings';

    const listBookings = selectedDayBookings ?? upcomingBookings;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Dashboard"
                    description="Upcoming bookings across every room you manage"
                />

                {!hasAnyRooms ? (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center">
                        <h3 className="text-lg font-semibold">No rooms yet</h3>
                        <p className="text-muted-foreground max-w-sm text-sm">
                            Add a room to start tracking its schedule and
                            bookings here.
                        </p>
                        <Button asChild>
                            <Link href={create()}>
                                <Plus />
                                New room
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
                        <MonthCalendar
                            month={month}
                            countsByDate={countsByDate}
                            selectedDate={selectedDate}
                            onSelectDate={(date) =>
                                setSelectedDate((current) =>
                                    current === date ? null : date,
                                )
                            }
                        />

                        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <h3 className="font-display text-base font-semibold">
                                    {listTitle}
                                </h3>
                                {selectedDate !== null && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedDate(null)}
                                    >
                                        Show upcoming
                                    </Button>
                                )}
                            </div>

                            {listBookings.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    {selectedDate !== null
                                        ? 'No bookings on this day.'
                                        : 'Nothing booked yet.'}
                                </p>
                            ) : (
                                <ul className="divide-border -my-1 divide-y">
                                    {listBookings.map((booking) => (
                                        <li
                                            key={booking.id}
                                            className="flex items-center justify-between gap-4 py-3"
                                        >
                                            <div className="min-w-0">
                                                <Link
                                                    href={editRoom(
                                                        booking.room.id,
                                                    )}
                                                    className="hover:text-primary truncate text-sm font-medium"
                                                >
                                                    {booking.room.name}
                                                </Link>
                                                <p className="text-muted-foreground truncate text-xs">
                                                    {booking.customer_name}{' '}
                                                    &middot; party of{' '}
                                                    {booking.party_size}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="default">
                                                    {selectedDate !== null
                                                        ? timeFormatter.format(
                                                              new Date(
                                                                  booking.starts_at,
                                                              ),
                                                          )
                                                        : dateTimeFormatter.format(
                                                              new Date(
                                                                  booking.starts_at,
                                                              ),
                                                          )}
                                                </Badge>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
