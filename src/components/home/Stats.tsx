"use client";

import { motion } from "framer-motion";
import { TrendingUp, Award, Users, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
    {
        icon: Users,
        value: 15000,
        suffix: "+",
        label: "Happy Travelers"
    },
    {
        icon: Award,
        value: 250,
        suffix: "+",
        label: "Curated Experiences"
    },
    {
        icon: Star,
        value: 4.9,
        suffix: "/5",
        label: "Average Rating"
    },
    {
        icon: TrendingUp,
        value: 7,
        suffix: " Years",
        label: "Of Excellence"
    }
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        const stepDuration = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [hasStarted, target]);

    return (
        <div ref={ref} className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-secondary)] mb-2">
            {target === 4.9 ? count.toFixed(1) : count.toLocaleString()}{suffix}
        </div>
    );
}

export function Stats() {
    return (
        <section className="py-20 md:py-32 gradient-warm dark:gradient-dark relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 animate-float" />
            <div className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-white/10 animate-float" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-8 max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4 tracking-tight">
                        Trusted by Thousands
                    </h2>
                    <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Join the community of travelers who discovered Marrakech with us
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 dark:bg-white/10 mb-6 group-hover:bg-white/30 dark:group-hover:bg-white/20 transition-colors duration-300">
                                <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-foreground" />
                            </div>
                            <Counter target={stat.value} suffix={stat.suffix} />
                            <p className="text-text-secondary dark:text-text-muted font-medium text-base md:text-lg">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
