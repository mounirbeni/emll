"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { RotatingText } from "@/components/shared/RotatingText";
import { Search } from "lucide-react";

export function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const rotatingWords = [
        "Marrakech Markets",
        "Historical Landmarks",
        "Traditional Restaurants",
        "Luxury Experiences",
    ];

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/blog?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/blog');
        }
    };

    return (
        <>
            {/* Mobile Hero */}
            <div className="md:hidden relative min-h-[50vh] w-full flex items-center justify-center px-4 py-6 bg-orange-50">
                <div className="relative z-10 w-full flex flex-col items-center text-center">
                    <h1 className="text-orange-500 text-3xl font-bold mb-2 leading-tight">
                        Do more with your trip
                    </h1>

                    <RotatingText
                        staticText="Discover"
                        rotatingWords={rotatingWords}
                        interval={2800}
                        className="text-base mb-5 text-charcoal"
                    />

                    <form onSubmit={handleSearch} className="w-full max-w-sm relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="What are you looking for?"
                            className="w-full px-4 py-3 pl-10 rounded-full shadow-lg border-0 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                        />
                        <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:text-primary/80 transition-colors">
                            <Search className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>

            {/* Desktop Hero - Compact */}
            <div className="hidden md:block relative h-[50vh] md:h-[60vh] min-h-[400px] md:min-h-[500px] w-full flex items-center justify-center pb-6 md:pb-10">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 bg-white" />

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
                    {/* Main Headline */}
                    <h1 className="text-primary text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-4 text-center drop-shadow-sm leading-tight">
                        Do more with your trip
                    </h1>

                    {/* Rotating Text Section - Now visible on all devices */}
                    <RotatingText
                        staticText="Discover"
                        rotatingWords={rotatingWords}
                        interval={2800}
                        className="text-base sm:text-lg md:text-xl lg:text-2xl mb-5 md:mb-6 lg:mb-8"
                    />

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full max-w-xl relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search attractions, experiences, food..."
                            className="w-full px-6 py-4 pl-14 rounded-full shadow-xl border-0 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-primary/10 outline-none text-lg transition-all hover:shadow-2xl"
                        />
                        <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition-transform duration-200">
                            <Search className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
