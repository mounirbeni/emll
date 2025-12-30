
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const CATEGORIES = [
    { id: "desert", label: "Desert Tours" },
    { id: "medina", label: "Medina & Souks" },
    { id: "atlas", label: "Atlas Mountains" },
    { id: "food", label: "Food & Drink" },
    { id: "hammam", label: "Hammam & Spa" },
];

const DURATIONS = [
    { id: "half-day", label: "Half Day (up to 4h)" },
    { id: "full-day", label: "Full Day" },
    { id: "multi-day", label: "Multi-Day" },
];

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

    // Sync state with URL params on mount
    useEffect(() => {
        // Basic sync logic if needed
    }, []);

    const handleApply = () => {
        const params = new URLSearchParams();
        if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
        if (selectedDurations.length) params.set("durations", selectedDurations.join(","));
        if (priceRange[1] < 500) params.set("maxPrice", priceRange[1].toString());

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="space-y-8 p-6 bg-card rounded-xl border shadow-sm sticky top-24">
            <div>
                <h3 className="font-serif text-xl mb-4">Filters</h3>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Price Range (€)</h4>
                <Slider
                    defaultValue={[0, 500]}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="py-4"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0€</span>
                    <span>{priceRange[1]}€+</span>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Category</h4>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={cat.id}
                                checked={selectedCategories.includes(cat.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) setSelectedCategories([...selectedCategories, cat.id]);
                                    else setSelectedCategories(selectedCategories.filter(c => c !== cat.id));
                                }}
                            />
                            <Label htmlFor={cat.id}>{cat.label}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={handleApply} className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">Apply Filters</Button>
        </div>
    );
}
