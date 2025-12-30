"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormEvent } from "react";

interface SearchBarProps {
    variant?: "hero" | "compact";
    className?: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: FormEvent) => void;
}

/**
 * SearchBar Component
 * 
 * Reusable search bar with two variants:
 * - hero: Large version for Hero section
 * - compact: Smaller version for sticky header
 * 
 * Controlled component that accepts value, onChange, and onSubmit
 */
export function SearchBar({
    variant = "hero",
    className = "",
    value,
    onChange,
    onSubmit
}: SearchBarProps) {
    const isHero = variant === "hero";

    return (
        <form
            onSubmit={onSubmit}
            className={`bg-white rounded-[30px] p-2 flex flex-col md:flex-row shadow-2xl items-center transition-all duration-300 ${isHero ? "w-full max-w-4xl mx-auto" : "w-full max-w-2xl"
                } ${className}`}
        >
            {/* Activities Search */}
            <div
                className={`flex-1 w-full md:w-auto px-6 hover:bg-gray-50 rounded-[20px] transition-colors cursor-pointer group ${isHero ? "py-2" : "py-1.5"
                    }`}
            >
                <label className={`block font-bold text-black mb-1 ${isHero ? "text-xs" : "text-[10px]"}`}>
                    Search
                </label>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Activities, Tours, Experiences..."
                    className={`w-full text-black placeholder:text-gray-400 font-medium focus:outline-none bg-white ${isHero ? "text-base" : "text-sm"
                        }`}
                />
            </div>

            {/* Search Button */}
            <div className="p-2 w-full md:w-auto flex justify-center md:block">
                <Button
                    type="submit"
                    className={`bg-[#FF5F00] hover:bg-[#E55500] text-white rounded-full p-0 flex items-center justify-center shadow-md transition-transform hover:scale-105 ${isHero ? "w-12 h-12" : "w-10 h-10"
                        }`}
                >
                    <Search className={`font-bold ${isHero ? "w-6 h-6" : "w-5 h-5"}`} />
                </Button>
            </div>
        </form>
    );
}
