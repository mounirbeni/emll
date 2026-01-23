"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, Clock, Euro, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    selectedDuration: string;
    setSelectedDuration: (duration: string) => void;
    selectedFeatures: string[];
    setSelectedFeatures: (features: string[]) => void;
}

const DURATIONS = [
    { id: "all", label: "Any Duration" },
    { id: "half-day", label: "Half Day (< 4h)" },
    { id: "full-day", label: "Full Day (> 4h)" },
];

const FEATURES = ["Best Seller", "Private Tour", "Family Friendly", "Walking Tour", "Small Group"];

export function FilterBar({
    priceRange,
    setPriceRange,
    selectedDuration,
    setSelectedDuration,
    selectedFeatures,
    setSelectedFeatures,
}: FilterBarProps) {
    const activeFiltersCount =
        (priceRange[1] < 600 ? 1 : 0) +
        (selectedDuration !== "all" ? 1 : 0) +
        selectedFeatures.length;

    const clearAll = () => {
        setPriceRange([0, 600]);
        setSelectedDuration("all");
        setSelectedFeatures([]);
    };

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    return (
        <div className="w-full flex items-center justify-between py-4 border-b border-gray-100 bg-white sticky top-0 z-30 hidden lg:flex">
            <div className="flex items-center gap-3">
                {/* Price Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "rounded-full border-gray-200 hover:border-primary hover:text-primary transition-colors",
                                priceRange[1] < 600 && "bg-primary/5 border-primary text-primary"
                            )}
                        >
                            <Euro className="w-4 h-4 mr-2" />
                            Price
                            {priceRange[1] < 600 && <span className="ml-1 font-bold">€{priceRange[1]}</span>}
                            <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-5 rounded-xl shadow-xl shadow-gray-200/50 border-gray-100" align="start">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-gray-800">Price Range</h4>
                                <span className="text-sm font-medium text-primary">Up to €{priceRange[1]}</span>
                            </div>
                            <Slider
                                defaultValue={[0, 600]}
                                max={600}
                                step={10}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="py-2"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>€0</span>
                                <span>€600+</span>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Duration Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "rounded-full border-gray-200 hover:border-primary hover:text-primary transition-colors",
                                selectedDuration !== "all" && "bg-primary/5 border-primary text-primary"
                            )}
                        >
                            <Clock className="w-4 h-4 mr-2" />
                            Duration
                            {selectedDuration !== "all" && <span className="ml-1 font-bold">({selectedDuration === 'half-day' ? 'Half' : 'Full'})</span>}
                            <ChevronDown className="w-3 h-3 ml-2 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-[200px] p-2 rounded-xl shadow-xl shadow-gray-200/50 border-gray-100" align="start">
                        <div className="flex flex-col gap-1">
                            {DURATIONS.map((d) => (
                                <button
                                    key={d.id}
                                    onClick={() => setSelectedDuration(d.id)}
                                    className={cn(
                                        "px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center justify-between",
                                        selectedDuration === d.id
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {d.label}
                                    {selectedDuration === d.id && <Check className="w-3 h-3" />}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Features Filter (Pills) */}
                <div className="h-6 w-px bg-gray-200 mx-2" />

                <div className="flex items-center gap-2">
                    {FEATURES.map(feature => (
                        <button
                            key={feature}
                            onClick={() => toggleFeature(feature)}
                            className={cn(
                                "text-sm px-3 py-1.5 rounded-full border transition-all duration-200",
                                selectedFeatures.includes(feature)
                                    ? "bg-primary text-white border-primary shadow-sm shadow-orange-200"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                            )}
                        >
                            {feature}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clear All */}
            {activeFiltersCount > 0 && (
                <Button
                    variant="ghost"
                    onClick={clearAll}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full px-3"
                >
                    <X className="w-4 h-4 mr-1.5" />
                    Reset
                </Button>
            )}
        </div>
    );
}
