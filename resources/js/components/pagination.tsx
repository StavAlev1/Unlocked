import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginationLink } from '@/types';

/** Laravel's pagination labels contain HTML entities; show them as plain text. */
function paginationLabel(label: string): string {
    return label.replace('&laquo;', '«').replace('&raquo;', '»');
}

export default function Pagination({ links }: { links: PaginationLink[] }) {
    // Links without a url (the "..." gaps and a disabled Previous/Next) have no
    // natural id, so key them by the item they follow, which never changes.
    let previousLabel = '';

    const items = links.map((link) => {
        const key = link.url ?? `gap-after-${previousLabel}`;
        previousLabel = link.label;

        return { link, key };
    });

    return (
        <div className="flex flex-wrap items-center justify-center gap-1">
            {items.map(({ link, key }) => (
                <Button
                    key={key}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link href={link.url} preserveState>
                            {paginationLabel(link.label)}
                        </Link>
                    ) : (
                        <span>{paginationLabel(link.label)}</span>
                    )}
                </Button>
            ))}
        </div>
    );
}
