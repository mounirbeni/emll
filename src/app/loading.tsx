"use client";

import { Compass } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="h-20 w-20 mx-auto relative">
                        {/* Outer spinning ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Compass className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-charcoal font-semibold">Explore Marrakesh</p>
                    <p className="text-medium-gray text-sm">Loading your experience...</p>
                </div>
            </div>
        </div>
    );
}
