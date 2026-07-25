"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
    "City Tours",
    "Desert Experiences",
    "Day Trips",
    "Food & Drink",
    "Wellness",
    "Sports & Adventure",
    "Workshops & Culture",
    "Entertainment",
    "Transfers",
];

export interface ExperienceFormValues {
    id?: string;
    title: string;
    category: string;
    location: string;
    duration: string;
    price: number | string;
    currency: string;
    shortDescription: string;
    fullDescription: string;
    meetingPoint: string;
    highlights: string;
    included: string;
    notIncluded: string;
    pickupAvailable: boolean;
    featured: boolean;
    enabled: boolean;
}

const EMPTY: ExperienceFormValues = {
    title: "",
    category: CATEGORIES[0],
    location: "Marrakech",
    duration: "",
    price: "",
    currency: "EUR",
    shortDescription: "",
    fullDescription: "",
    meetingPoint: "",
    highlights: "",
    included: "",
    notIncluded: "",
    pickupAvailable: false,
    featured: false,
    enabled: true,
};

/** Multi-line textareas map to the String[] columns, one entry per line. */
const toList = (value: string) =>
    value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

export function ExperienceForm({ initial }: { initial?: Partial<ExperienceFormValues> }) {
    const router = useRouter();
    const isEdit = Boolean(initial?.id);
    const [values, setValues] = useState<ExperienceFormValues>({ ...EMPTY, ...initial });
    const [saving, setSaving] = useState(false);

    const set = <K extends keyof ExperienceFormValues>(key: K, value: ExperienceFormValues[K]) =>
        setValues((v) => ({ ...v, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving) return;

        const price = Number(values.price);
        if (!values.title.trim() || !values.category || !Number.isFinite(price) || price <= 0) {
            toast.error("Title, category and a price above zero are required");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                title: values.title.trim(),
                category: values.category,
                location: values.location.trim() || "Marrakech",
                duration: values.duration.trim() || "To be confirmed",
                price,
                currency: values.currency,
                shortDescription: values.shortDescription.trim(),
                fullDescription: values.fullDescription.trim() || values.shortDescription.trim(),
                meetingPoint: values.meetingPoint.trim() || "Meeting point to be confirmed",
                highlights: toList(values.highlights),
                included: toList(values.included),
                notIncluded: toList(values.notIncluded),
                pickupAvailable: values.pickupAvailable,
                featured: values.featured,
                enabled: values.enabled,
            };

            const res = await fetch(
                isEdit ? `/api/experiences/${initial!.id}` : "/api/experiences",
                {
                    method: isEdit ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || `Request failed (${res.status})`);
            }

            toast.success(isEdit ? "Experience updated" : "Experience created");
            router.push("/admin/experiences");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="app-container py-8">
            <Link
                href="/admin/experiences"
                className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm"
            >
                <ArrowLeft className="h-4 w-4" /> Back to experiences
            </Link>

            <h1 className="type-h2 mb-8">{isEdit ? "Edit experience" : "New experience"}</h1>

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="surface-card space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={values.title}
                            onChange={(e) => set("title", e.target.value)}
                            placeholder="Sunrise Hot Air Balloon Flight"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <select
                                id="category"
                                value={values.category}
                                onChange={(e) => set("category", e.target.value)}
                                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={values.location}
                                onChange={(e) => set("location", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price *</Label>
                            <Input
                                id="price"
                                type="number"
                                min={1}
                                value={values.price}
                                onChange={(e) => set("price", e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <select
                                id="currency"
                                value={values.currency}
                                onChange={(e) => set("currency", e.target.value)}
                                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                            >
                                {["EUR", "USD", "MAD"].map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input
                                id="duration"
                                value={values.duration}
                                onChange={(e) => set("duration", e.target.value)}
                                placeholder="3 hours"
                            />
                        </div>
                    </div>
                </div>

                <div className="surface-card space-y-4 p-6">
                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Short description</Label>
                        <Textarea
                            id="shortDescription"
                            rows={2}
                            value={values.shortDescription}
                            onChange={(e) => set("shortDescription", e.target.value)}
                            placeholder="One or two sentences shown on the card."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="fullDescription">Full description</Label>
                        <Textarea
                            id="fullDescription"
                            rows={6}
                            value={values.fullDescription}
                            onChange={(e) => set("fullDescription", e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="meetingPoint">Meeting point</Label>
                        <Input
                            id="meetingPoint"
                            value={values.meetingPoint}
                            onChange={(e) => set("meetingPoint", e.target.value)}
                        />
                    </div>
                </div>

                <div className="surface-card space-y-4 p-6">
                    <p className="text-muted-foreground text-sm">One item per line.</p>
                    <div className="space-y-2">
                        <Label htmlFor="highlights">Highlights</Label>
                        <Textarea
                            id="highlights"
                            rows={4}
                            value={values.highlights}
                            onChange={(e) => set("highlights", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="included">Included</Label>
                            <Textarea
                                id="included"
                                rows={4}
                                value={values.included}
                                onChange={(e) => set("included", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notIncluded">Not included</Label>
                            <Textarea
                                id="notIncluded"
                                rows={4}
                                value={values.notIncluded}
                                onChange={(e) => set("notIncluded", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="surface-card space-y-3 p-6">
                    {([
                        ["pickupAvailable", "Hotel pickup available"],
                        ["featured", "Feature on the homepage"],
                        ["enabled", "Visible to travellers"],
                    ] as const).map(([key, label]) => (
                        <label key={key} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                            <input
                                type="checkbox"
                                checked={Boolean(values[key])}
                                onChange={(e) => set(key, e.target.checked)}
                                className="accent-primary h-4 w-4"
                            />
                            {label}
                        </label>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button type="submit" disabled={saving} className="rounded-full">
                        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isEdit ? "Save changes" : "Create experience"}
                    </Button>
                    <Button asChild type="button" variant="outline" className="rounded-full">
                        <Link href="/admin/experiences">Cancel</Link>
                    </Button>
                </div>
            </form>
        </div>
    );
}
