"use client";

import { motion } from "framer-motion";
import { Search, Calendar, Sparkles, MessageCircle } from "lucide-react";

const steps = [
    {
        icon: Search,
        number: "01",
        title: "Browse & Discover",
        description: "Explore our curated collection of authentic Marrakech experiences, from desert adventures to cultural immersions."
    },
    {
        icon: Calendar,
        number: "02",
        title: "Book Instantly",
        description: "Reserve your spot with instant confirmation via WhatsApp or our secure online booking system."
    },
    {
        icon: Sparkles,
        number: "03",
        title: "Experience Magic",
        description: "Meet your expert local guide and immerse yourself in the wonders of Marrakech with unforgettable moments."
    },
    {
        icon: MessageCircle,
        number: "04",
        title: "Share & Review",
        description: "Tell us about your adventure! Your feedback helps us maintain excellence and helps others discover magic."
    }
];

export function HowItWorks() {
    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4 tracking-tight">
                        How It Works
                    </h2>
                    <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Your journey from discovery to unforgettable memories in four simple steps
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connection Line */}
                    <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" style={{ top: '80px' }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative"
                            >
                                <div className="flex flex-col items-center text-center group">
                                    {/* Icon Circle */}
                                    <div className="relative mb-6">
                                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-primary flex items-center justify-center elevation-3 group-hover:elevation-4 transition-all duration-300 group-hover:scale-110 relative z-10">
                                            <step.icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                                        </div>
                                        {/* Step Number */}
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-secondary flex items-center justify-center elevation-2 z-20">
                                            <span className="text-white font-bold text-sm">{step.number}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3 tracking-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-text-secondary leading-relaxed text-base">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
