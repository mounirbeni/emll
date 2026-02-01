"use client";

import { ShieldCheck, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: ShieldCheck,
        title: "Trusted Local Guides",
        description: "Every guide is vetted and verified to ensure you have a safe and authentic experience.",
    },
    {
        icon: Heart,
        title: "Curated Experiences",
        description: "We handpick every activity to guarantee quality, uniqueness, and unforgettable memories.",
    },
    {
        icon: Award,
        title: "Best Price Guarantee",
        description: "Find a better price elsewhere? We'll match it. No hidden fees, just great value.",
    },
];

export function WhyBookWithUs() {
    return (
        <section className="py-20 md:py-28 bg-surface">
            <div className="container mx-auto px-8 max-w-7xl">
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif tracking-tight"
                    >
                        Why Book With Us?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        We go the extra mile to make your Marrakech adventure seamless and special.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="flex flex-col items-center text-center group p-8 rounded-2xl bg-card border border-border elevation-2 hover-glow"
                        >
                            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full gradient-primary flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 animate-float">
                                <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-white" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 font-serif">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
