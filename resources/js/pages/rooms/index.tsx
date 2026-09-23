import { Head, Link, router } from '@inertiajs/react';
import { CalendarClock, Pencil, Plus, Ticket } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import DeleteRoomDialog from '@/components/rooms/delete-room-dialog';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { create, edit, index } from '@/routes/rooms';
import { index as bookingsIndex } from '@/routes/rooms/bookings';
import { edit as scheduleEdit } from '@/routes/rooms/schedule';
import type { Paginated, Room, RoomDifficulty } from '@/types';

type PageProps = {
    rooms: Paginated<Room>;
    filters: { search: string };
};

const difficultyVariant: Record<
    RoomDifficulty,
    'secondary' | 'default' | 'destructive'
> = {
    easy: 'secondary',
    moderate: 'default',
    hard: 'destructive',
    extreme: 'destructive',
};

const difficultyLabel: Record<RoomDifficulty, string> = {
    easy: 'Easy',
    moderate: 'Moderate',
    hard: 'Hard',
    extreme: 'Extreme',
};

function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

export default function RoomsIndex({ rooms, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search);

    function onSearch(e: FormEvent) {
        e.preventDefault();

        router.get(
            index.url(),
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    }

    const hasNoRoomsAtAll = rooms.data.length === 0 && filters.search === '';

    return (
        <>
            <Head title="Rooms" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Rooms"
                        description="Manage the escape rooms in your catalog"
                    />

                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New room
                        </Link>
                    </Button>
                </div>

                {hasNoRoomsAtAll ? (
                    <div className="border-sidebar-border/70 dark:border-sidebar-border flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-16 text-center">
                        <h3 className="text-lg font-semibold">No rooms yet</h3>
                        <p className="text-muted-foreground max-w-sm text-sm">
                            You haven't added any escape rooms to your catalog.
                            Create your first room to start accepting bookings.
                        </p>
                        <Button asChild>
                            <Link href={create()}>
                                <Plus />
                                New room
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
                                placeholder="Search by name..."
                                className="max-w-sm"
                            />
                            <Button type="submit" variant="secondary">
                                Search
                            </Button>
                        </form>

                        <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border">
                            <table className="w-full min-w-[800px] text-sm">
                                <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Difficulty
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Duration
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Players
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Price
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
                                    {rooms.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-muted-foreground px-4 py-6 text-center"
                                            >
                                                No rooms found.
                                            </td>
                                        </tr>
                                    )}

                                    {rooms.data.map((room) => (
                                        <tr
                                            key={room.id}
                                            className="border-b last:border-b-0"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                                                        {room.image_url && (
                                                            <img
                                                                src={
                                                                    room.image_url
                                                                }
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        {room.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        difficultyVariant[
                                                            room.difficulty
                                                        ]
                                                    }
                                                >
                                                    {
                                                        difficultyLabel[
                                                            room.difficulty
                                                        ]
                                                    }
                                                </Badge>
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {room.duration_minutes} min
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {room.min_players}–
                                                {room.max_players}
                                            </td>
                                            <td className="text-muted-foreground px-4 py-3">
                                                {formatPrice(room.price_cents)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        room.is_active
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {room.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={scheduleEdit(
                                                                room.id,
                                                            )}
                                                        >
                                                            <CalendarClock />
                                                            <span className="sr-only">
                                                                Manage schedule
                                                                for {room.name}
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={bookingsIndex(
                                                                room.id,
                                                            )}
                                                        >
                                                            <Ticket />
                                                            <span className="sr-only">
                                                                View bookings
                                                                for {room.name}
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={edit(room.id)}
                                                        >
                                                            <Pencil />
                                                            <span className="sr-only">
                                                                Edit {room.name}
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    <DeleteRoomDialog
                                                        room={room}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {rooms.last_page > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-1">
                                {rooms.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        disabled={!link.url}
                                        asChild={!!link.url}
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                preserveState
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        ) : (
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

RoomsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Rooms',
            href: index(),
        },
    ],
};
