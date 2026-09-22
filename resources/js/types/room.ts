export type RoomDifficulty = 'easy' | 'moderate' | 'hard' | 'extreme';

export type Room = {
    id: number;
    name: string;
    slug: string;
    description: string;
    difficulty: RoomDifficulty;
    duration_minutes: number;
    min_players: number;
    max_players: number;
    price_cents: number;
    image_path: string | null;
    image_url?: string | null;
    is_active: boolean;
    [key: string]: unknown;
};
