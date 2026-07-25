"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookingCalendar } from "@/components/mobile/BookingCalendar"
import { X, ChevronLeft, Check, Calendar as CalendarIcon, Users, User, Mail, Phone, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, startOfToday } from "date-fns"

interface MobileBookingWizardProps {
    isOpen: boolean
    onClose: () => void
    serviceTitle: string
    servicePrice: number
    serviceId: string
    onBookingSuccess: (bookingId?: string) => void
    user?: {
        name?: string | null
        email?: string | null
        phone?: string | null
    }
}

type Step = "date" | "time" | "guests" | "details" | "review"

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00'
]

export function MobileBookingWizard({
    isOpen,
    onClose,
    serviceTitle,
    servicePrice,
    serviceId,
    onBookingSuccess,
    user
}: MobileBookingWizardProps) {
    const [currentStep, setCurrentStep] = useState<Step>("date")
    const [selectedDate, setSelectedDate] = useState<Date>()
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [adults, setAdults] = useState(1)
    const [children, setChildren] = useState(0)
    const [fullName, setFullName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [phone, setPhone] = useState("")
    const [specialRequests, setSpecialRequests] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Lock the page behind the wizard so it can't scroll under the overlay, and
    // restore the previous value on close (never hard-code back to "").
    useEffect(() => {
        if (!isOpen) return
        const previous = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = previous
        }
    }, [isOpen])

    // Close on hardware/browser back and on Escape rather than trapping the user.
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isOpen, onClose])

    const steps: Step[] = ["date", "time", "guests", "details", "review"]
    const currentStepIndex = steps.indexOf(currentStep)
    const progress = ((currentStepIndex + 1) / steps.length) * 100

    if (!isOpen) return null

    const canProceed = () => {
        switch (currentStep) {
            case "date":
                return selectedDate !== undefined
            case "time":
                return selectedTime !== ""
            case "guests":
                return adults > 0
            case "details":
                return fullName.trim() !== "" && email.trim() !== "" && phone.trim() !== ""
            case "review":
                return true
            default:
                return false
        }
    }

    const handleNext = () => {
        const nextIndex = currentStepIndex + 1
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex])
        }
    }

    const handleBack = () => {
        if (currentStepIndex > 0) {
            setCurrentStep(steps[currentStepIndex - 1])
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experienceId: serviceId, // Fixed prop name mismatch if any, component passed serviceId
                    date: selectedDate,
                    time: selectedTime,
                    numberOfPeople: adults + children, // Mapping to API schema
                    adults, // Keeping detailed fields just in case
                    children,
                    userName: fullName,
                    userEmail: email,
                    userPhone: phone,
                    notes: specialRequests,
                    totalPrice: servicePrice * adults + (servicePrice * 0.5) * children
                })
            })

            const data = await response.json();

            if (response.ok) {
                // Pass bookingId to parent
                onBookingSuccess(data.id)
                onClose()
            } else {
                throw new Error(data.error || 'Booking failed')
            }
        } catch (error) {
            console.error(error)
            alert('Booking failed. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getStepTitle = () => {
        switch (currentStep) {
            case "date": return "Select Date"
            case "time": return "Choose Time"
            case "guests": return "Number of Guests"
            case "details": return "Your Details"
            case "review": return "Review & Confirm"
            default: return ""
        }
    }

    const totalGuests = adults + children
    const totalPrice = servicePrice * adults + (servicePrice * 0.5) * children

    return (
        // A full-screen flex column: header and footer stay put, only the middle
        // scrolls. Previously the children used `flex-1` with no `flex flex-col`
        // on this parent, so nothing constrained the height and the calendar
        // spilled over the rest of the step.
        <div className="layer-modal bg-beige-50 fixed inset-0 flex flex-col overscroll-contain md:hidden">
            {/* Header */}
            <div className="safe-top shrink-0 border-b border-border bg-white px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <button onClick={currentStepIndex > 0 ? handleBack : onClose} className="p-2 -ml-2">
                        {currentStepIndex > 0 ? (
                            <ChevronLeft className="w-6 h-6 text-charcoal" />
                        ) : (
                            <X className="w-6 h-6 text-charcoal" />
                        )}
                    </button>
                    <h2 className="text-lg font-semibold text-charcoal">{getStepTitle()}</h2>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Content — the only scrollable region */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-6">
                {/* Date Step */}
                {currentStep === "date" && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-charcoal mb-2">When would you like to go?</h3>
                            <p className="text-sm text-gray-600">Select your preferred date</p>
                        </div>

                        <div className="surface-card p-4">
                            <BookingCalendar
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                minDate={startOfToday()}
                            />
                        </div>

                        {selectedDate && (
                            <div className="border-brand-200 bg-brand-50 flex items-center gap-3 rounded-2xl border p-4">
                                <CalendarIcon className="text-brand-600 h-5 w-5 shrink-0" />
                                <div className="min-w-0">
                                    <p className="text-brand-900 text-sm font-medium">Selected Date</p>
                                    <p className="text-brand-600 truncate text-base font-bold">
                                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Time Step */}
                {currentStep === "time" && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-charcoal mb-2">What time works best?</h3>
                            <p className="text-sm text-gray-600">Choose a time slot</p>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {TIME_SLOTS.map((time) => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={cn(
                                        "h-14 rounded-2xl border-2 font-medium transition-all",
                                        selectedTime === time
                                            ? "bg-orange-500 border-orange-500 text-white"
                                            : "bg-white border-gray-200 text-charcoal active:scale-95"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>

                        {selectedTime && (
                            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-orange-600" />
                                <div>
                                    <p className="text-sm font-medium text-orange-900">Selected Time</p>
                                    <p className="text-lg font-bold text-orange-600">{selectedTime}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Guests Step */}
                {currentStep === "guests" && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-charcoal mb-2">How many guests?</h3>
                            <p className="text-sm text-gray-600">Select number of people</p>
                        </div>

                        {/* Adults */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-semibold text-charcoal">Adults</p>
                                    <p className="text-sm text-gray-500">Age 13+</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-charcoal font-bold active:scale-90 transition-transform"
                                    >
                                        −
                                    </button>
                                    <span className="text-xl font-bold text-charcoal w-8 text-center">{adults}</span>
                                    <button
                                        onClick={() => setAdults(adults + 1)}
                                        className="w-10 h-10 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center text-white font-bold active:scale-90 transition-transform"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Children */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-charcoal">Children</p>
                                    <p className="text-sm text-gray-500">Age 0-12 (50% off)</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-charcoal font-bold active:scale-90 transition-transform"
                                    >
                                        −
                                    </button>
                                    <span className="text-xl font-bold text-charcoal w-8 text-center">{children}</span>
                                    <button
                                        onClick={() => setChildren(children + 1)}
                                        className="w-10 h-10 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center text-white font-bold active:scale-90 transition-transform"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-orange-900">Total Guests</span>
                                <span className="text-lg font-bold text-orange-600">{totalGuests}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-orange-900">Estimated Price</span>
                                <span className="text-lg font-bold text-orange-600">€{totalPrice.toFixed(0)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Step */}
                {currentStep === "details" && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-charcoal mb-2">Contact Information</h3>
                            <p className="text-sm text-gray-600">We'll send confirmation here</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fullName" className="text-sm font-medium text-charcoal mb-2 block">
                                    Full Name *
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="fullName"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="John Doe"
                                        className="pl-10 h-14 rounded-2xl border-gray-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-charcoal mb-2 block">
                                    Email Address *
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="infoexploremarrakesh@gmail.com"
                                        className="pl-10 h-14 rounded-2xl border-gray-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-sm font-medium text-charcoal mb-2 block">
                                    Phone Number *
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+212 601 439 975"
                                        className="pl-10 h-14 rounded-2xl border-gray-200"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="requests" className="text-sm font-medium text-charcoal mb-2 block">
                                    Special Requests (Optional)
                                </Label>
                                <textarea
                                    id="requests"
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    placeholder="Any dietary restrictions, accessibility needs, etc."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Review Step */}
                {currentStep === "review" && (
                    <div className="space-y-4">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-charcoal mb-2">Review Your Booking</h3>
                            <p className="text-sm text-gray-600">Please confirm all details</p>
                        </div>

                        {/* Experience */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-500 mb-1">Experience</p>
                            <p className="font-semibold text-charcoal">{serviceTitle}</p>
                        </div>

                        {/* Date & Time */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-500 mb-2">Date & Time</p>
                            <div className="flex items-center gap-2 text-charcoal">
                                <CalendarIcon className="w-4 h-4" />
                                <span className="font-medium">{selectedDate && format(selectedDate, "MMM d, yyyy")}</span>
                                <span className="text-gray-400">•</span>
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">{selectedTime}</span>
                            </div>
                        </div>

                        {/* Guests */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-500 mb-2">Guests</p>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-charcoal" />
                                <span className="font-medium text-charcoal">
                                    {adults} {adults === 1 ? 'Adult' : 'Adults'}
                                    {children > 0 && `, ${children} ${children === 1 ? 'Child' : 'Children'}`}
                                </span>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm">
                            <p className="text-xs text-gray-500 mb-2">Contact Information</p>
                            <div className="space-y-1 text-sm text-charcoal">
                                <p className="font-medium">{fullName}</p>
                                <p className="text-gray-600">{email}</p>
                                <p className="text-gray-600">{phone}</p>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                            <div className="space-y-2 mb-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">€{servicePrice} × {adults} adult{adults > 1 ? 's' : ''}</span>
                                    <span className="font-medium text-gray-900">€{(servicePrice * adults).toFixed(0)}</span>
                                </div>
                                {children > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700">€{(servicePrice * 0.5).toFixed(0)} × {children} child{children > 1 ? 'ren' : ''}</span>
                                        <span className="font-medium text-gray-900">€{(servicePrice * 0.5 * children).toFixed(0)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-orange-200 pt-3 flex items-center justify-between">
                                <span className="font-semibold text-orange-900">Total</span>
                                <span className="text-2xl font-bold text-orange-600">€{totalPrice.toFixed(0)}</span>
                            </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-sm text-primary">
                            <p className="font-medium mb-1">Free Cancellation</p>
                            <p className="text-primary">Cancel up to 24 hours before for a full refund</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom CTA — a flex child, not fixed, so it can never overlap the
                scrolling content above it. */}
            <div className="safe-bottom shrink-0 border-t border-border bg-white p-4">
                <Button
                    onClick={currentStep === "review" ? handleSubmit : handleNext}
                    disabled={!canProceed() || isSubmitting}
                    className="h-14 w-full rounded-2xl text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isSubmitting ? (
                        "Processing..."
                    ) : currentStep === "review" ? (
                        <>
                            <Check className="w-5 h-5 mr-2" />
                            Confirm Booking
                        </>
                    ) : (
                        "Continue"
                    )}
                </Button>
            </div>
        </div>
    )
}
