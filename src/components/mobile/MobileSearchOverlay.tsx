"use client";

import { useState, FormEvent } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * MobileSearchOverlay Component
 * 
 * Full-screen search overlay for mobile devices
 * - Large touch-friendly input (48px height)
 * - Smooth slide-up animation
 * - Shared search logic with desktop
 * - Backdrop blur effect
 */
export function MobileSearchOverlay({ isOpen, onClose }: MobileSearchOverlayProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            onClose();
            setSearchQuery("");
        } else {
            router.push('/search');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-100"
                onClick={onClose}
            />

            {/* Search Content */}
            <div className="absolute inset-x-0 top-0 bg-white rounded-b-3xl shadow-2xl p-6 animate-in slide-in-from-top duration-300">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-black">Search Experiences</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-10 w-10 rounded-full hover:bg-gray-100"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Activities, Tours, Experiences..."
                            autoFocus
                            className="w-full h-14 pl-12 pr-4 text-base font-medium text-black placeholder:text-gray-400 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#FF5F00] focus:bg-white transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 bg-[#FF5F00] hover:bg-[#E55500] text-white text-base font-bold rounded-2xl shadow-lg"
                    >
                        Search
                    </Button>
                </form>

                {/* Quick Links (Optional) */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-500 mb-3">Popular Searches</p>
                    <div className="flex flex-wrap gap-2">
                        {["Desert Tours", "Hammam", "Food Tours", "Hot Air Balloon"].map((term) => (
                            <button
                                key={term}
                                onClick={() => {
                                    setSearchQuery(term);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
