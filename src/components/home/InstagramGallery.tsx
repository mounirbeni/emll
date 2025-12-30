"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram } from "lucide-react";
import Link from "next/link";

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop",
        alt: "Marrakech Medina at sunset"
    },
    {
        src: "https://images.unsplash.com/photo-1597211661960-e1423301dc50?q=80&w=800&auto=format&fit=crop",
        alt: "Desert landscape in Agafay"
    },
    {
        src: "https://images.unsplash.com/photo-1549141013-17b5f935047b?q=80&w=800&auto=format&fit=crop",
        alt: "Atlas Mountains vista"
    },
    {
        src: "https://images.unsplash.com/photo-1512413348185-ed762c2941fa?q=80&w=800&auto=format&fit=crop",
        alt: "Traditional Moroccan cuisine"
    },
    {
        src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
        alt: "Hammam spa experience"
    },
    {
        src: "https://images.unsplash.com/photo-1531758532450-4baeca54cde2?q=80&w=800&auto=format&fit=crop",
        alt: "Quad adventure in desert"
    }
];

export function InstagramGallery() {
    return (
        <section className="py-20 md:py-28 bg-surface">
            <div className="container mx-auto px-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Instagram className="w-8 h-8 text-primary" />
                        <h2 className="text-4xl md:text-5xl font-serif text-foreground tracking-tight">
                            #MarrakechMoments
                        </h2>
                    </div>
                    <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Share your Marrakech adventures with us and get featured
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer elevation-2 hover-glow"
                        >
                            <div
                                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url(${image.src})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Instagram className="w-10 h-10 text-gray-900" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <Link
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-primary text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 elevation-3"
                    >
                        <Instagram className="w-5 h-5" />
                        Follow us on Instagram
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
