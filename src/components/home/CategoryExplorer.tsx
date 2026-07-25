"use client";

import Link from "next/link";
import { Utensils, Tent, Map, Sparkles, Building2 } from "lucide-react";

const categories = [
    {
        icon: <Sparkles className="w-8 h-8" />,
        title: "Wellness",
        href: "/experiences?category=wellness",
        color: "bg-teal-100 text-teal-600"
    },
    {
        icon: <Building2 className="w-8 h-8" />,
        title: "City Tours",
        href: "/experiences?category=city-tours",
        color: "bg-blue-100 text-blue-600"
    },
    {
        icon: <Map className="w-8 h-8" />,
        title: "Adventures",
        href: "/experiences?category=adventures",
        color: "bg-orange-100 text-orange-600"
    },
    {
        icon: <Tent className="w-8 h-8" />,
        title: "Desert Trips",
        href: "/experiences?category=desert",
        color: "bg-[#F5EADB] text-[#FF6900]"
    },
    {
        icon: <Utensils className="w-8 h-8" />,
        title: "Food & Culture",
        href: "/experiences?category=food",
        color: "bg-red-100 text-red-600"
    }
];

export function CategoryExplorer() {
    return (
        <section className="app-section-sm bg-white">
            <div className="app-container">
                <h2 className="type-h2 text-foreground mb-8">Browse by Category</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((cat, index) => (
                        <Link key={index} href={cat.href} className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white group cursor-pointer">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                                {cat.icon}
                            </div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{cat.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
