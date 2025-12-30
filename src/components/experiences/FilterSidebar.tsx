"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
    selectedDuration: string;
    setSelectedDuration: (duration: string) => void;
    selectedFeatures: string[];
    setSelectedFeatures: (features: string[]) => void;
}

const categories = ["All", "Adventures", "City Tours", "Food & Drink", "Culture", "Wellness", "Excursions", "Transport"];
const durations = [
    { id: "all", label: "All" },
    { id: "half-day", label: "Half-day (up to 4 hours)" },
    { id: "full-day", label: "Full-day (over 4 hours)" },
];
const featuresList = ["Best Seller", "Private Tour", "Family Friendly", "Walking Tour", "Small Group", "Private"];

export function FilterSidebar({
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedDuration,
    setSelectedDuration,
    selectedFeatures,
    setSelectedFeatures,
}: FilterSidebarProps) {

    const handleFeatureChange = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    const clearAll = () => {
        setSelectedCategory("All");
        setPriceRange([0, 600]);
        setSelectedDuration("all");
        setSelectedFeatures([]);
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card className="sticky top-24 h-fit border-border/50 shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer lg:cursor-default" onClick={() => setIsOpen(!isOpen)}>
                        <CardTitle className="text-lg font-bold">Filters</CardTitle>
                        <ChevronDown className={cn("h-4 w-4 lg:hidden transition-transform", isOpen && "rotate-180")} />
                    </div>
                    <Button
                        variant="link"
                        className="text-primary h-auto p-0 text-sm font-medium hover:no-underline hover:opacity-80"
                        onClick={clearAll}
                    >
                        Clear all
                    </Button>
                </div>
            </CardHeader>
            <CardContent className={cn("space-y-8", isOpen ? "block" : "hidden lg:block")}>

                {/* Categories */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Category</Label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full transition-all ${selectedCategory === category
                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                                    : "hover:border-primary/50 hover:text-primary"
                                    }`}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">Price Range</Label>
                        <span className="text-sm text-muted-foreground font-medium">
                            {priceRange[0]} € - {priceRange[1]} €
                        </span>
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

                <Separator />

                {/* Duration */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Duration</Label>
                    <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration}>
                        {durations.map((duration) => (
                            <div key={duration.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={duration.id} id={duration.id} />
                                <Label htmlFor={duration.id} className="font-normal cursor-pointer">
                                    {duration.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Features</Label>
                    <div className="space-y-2">
                        {featuresList.map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                    id={feature}
                                    checked={selectedFeatures.includes(feature)}
                                    onCheckedChange={() => handleFeatureChange(feature)}
                                />
                                <Label htmlFor={feature} className="font-normal cursor-pointer">
                                    {feature}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

            </CardContent>
        </Card>  
    );
}
