import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import ApproveUserButton from '@/components/admin/approve-user-button';
import DeleteUserDialog from '@/components/admin/delete-user-dialog';
import RevokeApprovalDialog from '@/components/admin/revoke-approval-dialog';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { create, edit, index } from '@/routes/admin/users';
import type { Paginated, User } from '@/types';

type PageProps = {
    users: Paginated<User>;
    pendingCount: number;
    filters: { search: string };
};

export default function UsersIndex({
    users,
    pendingCount,
    filters,
}: PageProps) {
    const [search, setSearch] = useState(filters.search);

    function onSearch(e: FormEvent) {
        e.preventDefault();

        router.get(
            index.url(),
            { search: search || undefined },
            { preserveState: true, replace: true },
        );
    }

    return (
        <>
            <Head title="Users" />

            <div className="space-y-6 p-4">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Users"
                        description="Manage the accounts that can access this application"
                    />

                    <Button asChild>
                        <Link href={create()}>
                            <Plus />
                            New user
                        </Link>
                    </Button>
                </div>

                {pendingCount > 0 && (
                    <p className="bg-muted rounded-md px-3 py-2 text-sm">
                        {pendingCount === 1
                            ? '1 owner is awaiting approval.'
                            : `${pendingCount} owners are awaiting approval.`}{' '}
                        Their rooms stay off the public site until you approve
                        them.
                    </p>
                )}

                <form onSubmit={onSearch} className="flex items-center gap-2">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="max-w-sm"
                    />
                    <Button type="submit" variant="secondary">
                        Search
                    </Button>
                </form>

                <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border">
                    <table className="w-full min-w-[640px] text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="text-muted-foreground px-4 py-6 text-center"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}

                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b last:border-b-0"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {user.name}
                                    </td>
                                    <td className="text-muted-foreground px-4 py-3">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                user.is_admin
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {user.is_admin ? 'Admin' : 'User'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        {user.is_admin ||
                                        user.approved_at !== null ? (
                                            <Badge variant="secondary">
                                                Approved
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive">
                                                Pending
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            {!user.is_admin &&
                                                (user.approved_at === null ? (
                                                    <ApproveUserButton
                                                        user={user}
                                                    />
                                                ) : (
                                                    <RevokeApprovalDialog
                                                        user={user}
                                                    />
                                                ))}

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                            >
                                                <Link href={edit(user)}>
                                                    <Pencil />
                                                    <span className="sr-only">
                                                        Edit {user.name}
                                                    </span>
                                                </Link>
                                            </Button>

                                            <DeleteUserDialog user={user} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.last_page > 1 && <Pagination links={users.links} />}
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Users',
            href: index(),
        },
    ],
};
