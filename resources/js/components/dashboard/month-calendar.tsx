import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type MonthCalendarProps = {
    /** The visible month, as "YYYY-MM". */
    month: string;
    /** Date ("YYYY-MM-DD") -> number of confirmed bookings that day. */
    countsByDate: Record<string, number>;
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
};

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function toDateKey(year: number, month: number, day: number): string {
    return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function shiftMonth(month: string, delta: number): string {
    const [year, monthNum] = month.split('-').map(Number);
    const date = new Date(year, monthNum - 1 + delta, 1);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export default function MonthCalendar({
    month,
    countsByDate,
    selectedDate,
    onSelectDate,
}: MonthCalendarProps) {
    const [year, monthNum] = month.split('-').map(Number);
    const monthIndex = monthNum - 1;
    const firstWeekday = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const monthLabel = new Date(year, monthIndex, 1).toLocaleDateString(
        'en-US',
        { month: 'long', year: 'numeric' },
    );

    // Matches dashboard.tsx's dateKey(), which groups bookings by their
    // UTC calendar day (see the comment there for why).
    const today = new Date();
    const todayKey = toDateKey(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
    );

    // The empty cells before the 1st are keyed by the weekday column they fill.
    const blankWeekdays = Array.from(
        { length: firstWeekday },
        (_, weekday) => weekday,
    );
    const days = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        dateKey: toDateKey(year, monthIndex, i + 1),
    }));

    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border rounded-xl border p-4">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">
                    {monthLabel}
                </h3>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={dashboard.url({
                                query: { month: shiftMonth(month, -1) },
                            })}
                            preserveScroll
                        >
                            <ChevronLeft />
                            <span className="sr-only">Previous month</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <Link
                            href={dashboard.url({
                                query: { month: shiftMonth(month, 1) },
                            })}
                            preserveScroll
                        >
                            <ChevronRight />
                            <span className="sr-only">Next month</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAY_LABELS.map((label) => (
                    <div
                        key={label}
                        className="text-muted-foreground py-1 text-xs font-medium"
                    >
                        {label}
                    </div>
                ))}

                {blankWeekdays.map((weekday) => (
                    <div key={`blank-${weekday}`} />
                ))}

                {days.map((cell) => {
                    const count = countsByDate[cell.dateKey] ?? 0;
                    const isToday = cell.dateKey === todayKey;
                    const isSelected = cell.dateKey === selectedDate;

                    return (
                        <button
                            key={cell.dateKey}
                            type="button"
                            onClick={() => onSelectDate(cell.dateKey)}
                            className={cn(
                                'flex aspect-square cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md text-sm transition-colors',
                                isSelected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-accent hover:text-accent-foreground',
                                isToday && !isSelected && 'text-primary',
                            )}
                        >
                            <span
                                className={cn(
                                    'font-medium',
                                    isToday && 'font-display font-bold',
                                )}
                            >
                                {cell.day}
                            </span>
                            {count > 0 && (
                                <span
                                    className={cn(
                                        'h-1 w-1 rounded-full',
                                        isSelected
                                            ? 'bg-primary-foreground'
                                            : 'bg-primary',
                                    )}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
