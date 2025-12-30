"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const WRITINGS = [
    {
        id: 1,
        title: "The Magic of the Medina",
        description: "Get lost in the winding souks and discover hidden architectural gems.",
        image: "https://images.unsplash.com/photo-1597211684694-8f6398918803?q=80&w=2574&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "A Taste of Marrakech",
        description: "From tagines to mint tea: a culinary journey through the Red City.",
        image: "https://images.unsplash.com/photo-1512413348185-ed762c2941fa?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Best Time to Visit",
        description: "Planning your trip? Here's what you need to know about the seasons.",
        image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Hidden Riads Guide",
        description: "Stay in the heart of the Medina in these stunning traditional houses.",
        image: "https://images.unsplash.com/photo-1535025075092-4299403a3d53?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Shopping in the Souks",
        description: "Master the art of haggling and find the best local treasures.",
        image: "https://images.unsplash.com/photo-1549141013-17b5f935047b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Atlas Mountains Escape",
        description: "Discover the breathtaking waterfalls and Berber villages just an hour away.",
        image: "https://images.unsplash.com/photo-1516021877484-814fe04db528?q=80&w=2574&auto=format&fit=crop"
    }
];

export function MoreAboutMarrakech() {
    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-[1400px]">
                <h2 className="text-[24px] font-bold text-black mb-8">
                    Read more about Marrakech
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {WRITINGS.map((item) => (
                        <Link key={item.id} href={`/article/${item.id}`} className="group cursor-pointer block">
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-lg font-bold text-black group-hover:underline decoration-[#FF5F00] decoration-2 underline-offset-4 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {item.description}
                            </p>
                            <span className="text-sm font-bold text-[#FF5F00] flex items-center gap-1 group-hover:gap-2 transition-all">
                                Read article <ArrowRight className="w-4 h-4" />
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
