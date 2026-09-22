import { Form, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/Admin/UserController';
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

export default function DeleteUserDialog({ user }: { user: User }) {
    const { auth } = usePage().props;
    const isCurrentUser = auth.user.id === user.id;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isCurrentUser}
                    title={
                        isCurrentUser
                            ? "You can't delete your own account here"
                            : undefined
                    }
                >
                    <Trash2 />
                    <span className="sr-only">Delete {user.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete {user.name}?</DialogTitle>
                <DialogDescription>
                    This will permanently delete this user's account. This
                    action cannot be undone.
                </DialogDescription>

                <Form {...UserController.destroy.form(user)}>
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
                                <button type="submit">Delete user</button>
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
