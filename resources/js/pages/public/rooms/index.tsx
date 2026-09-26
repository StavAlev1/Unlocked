import { Head, Link } from '@inertiajs/react';
import { Clock, Users } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { difficultyLabel, difficultyVariant, formatPrice } from '@/lib/rooms';
import { show } from '@/routes/public/rooms';
import type { Paginated, PublicRoom } from '@/types';

type PageProps = {
    rooms: Paginated<PublicRoom>;
};

export default function PublicRoomsIndex({ rooms }: PageProps) {
    return (
        <>
            <Head title="Escape rooms" />

            <Heading
                title="Escape rooms"
                description="Pick a room, choose a time, and lock in your crew."
            />

            {rooms.data.length === 0 ? (
                <div className="border-border text-muted-foreground rounded-xl border border-dashed px-4 py-16 text-center text-sm">
                    No rooms are open for booking right now. Check back soon.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rooms.data.map((room) => (
                        <Link
                            key={room.uuid}
                            href={show(room.uuid)}
                            className="group border-border bg-card focus-visible:ring-ring flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
                        >
                            <div className="bg-muted flex aspect-[16/10] items-center justify-center overflow-hidden">
                                {room.image_url ? (
                                    <img
                                        src={room.image_url}
                                        alt=""
                                        className="size-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <AppLogoIcon className="text-muted-foreground size-10 fill-current" />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col gap-3 p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="font-display text-lg leading-tight font-semibold">
                                        {room.name}
                                    </h3>
                                    <Badge
                                        variant={
                                            difficultyVariant[room.difficulty]
                                        }
                                    >
                                        {difficultyLabel[room.difficulty]}
                                    </Badge>
                                </div>

                                <p className="text-muted-foreground line-clamp-2 text-sm">
                                    {room.description}
                                </p>

                                <div className="text-muted-foreground mt-auto flex items-center gap-4 pt-2 text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="size-4" />
                                        {room.duration_minutes} min
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Users className="size-4" />
                                        {room.min_players}–{room.max_players}
                                    </span>
                                    <span className="text-foreground font-mono-data ml-auto">
                                        {formatPrice(room.price_cents)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {rooms.last_page > 1 && (
                <div className="mt-8">
                    <Pagination links={rooms.links} />
                </div>
            )}
        </>
    );
}
