"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

/**
 * Save/unsave an experience.
 *
 * The heart icons on the experience hero and cards were previously decorative —
 * no handler at all. This wires them to /api/user/wishlist.
 */
export function WishlistButton({
    experienceId,
    className,
    variant = "outline",
}: {
    experienceId: string;
    className?: string;
    /** "outline" for the detail hero, "overlay" for a card image corner. */
    variant?: "outline" | "overlay";
}) {
    const { status } = useSession();
    const router = useRouter();
    const [saved, setSaved] = useState(false);
    const [busy, setBusy] = useState(false);

    // Reflect the stored state once we know the visitor is signed in.
    useEffect(() => {
        if (status !== "authenticated") {
            setSaved(false);
            return;
        }
        let active = true;
        fetch("/api/user/wishlist")
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (active && data?.wishlist) setSaved(data.wishlist.includes(experienceId));
            })
            .catch(() => {
                /* non-critical: leave the heart in its default state */
            });
        return () => {
            active = false;
        };
    }, [status, experienceId]);

    const toggle = async (e: React.MouseEvent) => {
        // The card is a link; saving should not navigate.
        e.preventDefault();
        e.stopPropagation();

        if (status !== "authenticated") {
            toast.info("Sign in to save experiences");
            router.push("/login");
            return;
        }
        if (busy) return;

        setBusy(true);
        const previous = saved;
        setSaved(!previous); // optimistic

        try {
            const res = await fetch("/api/user/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ experienceId }),
            });
            if (!res.ok) throw new Error("Request failed");
            const data = await res.json();
            setSaved(Boolean(data.saved));
            toast.success(data.saved ? "Saved to your wishlist" : "Removed from your wishlist");
        } catch {
            setSaved(previous); // roll back
            toast.error("Could not update your wishlist");
        } finally {
            setBusy(false);
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={busy}
            aria-pressed={saved}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            className={cn(
                "inline-flex items-center justify-center rounded-full transition-colors disabled:opacity-60",
                variant === "outline"
                    ? "border-border hover:border-brand-300 hover:bg-brand-50 h-11 w-11 border bg-white"
                    : "h-9 w-9 bg-white/95 shadow-sm backdrop-blur-sm hover:bg-white",
                className
            )}
        >
            <Heart
                className={cn(
                    "h-5 w-5 transition-colors",
                    saved ? "fill-red-500 text-red-500" : "text-ink-500"
                )}
            />
        </button>
    );
}
