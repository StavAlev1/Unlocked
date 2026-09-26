import type { RoomDifficulty } from '@/types';

export const difficultyLabel: Record<RoomDifficulty, string> = {
    easy: 'Easy',
    moderate: 'Moderate',
    hard: 'Hard',
    extreme: 'Extreme',
};

export const difficultyVariant: Record<
    RoomDifficulty,
    'secondary' | 'default' | 'destructive'
> = {
    easy: 'secondary',
    moderate: 'default',
    hard: 'destructive',
    extreme: 'destructive',
};

export function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(2)}`;
}

/** Turns Laravel's pagination labels (which contain HTML entities) into plain text. */
export function paginationLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}
