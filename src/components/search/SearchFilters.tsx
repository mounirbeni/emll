
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

const CATEGORIES = [
    { id: "health-services", label: "Health Services" },
    { id: "city-roaming", label: "City Roaming" },
    { id: "city-trips", label: "City Trips" },
    { id: "workshops", label: "Workshops" },
    { id: "entertainment", label: "Entertainment" },
    { id: "transfers", label: "Transfers" },
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
    const [selectedDate, setSelectedDate] = useState<string>("");

    // Sync state with URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const categoriesParam = params.get("categories");
        const durationsParam = params.get("durations");
        const maxPriceParam = params.get("maxPrice");
        const minPriceParam = params.get("minPrice");
        const dateParam = params.get("date");

        setSelectedCategories(
            categoriesParam ? categoriesParam.split(",").filter(Boolean) : []
        );
        setSelectedDurations(
            durationsParam ? durationsParam.split(",").filter(Boolean) : []
        );

        const maxPrice = maxPriceParam ? Number(maxPriceParam) : 500;
        const minPrice = minPriceParam ? Number(minPriceParam) : 0;
        if (!Number.isNaN(maxPrice) && !Number.isNaN(minPrice)) {
            setPriceRange([Math.max(0, minPrice), Math.min(500, maxPrice)]);
        }

        setSelectedDate(dateParam || "");
    }, [searchParams]);

    const handleApply = () => {
        const params = new URLSearchParams();
        if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
        if (selectedDurations.length) params.set("durations", selectedDurations.join(","));
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 500) params.set("maxPrice", priceRange[1].toString());
        if (selectedDate) params.set("date", selectedDate);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="space-y-8 p-6 bg-card rounded-xl border shadow-sm sticky top-24">
            <div>
                <h3 className="font-serif text-xl mb-4">Filters</h3>
            </div>

            {/* Date */}
            <div className="space-y-3">
                <h4 className="font-medium text-sm">Date</h4>
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="h-10"
                />
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

            {/* Duration */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Duration</h4>
                <div className="space-y-2">
                    {DURATIONS.map((duration) => (
                        <div key={duration.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={duration.id}
                                checked={selectedDurations.includes(duration.id)}
                                onCheckedChange={(checked) => {
                                    if (checked) setSelectedDurations([...selectedDurations, duration.id]);
                                    else setSelectedDurations(selectedDurations.filter(d => d !== duration.id));
                                }}
                            />
                            <Label htmlFor={duration.id}>{duration.label}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <Button onClick={handleApply} className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90">Apply Filters</Button>
        </div>
    );
}
