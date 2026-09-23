import type { BookingStatus } from '@/types/booking';

export type DashboardBooking = {
    id: number;
    starts_at: string;
    ends_at: string;
    party_size: number;
    status: BookingStatus;
    customer_name: string;
    room: {
        id: number;
        name: string;
        slug: string;
    };
    [key: string]: unknown;
};
