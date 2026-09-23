import { Form } from '@inertiajs/react';
import { Ban } from 'lucide-react';
import BookingController from '@/actions/App/Http/Controllers/BookingController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { Booking } from '@/types';

const textareaClassName =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

export default function CancelBookingDialog({
    roomId,
    booking,
}: {
    roomId: number;
    booking: Pick<Booking, 'id' | 'customer_name'>;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Ban />
                    <span className="sr-only">
                        Cancel booking for {booking.customer_name}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>
                    Cancel booking for {booking.customer_name}?
                </DialogTitle>
                <DialogDescription>
                    This will mark the booking as cancelled. This action cannot
                    be undone.
                </DialogDescription>

                <Form
                    {...BookingController.cancel.form([roomId, booking.id])}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="cancellation_reason">
                                    Reason (optional)
                                </Label>
                                <textarea
                                    id="cancellation_reason"
                                    name="cancellation_reason"
                                    placeholder="Let the team know why this booking was cancelled"
                                    className={textareaClassName}
                                />
                                <InputError
                                    message={errors.cancellation_reason}
                                />
                            </div>

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary">
                                        Keep booking
                                    </Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    disabled={processing}
                                    asChild
                                >
                                    <button type="submit">
                                        Cancel booking
                                    </button>
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
