"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Newsletter signup backed by /api/newsletter.
 *
 * Extracted so every placement uses the same working submit path — the blog
 * sidebar previously rendered a "mock" form whose Subscribe button did nothing.
 */
export function NewsletterForm({
    className,
    layout = "stacked",
    buttonLabel = "Subscribe",
}: {
    className?: string;
    layout?: "stacked" | "inline";
    buttonLabel?: string;
}) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || "Failed to subscribe");

            toast.success("Thank you for subscribing!");
            setEmail("");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to subscribe");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn(
                "gap-2",
                layout === "inline" ? "flex flex-col sm:flex-row" : "flex flex-col",
                className
            )}
        >
            <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="h-10 text-sm"
                required
            />
            <Button
                type="submit"
                disabled={isSubmitting}
                className={cn("h-10 shrink-0", layout === "stacked" && "w-full font-bold")}
            >
                {isSubmitting ? "Subscribing..." : buttonLabel}
            </Button>
        </form>
    );
}
