export type Schedule = {
    id: number;
    open_days: number[];
    open_time: string;
    close_time: string;
    buffer_minutes: number;
    advance_booking_days: number;
    min_notice_hours: number;
    timezone: string;
    is_active: boolean;
    [key: string]: unknown;
};
