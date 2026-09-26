import type { RoomDifficulty } from './room';

/** A room as shown to anyone, without owner or internal fields. */
export type PublicRoom = {
    uuid: string;
    name: string;
    description: string;
    difficulty: RoomDifficulty;
    duration_minutes: number;
    min_players: number;
    max_players: number;
    price_cents: number;
    image_url: string | null;
};

/** A bookable start time, always in UTC (see the js rules for date formatting). */
export type BookableSlot = {
    starts_at: string;
    ends_at: string;
    available: boolean;
};

export type PublicBooking = {
    uuid: string;
    starts_at: string;
    ends_at: string;
    party_size: number;
    status: 'confirmed' | 'cancelled';
    customer_name: string;
    room: {
        uuid: string;
        name: string;
        image_url: string | null;
        is_bookable: boolean;
    };
};
