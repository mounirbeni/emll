"use client"

import { useState } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MobileButton } from "./MobileButton"
import Link from "next/link"

interface MobileSearchOverlayProps {
    isOpen: boolean
    onClose: () => void
    onSearch?: (query: string) => void
}

/**
 * Fullscreen search overlay for mobile
 * Features:
 * - Animated slide-up entrance
 * - Large search input
 * - Recent searches
 * - Popular destinations
 * - Instant results preview
 */
export function MobileSearchOverlay({
    isOpen,
    onClose,
    onSearch
}: MobileSearchOverlayProps) {
    const [query, setQuery] = useState("")

    const recentSearches = [
        "Desert Safari",
        "Cooking Class",
        "Hot Air Balloon"
    ]

    const popularDestinations = [
        { name: "Medina Tour", icon: "🏛️" },
        { name: "Atlas Mountains", icon: "⛰️" },
        { name: "Agafay Desert", icon: "🏜️" },
        { name: "Jardin Majorelle", icon: "🌴" }
    ]

    const handleSearch = () => {
        if (query.trim() && onSearch) {
            onSearch(query)
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                        type: "spring",
                        damping: 30,
                        stiffness: 300
                    }}
                    className="md:hidden fixed inset-0 z-50 bg-white safe-top safe-bottom flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
                        <button
                            onClick={onClose}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-lg font-semibold text-charcoal">
                            Search Experiences
                        </h2>
                    </div>

                    {/* Search Input */}
                    <div className="px-4 py-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="What do you want to explore?"
                                className="w-full h-[44px] pl-11 pr-4 rounded-[12px] border-2 border-gray-200 focus:border-primary focus:outline-none text-sm transition-colors"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        {!query ? (
                            <>
                                {/* Recent Searches */}
                                {recentSearches.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            <h3 className="text-sm font-semibold text-gray-600">
                                                Recent Searches
                                            </h3>
                                        </div>
                                        <div className="space-y-2">
                                            {recentSearches.map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setQuery(search)}
                                                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    <p className="text-charcoal">{search}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Popular Destinations */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-gray-400" />
                                        <h3 className="text-sm font-semibold text-gray-600">
                                            Popular Destinations
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {popularDestinations.map((dest, index) => (
                                            <Link
                                                key={index}
                                                href={`/services?search=${encodeURIComponent(dest.name)}`}
                                                onClick={onClose}
                                                className="bg-white border border-gray-200 rounded-2xl p-4 hover:border-primary hover:shadow-md transition-all active:scale-95"
                                            >
                                                <div className="text-3xl mb-2">{dest.icon}</div>
                                                <p className="text-sm font-semibold text-charcoal">
                                                    {dest.name}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Search Results Preview */
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500 mb-3">
                                    Searching for &quot;{query}&quot;...
                                </p>
                                {/* Add instant search results here */}
                            </div>
                        )}
                    </div>

                    {/* Bottom Action */}
                    {query && (
                        <div className="p-4 border-t border-gray-100 safe-bottom">
                            <MobileButton
                                variant="primary"
                                fullWidth
                                onClick={handleSearch}
                            >
                                Search
                            </MobileButton>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}
