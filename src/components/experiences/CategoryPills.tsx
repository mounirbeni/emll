"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";

interface CategoryPillsProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
}

export function CategoryPills({ categories, selectedCategory, onSelect }: CategoryPillsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to selected item if needed
    // (Simplification: just ensure it's robust, skipping complex scroll logic for now unless requested)

    return (
        <div className="w-full bg-white border-b border-gray-100 sticky top-[72px] md:top-20 z-20">
            <div
                ref={scrollRef}
                className="flex items-center gap-2 px-4 py-3 overflow-x-auto hide-scrollbar scroll-smooth"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={cn(
                            "whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex-shrink-0",
                            selectedCategory === category
                                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
