"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Brand intro.
 *
 * A short title sequence shown the first time someone lands in a session: the
 * compass mark draws itself, the name and tagline resolve, then the panel
 * splits and lifts away to reveal the hero.
 *
 * Deliberate constraints:
 *  - once per session (sessionStorage), never on repeat navigation
 *  - skippable by click, Escape, or scroll — it must never trap anyone
 *  - fully bypassed for `prefers-reduced-motion`
 *  - renders nothing on the server, so it can't delay first paint of the page
 */

const SESSION_KEY = "emll:intro-seen";
const TOTAL_MS = 3200;

export function BrandIntro() {
    const reduce = useReducedMotion();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (reduce) return;
        try {
            if (sessionStorage.getItem(SESSION_KEY)) return;
            sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
            // Private mode with storage disabled — just skip the intro.
            return;
        }
        // Must happen after mount: sessionStorage doesn't exist on the server,
        // so reading it during render would desync server and client markup.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVisible(true);
    }, [reduce]);

    const dismiss = useCallback(() => setVisible(false), []);

    // Lock scrolling only while the panel is up, and always restore.
    useEffect(() => {
        if (!visible) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const timer = window.setTimeout(dismiss, TOTAL_MS);
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" || e.key === " ") dismiss();
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("wheel", dismiss, { passive: true, once: true });
        window.addEventListener("touchmove", dismiss, { passive: true, once: true });

        return () => {
            document.body.style.overflow = previous;
            window.clearTimeout(timer);
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("wheel", dismiss);
            window.removeEventListener("touchmove", dismiss);
        };
    }, [visible, dismiss]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="layer-modal fixed inset-0 flex items-center justify-center overflow-hidden"
                    role="presentation"
                    onClick={dismiss}
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                >
                    {/* Two halves that part like a curtain on exit */}
                    <motion.div
                        className="bg-brand-950 absolute inset-x-0 top-0 h-1/2"
                        initial={{ y: 0 }}
                        exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
                    />
                    <motion.div
                        className="bg-brand-950 absolute inset-x-0 bottom-0 h-1/2"
                        initial={{ y: 0 }}
                        exit={{ y: "100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
                    />

                    {/* Warm wash so the panel isn't flat black */}
                    <div className="bg-brand-600/25 pointer-events-none absolute inset-0 blur-[100px]" />

                    <motion.div
                        className="relative flex flex-col items-center gap-6 px-6 text-center"
                        exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.4 } }}
                    >
                        {/* Compass mark: ring draws, needle settles */}
                        <motion.svg
                            width="96"
                            height="96"
                            viewBox="0 0 100 100"
                            fill="none"
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="42"
                                stroke="#FF8434"
                                strokeWidth="3"
                                strokeLinecap="round"
                                pathLength={1}
                                initial={{ pathLength: 0, rotate: -90 }}
                                animate={{ pathLength: 1, rotate: -90 }}
                                transition={{ duration: 1.1, ease: "easeInOut" }}
                                style={{ transformOrigin: "50% 50%" }}
                            />
                            <motion.path
                                d="M50 26 58 50 50 74 42 50Z"
                                fill="#FFC24D"
                                initial={{ opacity: 0, rotate: -140 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                style={{ transformOrigin: "50% 50%" }}
                            />
                        </motion.svg>

                        {/* Wordmark, letter by letter */}
                        <div className="overflow-hidden">
                            <motion.h1
                                className="type-h2 flex flex-wrap justify-center gap-x-3 text-white"
                                initial="hidden"
                                animate="shown"
                                variants={{
                                    shown: { transition: { staggerChildren: 0.05, delayChildren: 0.55 } },
                                }}
                            >
                                {"Explore Marrakech".split(" ").map((word) => (
                                    <motion.span
                                        key={word}
                                        className="inline-block"
                                        variants={{
                                            hidden: { y: "110%", opacity: 0 },
                                            shown: {
                                                y: 0,
                                                opacity: 1,
                                                transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                                            },
                                        }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.h1>
                        </div>

                        {/* Hairline that widens under the wordmark */}
                        <motion.div
                            className="via-saffron-300 h-px bg-gradient-to-r from-transparent to-transparent"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 200, opacity: 1 }}
                            transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        />

                        <motion.p
                            className="text-sm uppercase tracking-[0.3em] text-white/70"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 1.3 }}
                        >
                            Like a local
                        </motion.p>

                        <motion.button
                            type="button"
                            onClick={dismiss}
                            className="mt-4 rounded-full border border-white/25 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-white/70 transition-colors hover:border-white/50 hover:text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.8, duration: 0.5 }}
                        >
                            Skip
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
