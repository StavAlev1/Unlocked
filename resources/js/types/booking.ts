export type BookingStatus = 'confirmed' | 'cancelled';

export type Booking = {
    id: number;
    starts_at: string;
    ends_at: string;
    party_size: number;
    status: BookingStatus;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    notes: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
    [key: string]: unknown;
};
