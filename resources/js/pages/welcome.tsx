import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { index as publicRoomsIndex } from '@/routes/public/rooms';

const steps = [
    {
        number: '01',
        title: 'Pick a room',
        description:
            'Browse rooms by theme and difficulty, from easy first-timers to rooms that have never been beaten.',
    },
    {
        number: '02',
        title: 'Lock in a time',
        description:
            'Reserve a slot sized for your group, from solo puzzlers to a full team.',
    },
    {
        number: '03',
        title: 'Beat the clock',
        description:
            'Sixty minutes on the timer. Find the clues, crack the codes, get out.',
    },
];

const rooms = [
    {
        name: 'The Vault',
        premise:
            "A retired bank vault, a dead director's safe, and forty-eight hours before the demolition crew arrives.",
        duration: '60 min',
        difficulty: 'Moderate',
    },
    {
        name: 'Blackout Protocol',
        premise:
            'The backup generator just failed. Work by torchlight to override the lockdown before security resets it.',
        duration: '45 min',
        difficulty: 'Hard',
    },
    {
        name: "The Cartographer's Study",
        premise:
            'A map is missing three pieces, and so is the cartographer. Follow what he left behind.',
        duration: '60 min',
        difficulty: 'Easy',
    },
];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Unlocked — real-world escape rooms" />

            <div className="min-h-screen bg-[#16140F] text-[#EFE7D8] antialiased">
                <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 lg:px-10">
                    <span className="font-display flex items-center gap-2 text-lg font-semibold tracking-tight text-[#EFE7D8]">
                        <LockGlyph className="h-4 w-4 text-[#5A4FE8]" />
                        Unlocked
                    </span>

                    <nav className="flex items-center gap-3 text-sm">
                        <Link
                            href={publicRoomsIndex()}
                            className="px-3 py-2 text-[#EFE7D8] transition-colors hover:text-[#5A4FE8]"
                        >
                            Browse rooms
                        </Link>
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-sm bg-[#5A4FE8] px-4 py-2 font-medium text-[#F5F3FF] transition-colors hover:bg-[#8C82F9]"
                            >
                                Go to dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="px-3 py-2 text-[#EFE7D8] transition-colors hover:text-[#5A4FE8]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="rounded-sm bg-[#5A4FE8] px-4 py-2 font-medium text-[#F5F3FF] transition-colors hover:bg-[#8C82F9]"
                                >
                                    Create account
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main>
                    <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-10 pb-24 opacity-100 transition-opacity duration-700 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10 lg:pt-16 starting:opacity-0">
                        <div className="max-w-xl">
                            <h1 className="font-display text-4xl leading-[1.08] font-semibold tracking-tight text-[#EFE7D8] sm:text-5xl">
                                Sixty minutes. One locked room. No obvious way
                                out.
                            </h1>
                            <p className="mt-6 max-w-md text-base leading-relaxed text-[#B7AE9C]">
                                Unlocked lets you book real escape rooms for
                                your crew — pick a theme, grab a time slot, and
                                see if you can crack it before the clock runs
                                out.
                            </p>

                            {!auth.user && (
                                <div className="mt-8 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={register()}
                                        className="rounded-sm bg-[#5A4FE8] px-6 py-3 text-sm font-medium text-[#F5F3FF] transition-colors hover:bg-[#8C82F9]"
                                    >
                                        Create account
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="rounded-sm border border-[#4A4534] px-6 py-3 text-sm font-medium text-[#EFE7D8] transition-colors hover:border-[#5A4FE8] hover:text-[#5A4FE8]"
                                    >
                                        Log in
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
                            <div className="absolute inset-8 rounded-full bg-[#5A4FE8] opacity-20 blur-3xl motion-safe:animate-pulse" />
                            <DialArt className="relative h-full w-full text-[#5A4FE8]" />
                        </div>
                    </section>

                    <section className="border-t border-[#2A2519] px-6 py-20 lg:px-10">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="font-display max-w-sm text-2xl font-semibold text-[#EFE7D8]">
                                How it works
                            </h2>

                            <div className="mt-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
                                {steps.map((step) => (
                                    <div key={step.number}>
                                        <span className="font-mono-data text-sm text-[#5A4FE8]">
                                            {step.number}
                                        </span>
                                        <h3 className="font-display mt-3 text-lg font-semibold text-[#EFE7D8]">
                                            {step.title}
                                        </h3>
                                        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#B7AE9C]">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="border-t border-[#2A2519] px-6 py-20 lg:px-10">
                        <div className="mx-auto max-w-6xl">
                            <h2 className="font-display max-w-sm text-2xl font-semibold text-[#EFE7D8]">
                                A few of the rooms
                            </h2>

                            <div className="mt-10 grid gap-6 lg:grid-cols-3">
                                {rooms.map((room) => (
                                    <div
                                        key={room.name}
                                        className="border-l-2 border-[#5A4FE8] bg-[#201C15] p-6"
                                    >
                                        <h3 className="font-display text-lg font-semibold text-[#EFE7D8]">
                                            {room.name}
                                        </h3>
                                        <p className="mt-3 text-sm leading-relaxed text-[#B7AE9C]">
                                            {room.premise}
                                        </p>
                                        <dl className="font-mono-data mt-6 flex gap-4 text-xs text-[#8B8367]">
                                            <div className="flex items-center gap-1.5">
                                                <dt className="sr-only">
                                                    Duration
                                                </dt>
                                                <dd>{room.duration}</dd>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <dt className="sr-only">
                                                    Difficulty
                                                </dt>
                                                <dd>{room.difficulty}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {!auth.user && (
                        <section className="border-t border-[#2A2519] bg-[#201C15] px-6 py-20 text-center lg:px-10">
                            <h2 className="font-display mx-auto max-w-lg text-2xl font-semibold text-[#EFE7D8] sm:text-3xl">
                                Got a group of puzzle-solvers?
                            </h2>
                            <p className="mx-auto mt-4 max-w-md text-sm text-[#B7AE9C]">
                                Create a free account and find a room that's
                                right for your crew.
                            </p>
                            <Link
                                href={register()}
                                className="mt-8 inline-block rounded-sm bg-[#5A4FE8] px-6 py-3 text-sm font-medium text-[#F5F3FF] transition-colors hover:bg-[#8C82F9]"
                            >
                                Create account
                            </Link>
                        </section>
                    )}
                </main>

                <footer className="border-t border-[#2A2519] px-6 py-10 lg:px-10">
                    <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 text-sm text-[#6E6852] sm:flex-row sm:items-center">
                        <span className="font-display text-[#B7AE9C]">
                            Unlocked
                        </span>
                        <span>Real rooms. Real deadlines.</span>
                    </div>
                </footer>
            </div>
        </>
    );
}

function LockGlyph({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect
                x="5"
                y="11"
                width="14"
                height="10"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M8 11V7.5C8 5.01472 9.79086 3 12 3C14.2091 3 16 5.01472 16 7.5V11"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <circle cx="12" cy="15.5" r="1.4" fill="currentColor" />
        </svg>
    );
}

function DialArt({ className }: { className?: string }) {
    const ticks = Array.from({ length: 24 }, (_, i) => i);

    return (
        <svg
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle
                cx="160"
                cy="160"
                r="150"
                stroke="currentColor"
                strokeOpacity="0.35"
                strokeWidth="1.5"
            />
            {ticks.map((i) => {
                const angle = (i / ticks.length) * 2 * Math.PI;
                const long = i % 6 === 0;
                const outer = 150;
                const inner = long ? 132 : 140;
                const x1 = 160 + outer * Math.sin(angle);
                const y1 = 160 - outer * Math.cos(angle);
                const x2 = 160 + inner * Math.sin(angle);
                const y2 = 160 - inner * Math.cos(angle);

                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeOpacity={long ? 0.8 : 0.4}
                        strokeWidth={long ? 2 : 1}
                    />
                );
            })}
            <circle
                cx="160"
                cy="160"
                r="92"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="160" cy="160" r="4" fill="currentColor" />
            <path
                d="M160 160L160 84"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <rect
                x="140"
                y="176"
                width="40"
                height="30"
                rx="4"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M148 176V166C148 159.373 153.373 154 160 154C166.627 154 172 159.373 172 166V176"
                stroke="currentColor"
                strokeWidth="2"
            />
            <circle cx="160" cy="188" r="3" fill="currentColor" />
        </svg>
    );
}
