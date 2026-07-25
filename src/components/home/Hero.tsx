"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, List } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/experiences?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/experiences');
        }
    };

    return (
        <div className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("/images/homepage.jpg")',
                    backgroundPosition: 'center',
                }}
            >
                {/* Warm brand-tinted scrim keeps the hero in the same colour family
                    as the rest of the product while holding text contrast. */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand-950/55 via-brand-950/35 to-brand-950/60" />
            </div>

            {/* Content */}
            <div className="app-container relative z-10 flex flex-col items-center text-center">
                <span className="type-eyebrow mb-5 inline-flex rounded-full bg-white/15 px-4 py-1.5 uppercase text-white backdrop-blur-sm">
                    Explore Marrakech like local
                </span>

                <h1 className="type-display mb-4 max-w-4xl text-white drop-shadow-sm md:mb-6">
                    Discover Marrakech Like a Local
                </h1>

                <p className="type-lead mb-8 max-w-2xl font-medium text-white/90 md:mb-12">
                    Uncover authentic experiences, verified guides, and hidden gems in the Red City.
                </p>

                {/* Search Bar Container */}
                <div className="w-full max-w-4xl bg-white rounded-2xl md:rounded-full p-4 md:p-2 shadow-xl">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2 md:gap-0">

                        {/* Keyword Input */}
                        <div className="relative w-full md:flex-1 md:border-r border-gray-100 px-2 md:px-6 py-2">
                            <div className="flex items-center gap-3">
                                <Search className="w-5 h-5 text-gray-400" />
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">What</label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Keywords..."
                                        className="w-full text-gray-900 font-medium placeholder:text-gray-400 outline-none text-sm bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category (Mock) */}
                        <div className="relative w-full md:w-[25%] md:border-r border-gray-100 px-2 md:px-6 py-2">
                            <div className="flex items-center gap-3">
                                <List className="w-5 h-5 text-gray-400" />
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Category</label>
                                    <select className="w-full text-gray-900 font-medium bg-transparent outline-none text-sm appearance-none cursor-pointer">
                                        <option value="">All</option>
                                        <option value="tours">City Tours</option>
                                        <option value="desert">Desert Trips</option>
                                        <option value="food">Food & Drink</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Date (Mock) */}
                        <div className="relative w-full md:w-[25%] px-2 md:px-6 py-2">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div className="flex flex-col items-start w-full">
                                    <label className="text-xs text-gray-500 font-semibold uppercase tracking-wider">When</label>
                                    <input
                                        type="text"
                                        placeholder="Add dates"
                                        className="w-full text-gray-900 font-medium placeholder:text-gray-400 outline-none text-sm bg-transparent cursor-pointer"
                                        onFocus={(e) => e.target.type = 'date'}
                                        onBlur={(e) => e.target.type = 'text'}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="w-full md:w-auto p-2">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full md:w-auto rounded-xl md:rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12 md:h-14 px-8 shadow-brand"
                            >
                                Explore
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
