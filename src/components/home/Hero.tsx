"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, Calendar, List, Star, ShieldCheck, MapPin, ChevronDown } from "lucide-react";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandIntro } from "@/components/home/hero/BrandIntro";

/**
 * Client-only: the looping transforms produce different markup on the server
 * than after hydration, which React flags as a mismatch. The layer is purely
 * ornamental (aria-hidden, no pointer events), so skipping SSR costs nothing
 * and keeps the server payload smaller.
 */
const HeroMotionGraphics = dynamic(
    () => import("@/components/home/hero/HeroMotionGraphics").then((m) => m.HeroMotionGraphics),
    { ssr: false }
);

const ROTATING = [
    "Like a Local",
    "Beyond the Souks",
    "Off the Beaten Path",
    "With Trusted Guides",
];

const TRUST = [
    { icon: Star, label: "4.9 average rating", smallScreen: true },
    { icon: ShieldCheck, label: "Verified local guides", smallScreen: true },
    // Wraps to a second line on phones, where it collides with the floating
    // WhatsApp button — shown from `sm` up.
    { icon: MapPin, label: "80+ curated experiences", smallScreen: false },
];

const HEADLINE = "Discover Marrakech";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
    const router = useRouter();
    const reduce = useReducedMotion();

    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [rotIndex, setRotIndex] = useState(0);

    // Advance the strapline. Held still for reduced-motion visitors.
    useEffect(() => {
        if (reduce) return;
        const id = window.setInterval(
            () => setRotIndex((i) => (i + 1) % ROTATING.length),
            3200
        );
        return () => window.clearInterval(id);
    }, [reduce]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set("q", searchQuery.trim());
        if (category) params.set("category", category);
        const qs = params.toString();
        router.push(qs ? `/experiences?${qs}` : "/experiences");
    };

    return (
        <>
            <BrandIntro />

            <section className="relative flex min-h-[640px] w-full items-center justify-center overflow-hidden [height:100svh]">
                {/* Background photograph with a slow Ken Burns push */}
                <motion.div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat will-change-transform"
                    style={{ backgroundImage: 'url("/images/homepage.jpg")' }}
                    initial={{ scale: 1.12 }}
                    animate={{ scale: reduce ? 1.12 : 1 }}
                    transition={{ duration: 18, ease: "easeOut" }}
                />

                {/* Warm brand scrim keeps the photo in the same colour family as
                    the rest of the product while holding text contrast. */}
                <div className="from-brand-950/70 via-brand-950/25 to-brand-950/80 absolute inset-0 z-10 bg-gradient-to-b" />
                <div className="bg-brand-texture absolute inset-0 z-10 opacity-[0.15]" />

                {/* Ornamental animated layer */}
                <div className="absolute inset-0 z-20">
                    <HeroMotionGraphics />
                </div>

                <div className="app-container relative z-30 flex flex-col items-center text-center">
                    <motion.span
                        className="type-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 uppercase text-white backdrop-blur-md"
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                    >
                        <span className="bg-saffron-300 h-1.5 w-1.5 rounded-full" />
                        Explore Marrakech like local
                    </motion.span>

                    {/* Headline, revealed word by word */}
                    <motion.h1
                        className="type-display mb-3 max-w-5xl text-white drop-shadow-sm"
                        initial="hidden"
                        animate="shown"
                        variants={{ shown: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
                    >
                        <span className="flex flex-wrap justify-center gap-x-[0.3em]">
                            {HEADLINE.split(" ").map((w) => (
                                <span key={w} className="overflow-hidden py-[0.06em]">
                                    <motion.span
                                        className="inline-block"
                                        variants={{
                                            hidden: { y: "110%", opacity: 0 },
                                            shown: { y: 0, opacity: 1, transition: { duration: 0.85, ease: EASE } },
                                        }}
                                    >
                                        {w}
                                    </motion.span>
                                </span>
                            ))}
                        </span>
                    </motion.h1>

                    {/* Rotating strapline */}
                    <motion.div
                        className="relative mb-7 flex h-[1.7em] items-center justify-center overflow-hidden md:mb-9"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                                key={rotIndex}
                                className="type-lead text-saffron-200 font-semibold"
                                initial={{ y: "110%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "-110%", opacity: 0 }}
                                transition={{ duration: 0.55, ease: EASE }}
                            >
                                {ROTATING[rotIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        className="w-full max-w-4xl rounded-2xl border border-white/20 bg-white/95 p-3 shadow-2xl backdrop-blur-xl md:rounded-full md:p-2"
                        initial={{ opacity: 0, y: 28, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
                    >
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col items-center gap-2 md:flex-row md:gap-0"
                        >
                            <div className="border-border relative w-full px-2 py-2 md:flex-1 md:border-r md:px-6">
                                <div className="flex items-center gap-3">
                                    <Search className="text-ink-400 h-5 w-5 shrink-0" />
                                    <div className="flex w-full flex-col items-start">
                                        <label
                                            htmlFor="hero-q"
                                            className="text-ink-500 text-[11px] font-semibold uppercase tracking-wider"
                                        >
                                            What
                                        </label>
                                        <input
                                            id="hero-q"
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Hammam, desert, cooking class…"
                                            className="text-foreground placeholder:text-ink-400 w-full bg-transparent text-sm font-medium outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-border relative w-full px-2 py-2 md:w-[27%] md:border-r md:px-6">
                                <div className="flex items-center gap-3">
                                    <List className="text-ink-400 h-5 w-5 shrink-0" />
                                    <div className="flex w-full flex-col items-start">
                                        <label
                                            htmlFor="hero-cat"
                                            className="text-ink-500 text-[11px] font-semibold uppercase tracking-wider"
                                        >
                                            Category
                                        </label>
                                        <select
                                            id="hero-cat"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="text-foreground w-full cursor-pointer appearance-none bg-transparent text-sm font-medium outline-none"
                                        >
                                            <option value="">All experiences</option>
                                            <option value="City Tours">City Tours</option>
                                            <option value="Desert Experiences">Desert Experiences</option>
                                            <option value="Food & Drink">Food &amp; Drink</option>
                                            <option value="Wellness">Wellness</option>
                                            <option value="Day Trips">Day Trips</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-full px-2 py-2 md:w-[22%] md:px-6">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-ink-400 h-5 w-5 shrink-0" />
                                    <div className="flex w-full flex-col items-start">
                                        <label
                                            htmlFor="hero-date"
                                            className="text-ink-500 text-[11px] font-semibold uppercase tracking-wider"
                                        >
                                            When
                                        </label>
                                        <input
                                            id="hero-date"
                                            type="text"
                                            placeholder="Add dates"
                                            className="text-foreground placeholder:text-ink-400 w-full cursor-pointer bg-transparent text-sm font-medium outline-none"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => {
                                                if (!e.target.value) e.target.type = "text";
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="w-full p-1 md:w-auto md:p-0 md:pl-2">
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="shadow-brand h-12 w-full rounded-xl px-8 font-bold transition-transform hover:scale-[1.03] active:scale-[0.98] md:h-14 md:rounded-full"
                                >
                                    Explore
                                </Button>
                            </div>
                        </form>
                    </motion.div>

                    {/* Trust row */}
                    <motion.ul
                        className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
                        initial="hidden"
                        animate="shown"
                        variants={{ shown: { transition: { staggerChildren: 0.12, delayChildren: 1.15 } } }}
                    >
                        {TRUST.map(({ icon: Icon, label, smallScreen }) => (
                            <motion.li
                                key={label}
                                className={cn(
                                    "items-center gap-2 text-sm font-medium text-white/85",
                                    smallScreen ? "flex" : "hidden sm:flex"
                                )}
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    shown: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                                }}
                            >
                                <Icon className="text-saffron-300 h-4 w-4" />
                                {label}
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>

                {/* Scroll cue */}
                <motion.div
                    className="absolute inset-x-0 bottom-6 z-30 flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                >
                    <motion.div
                        className="flex flex-col items-center gap-1 text-white/60"
                        animate={reduce ? undefined : { y: [0, 8, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                            Scroll
                        </span>
                        <ChevronDown className="h-4 w-4" />
                    </motion.div>
                </motion.div>
            </section>
        </>
    );
}
