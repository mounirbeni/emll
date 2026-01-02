"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CalendarIcon, MessageCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Calendar } from "@/components/ui/calendar";
import { useRouter } from "next/navigation";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Activity } from "@/lib/types";

interface BookingFormProps {
    activity: Activity;
}

export function BookingForm({ activity }: BookingFormProps) {
    const router = useRouter();
    const { status } = useSession();
    const isGuest = status === 'unauthenticated';
    const [date, setDate] = useState<Date>();
    const [guests, setGuests] = useState(2);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [specialRequests, setSpecialRequests] = useState("");

    // Helper to get  first package name from either structure
    const getFirstPackageName = () => {
        if (!activity) return undefined;
        if (activity.packageCategories && activity.packageCategories.length > 0) {
            return activity.packageCategories[0]?.packages[0]?.name;
        }
        return activity.packages?.[0]?.name;
    };

    // Helper to find package by name from either structure
    const findPackage = (packageName: string | undefined) => {
        if (!packageName) return undefined;

        if (activity.packageCategories) {
            for (const category of activity.packageCategories) {
                const pkg = category.packages.find(p => p.name === packageName);
                if (pkg) return pkg;
            }
        }

        return activity.packages?.find(p => p.name === packageName);
    };

    // New state for packages and time
    const [selectedPackageName, setSelectedPackageName] = useState<string | undefined>(
        getFirstPackageName()
    );
    const [selectedTime, setSelectedTime] = useState<string>("");

    // Update selected package if activity changes
    // Track the current activity ID to detect changes
    const [prevActivityId, setPrevActivityId] = useState(activity.id);

    // Reset state if activity changes (pattern: state derived from props)
    useEffect(() => {
        if (activity && activity.id !== prevActivityId) {
            setPrevActivityId(activity.id);
            setSelectedPackageName(getFirstPackageName());
            // Also reset other state if needed, but for now just package
        }
    }, [activity, prevActivityId]);

    const selectedPackage = findPackage(selectedPackageName);
    const pricePerPerson = selectedPackage ? selectedPackage.price : (activity ? activity.price : 0);
    const totalPrice = pricePerPerson * guests;

    // Generate time slots (09:00 to 18:00)
    const timeSlots = Array.from({ length: 10 }, (_, i) => {
        const hour = i + 9;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    return (
        <Card className="border-border shadow-xl sticky top-28">
            <CardHeader className="pb-4">
                {activity.rating >= 4.8 && (
                    <div className="mb-4 flex justify-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                                <path fillRule="evenodd" d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.216.093.174.204.338.341.48.214.22.583.19.758-.058a9.8 9.8 0 00.663-.468zM10.5 15.25a5.25 5.25 0 00-3.099-9.628 5.8 5.8 0 01-1.96 3.283.75.75 0 01-1.192-.555 6.75 6.75 0 009.283 5.83.75.75 0 01.932.932c-.5.94-1.193 1.777-2.016 2.442a5.25 5.25 0 00-1.948-2.304z" clipRule="evenodd" />
                            </svg>
                            Likely to Sell Out
                        </div>
                    </div>
                )}
                <div className="text-center space-y-3">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Price per person</p>
                        <div className="text-lg font-semibold text-foreground">
                            {pricePerPerson} €
                        </div>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-3xl font-bold text-primary">{totalPrice} €</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            for {guests} {guests === 1 ? 'person' : 'people'}
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Package Selection */}
                {((activity.packageCategories && activity.packageCategories.length > 0) || (activity.packages && activity.packages.length > 0)) && (
                    <div className="space-y-3">
                        <Label>Select Package</Label>
                        <RadioGroup
                            value={selectedPackageName}
                            onValueChange={setSelectedPackageName}
                            className="flex flex-col gap-3"
                        >
                            {activity.packageCategories && activity.packageCategories.length > 0 ? (
                                // Categorized packages
                                activity.packageCategories.map((category) => (
                                    <div key={category.name} className="space-y-2">
                                        <div className="pt-2 first:pt-0">
                                            <h4 className="font-semibold text-sm text-foreground">{category.name}</h4>
                                            {category.description && (
                                                <p className="text-xs text-muted-foreground">{category.description}</p>
                                            )}
                                        </div>
                                        {category.packages.map((pkg) => (
                                            <div key={pkg.name} className="flex items-start space-x-2 border border-border rounded-lg p-3 hover:bg-accent/5 transition-colors">
                                                <RadioGroupItem value={pkg.name} id={pkg.name} className="mt-1" />
                                                <div className="grid gap-1.5 leading-none w-full">
                                                    <Label htmlFor={pkg.name} className="font-semibold cursor-pointer">
                                                        {pkg.name}
                                                    </Label>
                                                    <p className="text-sm text-muted-foreground">
                                                        {pkg.description}
                                                    </p>
                                                    <p className="text-sm font-medium text-primary">
                                                        {pkg.price} €
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))
                            ) : activity.packages && activity.packages.length > 0 ? (
                                // Legacy flat packages
                                activity.packages.map((pkg) => (
                                    <div key={pkg.name} className="flex items-start space-x-2 border border-border rounded-lg p-3 hover:bg-accent/5 transition-colors">
                                        <RadioGroupItem value={pkg.name} id={pkg.name} className="mt-1" />
                                        <div className="grid gap-1.5 leading-none w-full">
                                            <Label htmlFor={pkg.name} className="font-semibold cursor-pointer">
                                                {pkg.name}
                                            </Label>
                                            <p className="text-sm text-muted-foreground">
                                                {pkg.description}
                                            </p>
                                            <p className="text-sm font-medium text-primary">
                                                {pkg.price} €
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : null}
                        </RadioGroup>
                    </div>
                )}

                <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal h-auto min-h-[48px] px-4",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const selectedDate = new Date(date);
                                    selectedDate.setHours(0, 0, 0, 0);
                                    return selectedDate < today;
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                    <Label>Select Time</Label>
                    <div className="relative">
                        <select
                            className="flex h-auto min-h-[48px] w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                        >
                            <option value="" disabled>Select a time</option>
                            {timeSlots.map((time) => {
                                // Filter past times if date is today
                                if (date) {
                                    const now = new Date();
                                    const isToday = date.toDateString() === now.toDateString();
                                    if (isToday) {
                                        const [hours] = time.split(':').map(Number);
                                        if (hours <= now.getHours()) {
                                            return null;
                                        }
                                    }
                                }
                                return (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                );
                            })}
                        </select>
                        <Clock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Number of Guests</Label>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            disabled={guests <= 1}
                            className="h-12 w-12 sm:h-10 sm:w-10"
                        >
                            -
                        </Button>
                        <Input
                            type="number"
                            min={1}
                            max={20}
                            value={guests}
                            onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                setGuests(Math.max(1, Math.min(20, val)));
                            }}
                            className="text-center h-12 sm:h-10 text-base"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests(Math.min(20, guests + 1))}
                            disabled={guests >= 20}
                            className="h-12 w-12 sm:h-10 sm:w-10"
                        >
                            +
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Maximum 20 guests</p>
                </div>

                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="h-12 sm:h-10" />
                </div>

                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 sm:h-10" />
                </div>

                <div className="space-y-2">
                    <Label>Phone / WhatsApp</Label>
                    <Input placeholder="+212 601 439 975" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 sm:h-10" />
                </div>

                <div className="space-y-2">
                    <Label>Pickup Location (Optional)</Label>
                    <Input placeholder="Hotel name or address" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="h-12 sm:h-10" />
                </div>

                <div className="space-y-2">
                    <Label>Special Requests (Optional)</Label>
                    <Input placeholder="Dietary requirements, accessibility, etc." value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="h-12 sm:h-10" />
                </div>

                <div className="pt-2">
                    <p className="text-xs text-center text-muted-foreground mb-3">
                        No payment required today
                    </p>
                    <Button
                        className="w-full text-base sm:text-lg font-semibold py-6 sm:py-5 h-auto min-h-[52px] rounded-full shadow-lg hover:shadow-xl transition-all"
                        onClick={() => {
                            if (isGuest) {
                                const callbackUrl = typeof window !== 'undefined'
                                    ? `${window.location.pathname}${window.location.search}`
                                    : '/experiences';
                                router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
                                return;
                            }
                            if (!date) {
                                alert("Please select a date");
                                return;
                            }
                            if (!selectedTime) {
                                alert("Please select a time");
                                return;
                            }
                            if (!name || !email) {
                                alert("Please fill in your name and email");
                                return;
                            }
                            
                            // Validate email format
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(email)) {
                                alert("Please enter a valid email address");
                                return;
                            }

                            // Combine date and time
                            const [hours, minutes] = selectedTime.split(':').map(Number);
                            const bookingDate = new Date(date);
                            bookingDate.setHours(hours, minutes, 0, 0); // Set seconds and milliseconds to 0

                            // Validate date is in the future (at least 1 hour ahead)
                            const now = new Date();
                            const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
                            if (bookingDate <= oneHourFromNow) {
                                alert("Booking must be at least 1 hour in advance. Please select a later date or time.");
                                return;
                            }

                            // Validate activity ID exists
                            if (!activity.id) {
                                alert("Error: Activity ID is missing. Please refresh the page and try again.");
                                return;
                            }

                            // Submit to API
                            const bookingData = {
                                name,
                                email,
                                phone,
                                pickupLocation,
                                specialRequests,
                                activityId: activity.id,
                                activityTitle: activity.title,
                                date: bookingDate.toISOString(), // Convert to ISO string for API
                                guests,
                                totalPrice,
                                packageName: selectedPackageName
                            };

                            const promise = fetch('/api/bookings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(bookingData),
                            }).then(async (response) => {
                                const data = await response.json();
                                if (!response.ok) {
                                    // Handle structured error response
                                    let errorMessage = data.error?.message || (typeof data.error === 'string' ? data.error : 'Failed to book');

                                    // If validation error, append details
                                    if (data.error?.code === 'VALIDATION_ERROR' && Array.isArray(data.error.details)) {
                                        const details = data.error.details.map((issue: any) => `${issue.path.join('.')}: ${issue.message}`).join(', ');
                                        errorMessage += ` (${details})`;
                                    }

                                    throw new Error(errorMessage);
                                }
                                return data;
                            });

                            toast.promise(promise, {
                                loading: 'Processing your booking request...',
                                success: (data) => {
                                    // Reset form
                                    setName("");
                                    setEmail("");
                                    setPhone("");
                                    setPickupLocation("");
                                    setSpecialRequests("");
                                    setDate(undefined);
                                    setSelectedTime("");
                                    // Keep package selection or reset if desired
                                    return `Thank you! We have received your booking request. We will review it and get back to you as soon as possible.`;
                                },
                                error: (err) => {
                                    const errorMsg = err.message || 'Failed to create booking';
                                    return `Error: ${errorMsg}`;
                                },
                            });
                        }}
                    >
                        {isGuest ? 'Login to Book' : 'Check Availability'}
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pt-0">
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full gap-2 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary"
                    onClick={() => {
                        const phoneNumber = "212601439975"; // Morocco format: +212 601 439 975
                        const activityTitle = activity?.title || 'this activity';
                        const message = encodeURIComponent(`Hi! I'm interested in booking "${activityTitle}" for ${guests} people. Can you provide more information?`);
                        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                    }}
                >
                    <MessageCircle className="h-4 w-4" />
                    Ask a Question via WhatsApp
                </Button>
            </CardFooter>
        </Card>
    );
}
