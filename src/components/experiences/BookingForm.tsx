"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CalendarIcon, MessageCircle, Clock, Users, User, Mail, Phone, MapPin, FileText, ChevronRight, Shield, Star, Check } from "lucide-react";
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
    const pricePerPerson = Number(selectedPackage ? selectedPackage.price : (activity ? activity.price : 0));
    const totalPrice = pricePerPerson * guests;

    // Generate time slots (09:00 to 18:00)
    const timeSlots = Array.from({ length: 10 }, (_, i) => {
        const hour = i + 9;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    return (
        <Card className="border-border shadow-2xl sticky top-28 rounded-2xl overflow-hidden">
            {/* Premium Header with Gradient */}
            <div className="bg-gradient-to-r from-primary to-accent p-4 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm font-medium">From</p>
                        <div className="text-2xl font-bold">€{pricePerPerson}</div>
                        <p className="text-white/70 text-xs">per person</p>
                    </div>
                    {activity.rating >= 4.8 && (
                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span className="text-sm font-semibold text-primary">Popular</span>
                        </div>
                    )}
                </div>
            </div>

            <CardHeader className="pb-2 pt-4">
                {/* Price Summary */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Total for {guests} {guests === 1 ? 'person' : 'people'}</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-3xl font-bold text-foreground">€{totalPrice}</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
                {/* Package Selection */}
                {((activity.packageCategories && activity.packageCategories.length > 0) || (activity.packages && activity.packages.length > 0)) && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">1</span>
                            </div>
                            <Label className="text-sm font-semibold">Select Package</Label>
                        </div>
                        <RadioGroup
                            value={selectedPackageName}
                            onValueChange={setSelectedPackageName}
                            className="flex flex-col gap-2"
                        >
                            {activity.packageCategories && activity.packageCategories.length > 0 ? (
                                activity.packageCategories.map((category) => (
                                    <div key={category.name} className="space-y-2">
                                        <div className="pt-2 first:pt-0">
                                            <h4 className="font-semibold text-sm text-foreground">{category.name}</h4>
                                            {category.description && (
                                                <p className="text-xs text-muted-foreground">{category.description}</p>
                                            )}
                                        </div>
                                        {category.packages.map((pkg) => (
                                            <label key={pkg.name} className={cn(
                                                "flex items-start gap-3 border-2 rounded-xl p-3 cursor-pointer transition-all duration-200",
                                                selectedPackageName === pkg.name
                                                    ? "border-primary bg-primary/5 shadow-sm"
                                                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                                            )}>
                                                <RadioGroupItem value={pkg.name} id={pkg.name} className="mt-0.5" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-semibold text-sm">{pkg.name}</span>
                                                        <span className="text-primary font-bold text-sm whitespace-nowrap">€{pkg.price.toString()}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pkg.description}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                ))
                            ) : activity.packages && activity.packages.length > 0 ? (
                                activity.packages.map((pkg) => (
                                    <label key={pkg.name} className={cn(
                                        "flex items-start gap-3 border-2 rounded-xl p-3 cursor-pointer transition-all duration-200",
                                        selectedPackageName === pkg.name
                                            ? "border-primary bg-primary/5 shadow-sm"
                                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                                    )}>
                                        <RadioGroupItem value={pkg.name} id={pkg.name} className="mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-semibold text-sm">{pkg.name}</span>
                                                <span className="text-primary font-bold text-sm whitespace-nowrap">€{pkg.price.toString()}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pkg.description}</p>
                                        </div>
                                    </label>
                                ))
                            ) : null}
                        </RadioGroup>
                    </div>
                )}

                {/* Date & Time Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">2</span>
                        </div>
                        <Label className="text-sm font-semibold">When would you like to go?</Label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal h-12 rounded-xl border-2",
                                        !date && "text-muted-foreground",
                                        date && "border-primary/50 bg-primary/5"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                    {date ? format(date, "MMM d") : "Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
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

                        <div className="relative">
                            <select
                                className={cn(
                                    "flex h-12 w-full items-center rounded-xl border-2 bg-white px-3 py-2 text-sm transition-all duration-200 outline-none appearance-none cursor-pointer",
                                    selectedTime ? "border-primary/50 bg-primary/5" : "border-border",
                                    "hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                                )}
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                            >
                                <option value="" disabled>Time</option>
                                {timeSlots.map((time) => {
                                    if (date) {
                                        const now = new Date();
                                        const isToday = date.toDateString() === now.toDateString();
                                        if (isToday) {
                                            const [hours] = time.split(':').map(Number);
                                            if (hours <= now.getHours()) return null;
                                        }
                                    }
                                    return <option key={time} value={time}>{time}</option>;
                                })}
                            </select>
                            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Guests Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">3</span>
                        </div>
                        <Label className="text-sm font-semibold">Number of Guests</Label>
                    </div>
                    <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            disabled={guests <= 1}
                            className="h-10 w-10 rounded-lg border-2 font-bold text-lg"
                        >
                            −
                        </Button>
                        <div className="flex-1 text-center">
                            <span className="text-2xl font-bold text-foreground">{guests}</span>
                            <p className="text-xs text-muted-foreground">{guests === 1 ? 'guest' : 'guests'}</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setGuests(Math.min(20, guests + 1))}
                            disabled={guests >= 20}
                            className="h-10 w-10 rounded-lg border-2 font-bold text-lg"
                        >
                            +
                        </Button>
                    </div>
                </div>

                {/* Contact Details Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">4</span>
                        </div>
                        <Label className="text-sm font-semibold">Your Details</Label>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-12 rounded-xl" />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 rounded-xl" />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Phone / WhatsApp" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-12 rounded-xl" />
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Pickup Location (Optional)" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="pl-10 h-12 rounded-xl" />
                        </div>

                        <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Special Requests (Optional)" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} className="pl-10 h-12 rounded-xl" />
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 py-3 border-t border-border">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Shield className="h-4 w-4 text-green-600" />
                        <span>Secure Booking</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>Free Cancellation</span>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        className="w-full text-base font-bold py-6 h-auto min-h-[56px] rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
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
