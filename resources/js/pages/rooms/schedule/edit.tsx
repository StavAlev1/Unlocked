import { Form, Head, Link } from '@inertiajs/react';
import RoomScheduleController from '@/actions/App/Http/Controllers/RoomScheduleController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { index } from '@/routes/rooms';
import type { Room, Schedule } from '@/types';

type PageProps = {
    room: Pick<Room, 'id' | 'name' | 'slug'>;
    schedule: Schedule;
};

const DAYS = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
];

export default function RoomScheduleEdit({ room, schedule }: PageProps) {
    return (
        <>
            <Head title={`${room.name} schedule`} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="Room schedule"
                    description={`Manage ${room.name}'s operating hours and booking rules`}
                />

                <Form
                    {...RoomScheduleController.update.form(room.id)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label>Open days</Label>
                                <div className="flex flex-wrap gap-4">
                                    {DAYS.map((day) => (
                                        <div
                                            key={day.value}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                id={`open_days_${day.value}`}
                                                name="open_days[]"
                                                value={day.value}
                                                defaultChecked={schedule.open_days.includes(
                                                    day.value,
                                                )}
                                            />
                                            <Label
                                                htmlFor={`open_days_${day.value}`}
                                                className="font-normal"
                                            >
                                                {day.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.open_days} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="open_time">Open time</Label>
                                    <Input
                                        id="open_time"
                                        name="open_time"
                                        type="time"
                                        defaultValue={schedule.open_time}
                                        required
                                    />
                                    <InputError message={errors.open_time} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="close_time">
                                        Close time
                                    </Label>
                                    <Input
                                        id="close_time"
                                        name="close_time"
                                        type="time"
                                        defaultValue={schedule.close_time}
                                        required
                                    />
                                    <InputError message={errors.close_time} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="buffer_minutes">
                                    Buffer between bookings (minutes)
                                </Label>
                                <Input
                                    id="buffer_minutes"
                                    name="buffer_minutes"
                                    type="number"
                                    min={0}
                                    max={120}
                                    defaultValue={schedule.buffer_minutes}
                                    required
                                />
                                <InputError message={errors.buffer_minutes} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="advance_booking_days">
                                    How far in advance can customers book (days)
                                </Label>
                                <Input
                                    id="advance_booking_days"
                                    name="advance_booking_days"
                                    type="number"
                                    min={1}
                                    max={365}
                                    defaultValue={schedule.advance_booking_days}
                                    required
                                />
                                <InputError
                                    message={errors.advance_booking_days}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="min_notice_hours">
                                    Minimum notice before a booking (hours)
                                </Label>
                                <Input
                                    id="min_notice_hours"
                                    name="min_notice_hours"
                                    type="number"
                                    min={0}
                                    max={168}
                                    defaultValue={schedule.min_notice_hours}
                                    required
                                />
                                <InputError message={errors.min_notice_hours} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Input
                                    id="timezone"
                                    name="timezone"
                                    type="text"
                                    maxLength={64}
                                    defaultValue={schedule.timezone}
                                    placeholder="UTC"
                                    required
                                />
                                <InputError message={errors.timezone} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    defaultChecked={schedule.is_active}
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="font-normal"
                                >
                                    Accepting bookings
                                </Label>
                                <InputError message={errors.is_active} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    Save schedule
                                </Button>
                                <Button variant="secondary" asChild>
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

RoomScheduleEdit.layout = {
    breadcrumbs: [
        { title: 'Rooms', href: index() },
        { title: 'Schedule', href: '#' },
    ],
};
