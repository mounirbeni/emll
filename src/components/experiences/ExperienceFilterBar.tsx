'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExperienceFilterBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [isOpen, setIsOpen] = useState(false);

    const categories = ['All', 'Wellness', 'City Tours', 'Food & Drink', 'Desert Experiences', 'Day Trips', 'Workshops & Culture', 'Entertainment', 'Sports & Adventure', 'Transfers'];

    useEffect(() => {
        // Sync local state with URL params
        setCategory(searchParams.get('category') || 'All');
        setSearch(searchParams.get('q') || '');
    }, [searchParams]);

    const handleFilter = (newCategory?: string, newSearch?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newCategory) {
            if (newCategory === 'All') params.delete('category');
            else params.set('category', newCategory);
            setCategory(newCategory);
        }

        // For search, we might want to debounce, but for now direct update
        if (newSearch !== undefined) {
            if (!newSearch) params.delete('q');
            else params.set('q', newSearch);
            setSearch(newSearch);
        }

        router.push(`/experiences?${params.toString()}`);
    };

    return (
        <div className="sticky top-0 z-30 mb-8 w-full bg-white/80 py-4 backdrop-blur-md transition-all md:relative md:top-auto md:bg-transparent md:py-0 md:backdrop-blur-none">
            <div className="flex flex-col gap-4">
                {/* Search Bar Container */}
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center md:p-3">

                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Where do you want to go?"
                            className="block w-full rounded-xl border-none bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium text-gray-900 transition-colors placeholder:text-gray-500 focus:bg-white focus:ring-2 focus:ring-orange-500 md:text-base"
                            value={search}
                            onChange={(e) => handleFilter(undefined, e.target.value)}
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50 hover:text-orange-600 md:hidden"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </button>

                    {/* Desktop Button (Optional - could be Search button) */}
                    <div className="hidden md:block">
                        <button className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg">
                            Search
                        </button>
                    </div>
                </div>

                {/* Categories - Horizontal Scroll */}
                <div className="no-scrollbar -mx-4 flex overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
                    <div className="flex gap-2.5">
                        {
                            categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => handleFilter(cat)}
                                    className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-all ${category === cat
                                            ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                            : 'border border-gray-200 bg-white text-gray-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
