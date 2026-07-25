"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Decorative motion layer for the hero.
 *
 * Everything here is purely ornamental: it is aria-hidden, never receives
 * pointer events, and animates only `transform` / `opacity` so it stays on the
 * compositor and off the main thread. The whole layer collapses to a static
 * render when the visitor prefers reduced motion.
 */

/** Eight-point zellige star — the classic Moroccan tile motif. */
function ZelligeStar({ className, size = 48 }: { className?: string; size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M50 2 61 28 88 17 77 44 100 50 77 56 88 83 61 72 50 98 39 72 12 83 23 56 0 50 23 44 12 17 39 28Z"
                fill="currentColor"
            />
        </svg>
    );
}

/** Slowly rotating sun with radiating spokes — the Marrakech light. */
function SunDisc({ size = 460 }: { size?: number }) {
    const spokes = Array.from({ length: 24 });
    return (
        <svg width={size} height={size} viewBox="0 0 200 200" fill="none" aria-hidden="true">
            <defs>
                <radialGradient id="heroSunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFC24D" stopOpacity="0.55" />
                    <stop offset="55%" stopColor="#FF8434" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#FF6900" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="100" fill="url(#heroSunGlow)" />
            <g stroke="#FFD98A" strokeWidth="1" opacity="0.35">
                {spokes.map((_, i) => {
                    const angle = (i / spokes.length) * Math.PI * 2;
                    const inner = 52;
                    const outer = i % 2 === 0 ? 92 : 74;
                    return (
                        <line
                            key={i}
                            x1={100 + Math.cos(angle) * inner}
                            y1={100 + Math.sin(angle) * inner}
                            x2={100 + Math.cos(angle) * outer}
                            y2={100 + Math.sin(angle) * outer}
                            strokeLinecap="round"
                        />
                    );
                })}
            </g>
            <circle cx="100" cy="100" r="46" stroke="#FFD98A" strokeWidth="1" opacity="0.4" />
        </svg>
    );
}

/** Layered Moorish arch silhouettes along the bottom edge. */
function ArchSkyline({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            className={className}
            fill="none"
            aria-hidden="true"
        >
            {/* One repeated keyhole-arch profile, drawn as a single path. */}
            <path
                d="M0 160V96c40 0 46-40 86-40s46 40 86 40 46-40 86-40 46 40 86 40 46-40 86-40 46 40 86 40 46-40 86-40 46 40 86 40 46-40 86-40 46 40 86 40 46-40 86-40 46 40 86 40 46-40 86-40 46 40 86 40 46-40 86-40 46 40 86 40v64Z"
                fill="currentColor"
            />
        </svg>
    );
}

/**
 * Floating tiles. `edgeOnly` ones stay on phones — the rest are hidden there,
 * because at 390px anything nearer the middle collides with the headline.
 */
const FLOATERS = [
    { left: "6%", top: "20%", size: 30, delay: 0, depth: 26, dur: 11, edgeOnly: true },
    { left: "10%", top: "72%", size: 20, delay: 1.4, depth: 16, dur: 13, edgeOnly: true },
    { left: "86%", top: "34%", size: 36, delay: 0.7, depth: 32, dur: 12, edgeOnly: true },
    { left: "90%", top: "68%", size: 22, delay: 2.1, depth: 20, dur: 14, edgeOnly: true },
    { left: "64%", top: "14%", size: 18, delay: 1.9, depth: 12, dur: 10, edgeOnly: false },
    { left: "34%", top: "11%", size: 20, delay: 0.4, depth: 14, dur: 15, edgeOnly: false },
];

export function HeroMotionGraphics() {
    const reduce = useReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const [parallaxOn, setParallaxOn] = useState(false);

    // Parallax only for precise pointers — it would fight touch scrolling.
    useEffect(() => {
        if (reduce) return;
        const mq = window.matchMedia("(pointer: fine)");
        const apply = () => setParallaxOn(mq.matches);
        apply();
        mq.addEventListener("change", apply);
        return () => mq.removeEventListener("change", apply);
    }, [reduce]);

    useEffect(() => {
        if (!parallaxOn) return;
        let frame = 0;
        const onMove = (e: MouseEvent) => {
            // rAF-throttled so we never do layout work per mousemove.
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                const el = ref.current;
                if (!el) return;
                const r = el.getBoundingClientRect();
                setPointer({
                    x: (e.clientX - r.left) / r.width - 0.5,
                    y: (e.clientY - r.top) / r.height - 0.5,
                });
            });
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => {
            window.removeEventListener("mousemove", onMove);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [parallaxOn]);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        >
            {/* Sun, upper right */}
            <motion.div
                className="absolute -right-28 -top-32 origin-top-right scale-[0.55] sm:scale-75 md:-right-16 md:-top-24 md:scale-100"
                style={{
                    x: parallaxOn ? pointer.x * -30 : 0,
                    y: parallaxOn ? pointer.y * -20 : 0,
                }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
                <motion.div
                    animate={reduce ? undefined : { rotate: 360 }}
                    transition={{ duration: 140, ease: "linear", repeat: Infinity }}
                >
                    <SunDisc />
                </motion.div>
            </motion.div>

            {/* Drifting zellige stars */}
            {FLOATERS.map((f, i) => (
                <motion.div
                    key={i}
                    className={cn(
                        "text-saffron-200/45 absolute",
                        !f.edgeOnly && "hidden md:block"
                    )}
                    style={{
                        left: f.left,
                        top: f.top,
                        x: parallaxOn ? pointer.x * f.depth : 0,
                        y: parallaxOn ? pointer.y * f.depth : 0,
                    }}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.09, ease: "easeOut" }}
                >
                    <motion.div
                        animate={
                            reduce
                                ? undefined
                                : { y: [0, -16, 0], rotate: [0, 22, 0] }
                        }
                        transition={{
                            duration: f.dur,
                            delay: f.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <ZelligeStar size={f.size} />
                    </motion.div>
                </motion.div>
            ))}

            {/* Soft aurora blobs for depth */}
            <motion.div
                className="absolute -left-32 top-1/3 h-[26rem] w-[26rem] rounded-full bg-brand-500/25 blur-[120px]"
                animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.5, 0.75, 0.5] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -right-24 bottom-0 h-[22rem] w-[22rem] rounded-full bg-saffron-400/20 blur-[110px]"
                animate={reduce ? undefined : { scale: [1.1, 1, 1.1], opacity: [0.4, 0.65, 0.4] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            {/* Arch skyline anchoring the bottom edge */}
            <motion.div
                className="absolute inset-x-0 bottom-0"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <ArchSkyline className="text-brand-950/35 h-16 w-full md:h-24" />
            </motion.div>
        </div>
    );
}
