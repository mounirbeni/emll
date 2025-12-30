"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Sarah Johnson",
        country: "United States",
        rating: 5,
        text: "Our desert sunset tour was absolutely magical! Our guide was knowledgeable and made sure every moment was perfect. Highly recommend!"
    },
    {
        name: "Pierre Dubois",
        country: "France",
        rating: 5,
        text: "The food tour in the Medina was incredible. We discovered places we would have never found on our own. Professional and authentic!"
    },
    {
        name: "Emma Wilson",
        country: "United Kingdom",
        rating: 5,
        text: "Best hot air balloon experience ever! The sunrise over the Atlas Mountains was breathtaking. Worth every dirham!"
    },
    {
        name: "Marco Rossi",
        country: "Italy",
        rating: 5,
        text: "The cooking class was fantastic! We learned so much and the food was delicious. Our host was warm and welcoming."
    },
    {
        name: "Lisa Chen",
        country: "Canada",
        rating: 5,
        text: "Amazing service from start to finish. Easy booking through WhatsApp and our guide was punctual and friendly. Will book again!"
    },
    {
        name: "Ahmed Al-Rashid",
        country: "UAE",
        rating: 5,
        text: "The Atlas Mountains day trip exceeded our expectations. Beautiful scenery, great guide, and a perfect family experience."
    }
];

export function Testimonials() {
    return (
        <section className="py-20 md:py-28 bg-background">
            <div className="container mx-auto px-8 max-w-7xl">

                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-serif tracking-tight"
                    >
                        What Our Guests Say
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                    >
                        Real reviews from travelers who experienced Marrakech with us
                    </motion.p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <Card className="border-border hover:border-primary/50 transition-all hover-glow h-full bg-card">
                                <CardContent className="p-6 flex flex-col h-full">
                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                        ))}
                                    </div>

                                    {/* Review Text */}
                                    <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                                        &quot;{testimonial.text}&quot;
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-3 border-t border-border pt-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-primary font-semibold">{testimonial.name[0]}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.country}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-6 py-3 elevation-2">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="font-semibold">4.9/5.0</span>
                        <span className="text-muted-foreground">from 500+ reviews</span>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
