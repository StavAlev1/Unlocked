import { usePage } from '@inertiajs/react';
import { Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/** Tells an owner why their rooms are not on the public site yet. */
export default function PendingApprovalNotice() {
    const { auth } = usePage().props;

    if (auth.user.is_admin || auth.user.approved_at !== null) {
        return null;
    }

    return (
        <div className="px-4 pt-4">
            <Alert>
                <Clock />
                <AlertTitle>Your account is awaiting approval</AlertTitle>
                <AlertDescription>
                    You can set up your rooms and schedules now. They will
                    appear on the public site, and customers will be able to
                    book them, once an administrator approves your account.
                </AlertDescription>
            </Alert>
        </div>
    );
}
