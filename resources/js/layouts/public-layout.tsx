import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { dashboard, home, login } from '@/routes';
import { index as roomsIndex } from '@/routes/public/rooms';

export default function PublicLayout({ children }: { children: ReactNode }) {
    const { name, auth } = usePage().props;

    return (
        <div className="bg-background text-foreground flex min-h-svh flex-col">
            <header className="border-border border-b">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 font-medium"
                    >
                        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                            <AppLogoIcon className="size-5 fill-current" />
                        </div>
                        <span className="font-display text-lg font-semibold tracking-tight">
                            {name}
                        </span>
                    </Link>

                    <nav className="flex items-center gap-1 text-sm">
                        <Button variant="ghost" asChild>
                            <Link href={roomsIndex()}>Rooms</Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            {auth.user ? (
                                <Link href={dashboard()}>Dashboard</Link>
                            ) : (
                                <Link href={login()}>Log in</Link>
                            )}
                        </Button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
                {children}
            </main>

            <footer className="border-border text-muted-foreground border-t">
                <div className="mx-auto max-w-5xl px-4 py-6 text-sm">
                    Real rooms. Real deadlines.
                </div>
            </footer>
        </div>
    );
}
