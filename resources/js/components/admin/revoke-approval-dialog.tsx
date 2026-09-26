import { Form } from '@inertiajs/react';
import { ShieldOff } from 'lucide-react';
import UserApprovalController from '@/actions/App/Http/Controllers/Admin/UserApprovalController';
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
import type { User } from '@/types';

export default function RevokeApprovalDialog({ user }: { user: User }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <ShieldOff />
                    <span className="sr-only">
                        Revoke approval for {user.name}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Revoke approval for {user.name}?</DialogTitle>
                <DialogDescription>
                    Their rooms will disappear from the public site and can no
                    longer be booked. Bookings that already exist stay valid.
                    You can approve them again at any time.
                </DialogDescription>

                <Form {...UserApprovalController.destroy.form(user)}>
                    {({ processing }) => (
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary">Cancel</Button>
                            </DialogClose>

                            <Button
                                variant="destructive"
                                disabled={processing}
                                asChild
                            >
                                <button type="submit">Revoke approval</button>
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
