"use client";

import { motion } from "framer-motion";

import { Instagram } from "lucide-react";
import Link from "next/link";

const galleryImages = [
    {
        src: "/images/placeholder-experience.svg",
        alt: "Marrakech Medina at sunset"
    },
    {
        src: "/images/placeholder-experience.svg",
        alt: "Desert landscape in Agafay"
    },
    {
        src: "/images/placeholder-experience.svg",
        alt: "Atlas Mountains vista"
    },
    {
        src: "/images/placeholder-experience.svg",
        alt: "Traditional Moroccan cuisine"
    },
    {
        src: "/images/placeholder-experience.svg",
        alt: "Hammam spa experience"
    },
    {
        src: "/images/placeholder-experience.svg",
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
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
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
                        className="inline-flex items-center gap-2 px-8 py-4 btn-primary rounded-full hover:scale-105"
                    >
                        <Instagram className="w-5 h-5" />
                        Follow us on Instagram
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
