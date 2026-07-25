'use client';

import { useState, useEffect, Suspense } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function ExperienceFilterBar() {
    return (
        <Suspense fallback={<div className="h-20 w-full animate-pulse bg-gray-100 rounded-xl" />}>
            <FilterBarContent />
        </Suspense>
    );
}

function FilterBarContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Filter States
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All');
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
    const [sort, setSort] = useState(searchParams.get('sort') || 'recommended');

    // Mobile Sheet State
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const categories = ['All', 'Wellness', 'City Tours', 'Food & Drink', 'Desert', 'Adventure', 'Workshops', 'Transfers'];
    const durations = ['< 2 hours', 'Half Day (4h)', 'Full Day (8h+)', 'Multi-day'];

    useEffect(() => {
        // Sync local state with URL params on mount/update to handle navigation/back-button
        const qParam = searchParams.get('q') || '';
        const catParam = searchParams.get('category') || 'All';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const durParam = searchParams.get('duration');
        const sortParam = searchParams.get('sort') || 'recommended';

        // Only update if value matches the "drifting" (out of sync) state
        setSearch(prev => prev !== qParam ? qParam : prev);
        setCategory(prev => prev !== catParam ? catParam : prev);

        if (minPrice && maxPrice) {
            const newRange = [Number(minPrice), Number(maxPrice)];
            // JSON.stringify is a cheap way to compare simple number arrays of length 2
            setPriceRange(prev => (prev[0] !== newRange[0] || prev[1] !== newRange[1]) ? newRange : prev);
        } else {
            setPriceRange(prev => (prev[0] !== 0 || prev[1] !== 500) ? [0, 500] : prev);
        }

        if (durParam) {
            const newDurs = durParam.split(',');
            setSelectedDurations(prev => {
                if (prev.length !== newDurs.length) return newDurs;
                const sortedPrev = [...prev].sort();
                const sortedNew = [...newDurs].sort();
                return sortedPrev.every((val, index) => val === sortedNew[index]) ? prev : newDurs;
            });
        } else {
            setSelectedDurations(prev => prev.length > 0 ? [] : prev);
        }

        setSort(prev => prev !== sortParam ? sortParam : prev);

    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (search) params.set('q', search);
        else params.delete('q');

        if (category && category !== 'All') params.set('category', category);
        else params.delete('category');

        params.set('minPrice', priceRange[0].toString());
        params.set('maxPrice', priceRange[1].toString());

        if (selectedDurations.length > 0) params.set('duration', selectedDurations.join(','));
        else params.delete('duration');

        params.set('sort', sort);

        router.push(`/experiences?${params.toString()}`);
        setIsMobileOpen(false);
    };

    const handleDurationChange = (duration: string) => {
        setSelectedDurations(prev =>
            prev.includes(duration)
                ? prev.filter(d => d !== duration)
                : [...prev, duration]
        );
    };

    const clearFilters = () => {
        setSearch('');
        setCategory('All');
        setPriceRange([0, 500]);
        setSelectedDurations([]);
        setSort('recommended');
        router.push('/experiences');
        setIsMobileOpen(false);
    };

    const activeFilterCount = (category !== 'All' ? 1 : 0) + (selectedDurations.length > 0 ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

    return (
        <>
            <div className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md transition-all">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                        {/* Search & Mobile Toggle Row */}
                        <div className="flex w-full items-center gap-3 md:w-auto md:flex-1 md:gap-4">
                            <div className="relative flex-1 md:max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search experiences..."
                                    className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>

                            {/* Mobile Filter Button */}
                            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-xl md:hidden">
                                        <SlidersHorizontal className="h-5 w-5" />
                                        {activeFilterCount > 0 && (
                                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                                                {activeFilterCount}
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                                    <SheetHeader className="text-left">
                                        <SheetTitle className="text-2xl font-bold">Filters</SheetTitle>
                                    </SheetHeader>

                                    <div className="mt-8 flex flex-col gap-8">
                                        {/* Mobile Categories */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900">Categories</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {categories.map(cat => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => setCategory(cat)}
                                                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === cat
                                                                ? 'bg-orange-500 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Mobile Price */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900">Price Range</h3>
                                                <span className="text-sm font-medium text-gray-500">
                                                    €{priceRange[0]} - €{priceRange[1]}+
                                                </span>
                                            </div>
                                            <Slider
                                                defaultValue={[0, 500]}
                                                max={500}
                                                step={10}
                                                value={priceRange}
                                                onValueChange={setPriceRange}
                                                className="py-4"
                                            />
                                        </div>

                                        <Separator />

                                        {/* Mobile Duration */}
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-gray-900">Duration</h3>
                                            <div className="flex flex-col gap-3">
                                                {durations.map(dur => (
                                                    <div key={dur} className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={`mobile-${dur}`}
                                                            checked={selectedDurations.includes(dur)}
                                                            onCheckedChange={() => handleDurationChange(dur)}
                                                        />
                                                        <Label htmlFor={`mobile-${dur}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {dur}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <SheetFooter className="mt-12 flex-row gap-3 sm:justify-between">
                                        <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={clearFilters}>
                                            Clear All
                                        </Button>
                                        <Button className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 h-12 text-white" onClick={applyFilters}>
                                            Show Results
                                        </Button>
                                    </SheetFooter>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Filters */}
                        <div className="hidden items-center gap-3 md:flex">
                            {/* Category Dropdown (or Scroll if too many, currently dropdown to save space) */}
                            <Select value={category} onValueChange={(val) => { setCategory(val); setTimeout(() => { const params = new URLSearchParams(searchParams.toString()); params.set('category', val === 'All' ? '' : val); if (val === 'All') params.delete('category'); router.push(`/experiences?${params.toString()}`); }, 0); }}>
                                <SelectTrigger className="w-[160px] rounded-xl border-gray-200 bg-white font-medium">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Price Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={`rounded-xl border-gray-200 font-medium ${priceRange[0] > 0 || priceRange[1] < 500 ? 'border-orange-500 text-orange-600 bg-orange-50' : ''}`}>
                                        Price
                                        <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-4" align="start">
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Price Range</h4>
                                        <Slider
                                            defaultValue={[0, 500]}
                                            max={500}
                                            step={10}
                                            value={priceRange}
                                            onValueChange={setPriceRange}
                                        />
                                        <div className="flex items-center justify-between">
                                            <div className="rounded border px-2 py-1 text-sm">€{priceRange[0]}</div>
                                            <div className="text-gray-400">-</div>
                                            <div className="rounded border px-2 py-1 text-sm">€{priceRange[1]}+</div>
                                        </div>
                                        <Button className="w-full bg-orange-500 text-white hover:bg-orange-600 pt-1" size="sm" onClick={applyFilters}>Apply</Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            {/* Duration Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={`rounded-xl border-gray-200 font-medium ${selectedDurations.length > 0 ? 'border-orange-500 text-orange-600 bg-orange-50' : ''}`}>
                                        Duration
                                        {selectedDurations.length > 0 && <Badge variant="secondary" className="ml-2 h-5 bg-orange-100 text-orange-700 hover:bg-orange-100 px-1">{selectedDurations.length}</Badge>}
                                        <ChevronDown className="ml-2 h-3 w-3 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64 p-4" align="start">
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Duration</h4>
                                        <div className="space-y-3">
                                            {durations.map(dur => (
                                                <div key={dur} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`dt-${dur}`}
                                                        checked={selectedDurations.includes(dur)}
                                                        onCheckedChange={() => handleDurationChange(dur)}
                                                    />
                                                    <Label htmlFor={`dt-${dur}`}>{dur}</Label>
                                                </div>
                                            ))}
                                        </div>
                                        <Button className="w-full bg-orange-500 text-white hover:bg-orange-600" size="sm" onClick={applyFilters}>Apply</Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <div className="h-8 w-px bg-gray-200 mx-1" />

                            {/* Sort Dropdown */}
                            <Select value={sort} onValueChange={(val) => { setSort(val); setTimeout(() => { const params = new URLSearchParams(searchParams.toString()); params.set('sort', val); router.push(`/experiences?${params.toString()}`); }, 0); }}>
                                <SelectTrigger className="w-[180px] rounded-xl border-none bg-transparent font-medium hover:bg-gray-50 focus:ring-0">
                                    <span className="text-gray-500 mr-2">Sort by:</span>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="recommended">Recommended</SelectItem>
                                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                                    <SelectItem value="popularity">Most Popular</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Desktop Search Button */}
                        <div className="hidden md:block">
                            <Button onClick={applyFilters} className="rounded-xl bg-orange-500 px-8 font-bold text-white hover:bg-orange-600 shadow-brand">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Active Filters Row (Optional, if we want to show pills underneath) */}
                    {(category !== 'All' || selectedDurations.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
                        <div className="mt-3 hidden items-center gap-2 md:flex">
                            <span className="text-xs font-semibold text-gray-500">Active filters:</span>
                            {category !== 'All' && (
                                <Badge variant="outline" className="gap-1 rounded-md border-orange-200 bg-orange-50 text-orange-700">
                                    {category} <X className="h-3 w-3 cursor-pointer" onClick={() => { setCategory('All'); const params = new URLSearchParams(searchParams.toString()); params.delete('category'); router.push(`/experiences?${params.toString()}`); }} />
                                </Badge>
                            )}
                            {/* Add more pills for other filters if needed */}
                            <Button variant="link" className="h-auto p-0 text-xs text-gray-500 hover:text-orange-600" onClick={clearFilters}>
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
