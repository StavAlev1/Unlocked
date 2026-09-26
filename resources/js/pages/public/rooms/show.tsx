import { Form, Head, router } from '@inertiajs/react';
import { Clock, Users } from 'lucide-react';
import { useState } from 'react';
import PublicBookingController from '@/actions/App/Http/Controllers/PublicBookingController';
import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { difficultyLabel, difficultyVariant, formatPrice } from '@/lib/rooms';
import { show } from '@/routes/public/rooms';
import type { BookableSlot, PublicRoom } from '@/types';

const textareaClassName =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

type PageProps = {
    room: PublicRoom;
    dates: string[];
    selected_date: string | null;
    slots: BookableSlot[];
};

// Booking times are stored and shown in UTC — see the js rules.
const dayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

const summaryFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
});

export default function PublicRoomShow({
    room,
    dates,
    selected_date: selectedDate,
    slots,
}: PageProps) {
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    function selectDate(date: string) {
        setSelectedSlot(null);

        router.get(
            show.url(room.uuid),
            { date },
            {
                only: ['selected_date', 'slots'],
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    const hasFreeSlot = slots.some((slot) => slot.available);

    return (
        <>
            <Head title={room.name} />

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <div className="min-w-0 space-y-6">
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

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="font-display text-3xl font-semibold tracking-tight">
                                {room.name}
                            </h1>
                            <Badge variant={difficultyVariant[room.difficulty]}>
                                {difficultyLabel[room.difficulty]}
                            </Badge>
                        </div>

                        <p className="text-muted-foreground leading-relaxed">
                            {room.description}
                        </p>

                        <dl className="text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 text-sm">
                            <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Duration</dt>
                                <Clock className="size-4" />
                                <dd>{room.duration_minutes} minutes</dd>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Players</dt>
                                <Users className="size-4" />
                                <dd>
                                    {room.min_players}–{room.max_players}{' '}
                                    players
                                </dd>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Price</dt>
                                <dd className="text-foreground font-mono-data">
                                    {formatPrice(room.price_cents)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <aside className="border-border bg-card h-fit min-w-0 space-y-6 rounded-xl border p-5">
                    <h2 className="font-display text-xl font-semibold">
                        Book this room
                    </h2>

                    {dates.length === 0 || selectedDate === null ? (
                        <p className="text-muted-foreground text-sm">
                            There are no times available to book right now.
                            Please check back soon.
                        </p>
                    ) : (
                        <Form
                            {...PublicBookingController.store.form(room.uuid)}
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label>Date</Label>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {dates.map((date) => (
                                                <Button
                                                    key={date}
                                                    type="button"
                                                    size="sm"
                                                    variant={
                                                        date === selectedDate
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    aria-pressed={
                                                        date === selectedDate
                                                    }
                                                    onClick={() =>
                                                        selectDate(date)
                                                    }
                                                    className="shrink-0"
                                                >
                                                    {dayFormatter.format(
                                                        new Date(
                                                            `${date}T00:00:00Z`,
                                                        ),
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Time (UTC)</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {slots.map((slot) => (
                                                <Button
                                                    key={slot.starts_at}
                                                    type="button"
                                                    size="sm"
                                                    variant={
                                                        slot.starts_at ===
                                                        selectedSlot
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    aria-pressed={
                                                        slot.starts_at ===
                                                        selectedSlot
                                                    }
                                                    disabled={!slot.available}
                                                    onClick={() =>
                                                        setSelectedSlot(
                                                            slot.starts_at,
                                                        )
                                                    }
                                                    className="font-mono-data disabled:line-through"
                                                >
                                                    {timeFormatter.format(
                                                        new Date(
                                                            slot.starts_at,
                                                        ),
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                        {!hasFreeSlot && (
                                            <p className="text-muted-foreground text-xs">
                                                Every time on this day is
                                                booked. Try another date.
                                            </p>
                                        )}
                                        <input
                                            type="hidden"
                                            name="starts_at"
                                            value={selectedSlot ?? ''}
                                        />
                                        <InputError
                                            message={errors.starts_at}
                                        />
                                    </div>

                                    {selectedSlot && (
                                        <p className="bg-muted rounded-md px-3 py-2 text-sm">
                                            {summaryFormatter.format(
                                                new Date(selectedSlot),
                                            )}{' '}
                                            UTC
                                        </p>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="party_size">
                                            Party size
                                        </Label>
                                        <Input
                                            id="party_size"
                                            name="party_size"
                                            type="number"
                                            min={room.min_players}
                                            max={room.max_players}
                                            defaultValue={room.min_players}
                                            required
                                        />
                                        <InputError
                                            message={errors.party_size}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="customer_name">
                                            Your name
                                        </Label>
                                        <Input
                                            id="customer_name"
                                            name="customer_name"
                                            autoComplete="name"
                                            required
                                        />
                                        <InputError
                                            message={errors.customer_name}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="customer_email">
                                            Email
                                        </Label>
                                        <Input
                                            id="customer_email"
                                            name="customer_email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                        />
                                        <InputError
                                            message={errors.customer_email}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="customer_phone">
                                            Phone (optional)
                                        </Label>
                                        <Input
                                            id="customer_phone"
                                            name="customer_phone"
                                            type="tel"
                                            autoComplete="tel"
                                        />
                                        <InputError
                                            message={errors.customer_phone}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="notes">
                                            Notes (optional)
                                        </Label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            className={textareaClassName}
                                        />
                                        <InputError message={errors.notes} />
                                    </div>

                                    <Button
                                        className="w-full"
                                        disabled={!selectedSlot || processing}
                                    >
                                        Confirm booking
                                    </Button>
                                </>
                            )}
                        </Form>
                    )}
                </aside>
            </div>
        </>
    );
}
