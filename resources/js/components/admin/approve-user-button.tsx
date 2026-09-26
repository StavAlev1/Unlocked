import { Form } from '@inertiajs/react';
import { Check } from 'lucide-react';
import UserApprovalController from '@/actions/App/Http/Controllers/Admin/UserApprovalController';
import { Button } from '@/components/ui/button';
import type { User } from '@/types';

export default function ApproveUserButton({ user }: { user: User }) {
    return (
        <Form {...UserApprovalController.store.form(user)}>
            {({ processing }) => (
                <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={processing}
                >
                    <Check />
                    Approve
                    <span className="sr-only"> {user.name}</span>
                </Button>
            )}
        </Form>
    );
}
