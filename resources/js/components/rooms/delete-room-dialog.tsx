import { Form } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import RoomController from '@/actions/App/Http/Controllers/RoomController';
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
import type { Room } from '@/types';

export default function DeleteRoomDialog({ room }: { room: Room }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 />
                    <span className="sr-only">Delete {room.name}</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete {room.name}?</DialogTitle>
                <DialogDescription>
                    This will permanently delete this room. This action cannot
                    be undone.
                </DialogDescription>

                <Form {...RoomController.destroy.form(room.id)}>
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
                                <button type="submit">Delete room</button>
                            </Button>
                        </DialogFooter>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
