"use client";

import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSuccess(true);
        setEmail("");

        setTimeout(() => setIsSuccess(false), 3000);
    };

    return (
        <section className="py-20 md:py-32 gradient-secondary dark:gradient-dark relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-white/5 animate-float" />
            <div className="absolute bottom-1/4 left-10 w-32 h-32 rounded-full bg-white/5 animate-float" style={{ animationDelay: '1s' }} />

            <div className="container mx-auto px-8 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-6">
                        <Mail className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-tight">
                        Get Travel Inspiration
                    </h2>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Subscribe to our newsletter for exclusive deals, insider tips, and curated Marrakech experiences delivered to your inbox
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <div className="flex-1 relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full h-14 px-6 rounded-full bg-white dark:bg-surface-elevated text-foreground placeholder:text-muted-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary border border-transparent dark:border-border"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting || isSuccess}
                                className="h-14 px-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed elevation-3"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Subscribing...
                                    </span>
                                ) : isSuccess ? (
                                    <span className="flex items-center gap-2">
                                        ✓ Subscribed!
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Subscribe
                                    </span>
                                )}
                            </Button>
                        </div>
                        <p className="text-white/60 text-sm">
                            Join 10,000+ travelers. Unsubscribe anytime.
                        </p>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
