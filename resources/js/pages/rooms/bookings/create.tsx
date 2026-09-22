import { Form, Head, Link } from '@inertiajs/react';
import BookingController from '@/actions/App/Http/Controllers/BookingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index as roomsIndex } from '@/routes/rooms';
import { index } from '@/routes/rooms/bookings';
import type { Room, Schedule } from '@/types';

const textareaClassName =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

type PageProps = {
    room: Pick<
        Room,
        | 'id'
        | 'name'
        | 'slug'
        | 'duration_minutes'
        | 'min_players'
        | 'max_players'
    >;
    schedule: Pick<
        Schedule,
        | 'open_days'
        | 'open_time'
        | 'close_time'
        | 'advance_booking_days'
        | 'min_notice_hours'
        | 'timezone'
    >;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatOpenDays(openDays: number[]): string {
    return [...openDays]
        .sort((a, b) => a - b)
        .map((day) => DAY_LABELS[day])
        .join(', ');
}

export default function BookingsCreate({ room, schedule }: PageProps) {
    return (
        <>
            <Head title={`New booking for ${room.name}`} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="New booking"
                    description={`Log a manual booking for ${room.name}`}
                />

                <Form
                    {...BookingController.store.form(room.id)}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="starts_at">Start time</Label>
                                <Input
                                    id="starts_at"
                                    name="starts_at"
                                    type="datetime-local"
                                    required
                                />
                                <p className="text-muted-foreground text-xs">
                                    Open {formatOpenDays(schedule.open_days)}{' '}
                                    from {schedule.open_time}–
                                    {schedule.close_time} ({schedule.timezone}).
                                    Requires at least{' '}
                                    {schedule.min_notice_hours}h notice and can
                                    be booked up to{' '}
                                    {schedule.advance_booking_days} days in
                                    advance.
                                </p>
                                <InputError message={errors.starts_at} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="party_size">Party size</Label>
                                <Input
                                    id="party_size"
                                    name="party_size"
                                    type="number"
                                    min={1}
                                    required
                                    placeholder="4"
                                />
                                <p className="text-muted-foreground text-xs">
                                    This room takes {room.min_players}–
                                    {room.max_players} players.
                                </p>
                                <InputError message={errors.party_size} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customer_name">
                                    Customer name
                                </Label>
                                <Input
                                    id="customer_name"
                                    name="customer_name"
                                    required
                                    placeholder="Jane Smith"
                                />
                                <InputError message={errors.customer_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customer_email">
                                    Customer email
                                </Label>
                                <Input
                                    id="customer_email"
                                    name="customer_email"
                                    type="email"
                                    required
                                    placeholder="jane@example.com"
                                />
                                <InputError message={errors.customer_email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customer_phone">
                                    Customer phone
                                </Label>
                                <Input
                                    id="customer_phone"
                                    name="customer_phone"
                                    type="tel"
                                    placeholder="(555) 123-4567"
                                />
                                <InputError message={errors.customer_phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes</Label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Optional notes about this booking"
                                    className={textareaClassName}
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    Create booking
                                </Button>
                                <Button variant="secondary" asChild>
                                    <Link href={index(room.id)}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

BookingsCreate.layout = {
    breadcrumbs: [
        { title: 'Rooms', href: roomsIndex() },
        { title: 'New booking', href: '#' },
    ],
};
