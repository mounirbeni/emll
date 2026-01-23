"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Assuming we use standard Sheet from shadcn but styled as bottom sheet on mobile if possible, 
// or just a side sheet. For "App-like" mobile, a bottom sheet is best. 
// I will style shadcn Sheet to be bottom on mobile if using 'side="bottom"'

interface MobileFilterDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    selectedDuration: string;
    setSelectedDuration: (duration: string) => void;
    selectedFeatures: string[];
    setSelectedFeatures: (features: string[]) => void;
    totalResults: number;
}

const DURATIONS = [
    { id: "all", label: "Any Duration" },
    { id: "half-day", label: "Half Day (< 4h)" },
    { id: "full-day", label: "Full Day (> 4h)" },
];

const FEATURES = ["Best Seller", "Private Tour", "Family Friendly", "Walking Tour"];

export function MobileFilterDrawer({
    open,
    onOpenChange,
    priceRange,
    setPriceRange,
    selectedDuration,
    setSelectedDuration,
    selectedFeatures,
    setSelectedFeatures,
    totalResults
}: MobileFilterDrawerProps) {

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    return (
        <div className={cn(
            "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
        )} onClick={() => onOpenChange(false)}>
            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-6 shadow-2xl transition-transform duration-300 transform",
                    open ? "translate-y-0" : "translate-y-full"
                )}
                onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: '85vh', overflowY: 'auto' }}
            >
                {/* Handle Bar */}
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                    <button
                        onClick={() => {
                            setPriceRange([0, 600]);
                            setSelectedDuration("all");
                            setSelectedFeatures([]);
                        }}
                        className="text-primary font-semibold text-sm"
                    >
                        Reset
                    </button>
                </div>

                <div className="space-y-8 pb-24">
                    {/* Price */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <h3 className="text-lg font-bold text-gray-800">Price Range</h3>
                            <span className="text-primary font-bold">€0 - €{priceRange[1]}</span>
                        </div>
                        <Slider
                            defaultValue={[0, 600]}
                            max={600}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="py-4"
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">Duration</h3>
                        <div className="flex flex-wrap gap-2">
                            {DURATIONS.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => setSelectedDuration(d.id)}
                                    className={cn(
                                        "px-4 py-3 rounded-xl text-sm font-semibold border transition-all flex-1 text-center whitespace-nowrap",
                                        selectedDuration === d.id
                                            ? "bg-primary text-white border-primary shadow-lg shadow-orange-200"
                                            : "bg-white text-gray-600 border-gray-100"
                                    )}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-800">Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {FEATURES.map(feature => (
                                <button
                                    key={feature}
                                    onClick={() => toggleFeature(feature)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
                                        selectedFeatures.includes(feature)
                                            ? "bg-primary/10 text-primary border-primary"
                                            : "bg-gray-50 text-gray-600 border-transparent"
                                    )}
                                >
                                    {feature}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Button */}
                <div className="absolute bottom-6 left-6 right-6">
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-full shadow-xl shadow-orange-500/20 text-lg"
                        onClick={() => onOpenChange(false)}
                    >
                        Show {totalResults} Experiences
                    </Button>
                </div>
            </div>
        </div>
    );
}
