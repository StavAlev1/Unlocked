import { Form, Head, Link } from '@inertiajs/react';
import RoomController from '@/actions/App/Http/Controllers/RoomController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { create, index } from '@/routes/rooms';

const textareaClassName =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

export default function RoomsCreate() {
    return (
        <>
            <Head title="New room" />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="New room"
                    description="Add a new escape room to your catalog"
                />

                <Form
                    {...RoomController.store.form()}
                    transform={(data) => {
                        const { price, ...rest } = data as typeof data & {
                            price?: string;
                        };

                        return {
                            ...rest,
                            price_cents: Math.round(
                                parseFloat(String(price ?? '0')) * 100,
                            ),
                        };
                    }}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Room name"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    placeholder="Describe the room's theme and story"
                                    className={textareaClassName}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select
                                    name="difficulty"
                                    defaultValue="moderate"
                                    required
                                >
                                    <SelectTrigger
                                        id="difficulty"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="easy">
                                            Easy
                                        </SelectItem>
                                        <SelectItem value="moderate">
                                            Moderate
                                        </SelectItem>
                                        <SelectItem value="hard">
                                            Hard
                                        </SelectItem>
                                        <SelectItem value="extreme">
                                            Extreme
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.difficulty} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="duration_minutes">
                                    Duration (minutes)
                                </Label>
                                <Input
                                    id="duration_minutes"
                                    name="duration_minutes"
                                    type="number"
                                    min={5}
                                    max={480}
                                    required
                                    placeholder="60"
                                />
                                <InputError message={errors.duration_minutes} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="min_players">
                                        Min players
                                    </Label>
                                    <Input
                                        id="min_players"
                                        name="min_players"
                                        type="number"
                                        min={1}
                                        required
                                        placeholder="2"
                                    />
                                    <InputError message={errors.min_players} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="max_players">
                                        Max players
                                    </Label>
                                    <Input
                                        id="max_players"
                                        name="max_players"
                                        type="number"
                                        min={1}
                                        required
                                        placeholder="6"
                                    />
                                    <InputError message={errors.max_players} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    required
                                    placeholder="45.00"
                                />
                                <InputError message={errors.price_cents} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                <Input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                />
                                <InputError message={errors.image} />
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_active"
                                    name="is_active"
                                    defaultChecked
                                />
                                <Label
                                    htmlFor="is_active"
                                    className="font-normal"
                                >
                                    Active
                                </Label>
                                <InputError message={errors.is_active} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>
                                    Create room
                                </Button>
                                <Button variant="secondary" asChild>
                                    <Link href={index()}>Cancel</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

RoomsCreate.layout = {
    breadcrumbs: [
        { title: 'Rooms', href: index() },
        { title: 'New room', href: create() },
    ],
};
