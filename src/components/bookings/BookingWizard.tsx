"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Users, Clock, User, Mail, Phone, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface BookingWizardProps {
    isOpen: boolean
    onClose: () => void
    serviceTitle: string
    servicePrice: number
    serviceId: string
    onBookingSuccess: () => void
    user?: any
}

type Step = 'date' | 'time' | 'guests' | 'details' | 'review' | 'success'

const TIME_SLOTS = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00'
]

export function BookingWizard({
    isOpen,
    onClose,
    serviceTitle,
    servicePrice,
    serviceId,
    onBookingSuccess,
    user
}: BookingWizardProps) {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<Step>('date')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // Form data
    const [date, setDate] = useState<Date>()
    const [time, setTime] = useState<string>('')
    const [guests, setGuests] = useState(1)
    const [name, setName] = useState(user?.name || "")
    const [email, setEmail] = useState(user?.email || "")
    const [phone, setPhone] = useState("")
    const [pickupLocation, setPickupLocation] = useState("")
    const [specialRequests, setSpecialRequests] = useState("")
    const [language, setLanguage] = useState("")
    const [dietary, setDietary] = useState("")

    // Check for double bookings
    const [checkingAvailability, setCheckingAvailability] = useState(false)
    const [availabilityError, setAvailabilityError] = useState<string | null>(null)

    const totalPrice = Number(servicePrice) * guests

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setCurrentStep('date')
            setDate(undefined)
            setTime('')
            setGuests(1)
            setName(user?.name || "")
            setEmail(user?.email || "")
            setPhone("")
            setPickupLocation("")
            setSpecialRequests("")
            setLanguage("")
            setDietary("")
            setError(null)
            setAvailabilityError(null)
        }
    }, [isOpen, user])

    // Check availability when date and time are selected
    useEffect(() => {
        if (date && time && currentStep === 'time') {
            checkAvailability()
        }
    }, [date, time])

    const checkAvailability = async () => {
        if (!date || !time) return

        setCheckingAvailability(true)
        setAvailabilityError(null)

        try {
            const bookingDateTime = new Date(date)
            const [hours, minutes] = time.split(':').map(Number)
            bookingDateTime.setHours(hours, minutes, 0, 0)

            // Check if this time slot is already booked
            const response = await fetch(`/api/bookings/availability?serviceId=${serviceId}&date=${bookingDateTime.toISOString()}`)
            
            if (!response.ok) {
                const data = await response.json()
                if (data.error?.code === 'CONFLICT') {
                    setAvailabilityError('This time slot is already booked. Please choose another time.')
                    return
                }
            }

            const data = await response.json()
            if (!data.available) {
                setAvailabilityError('This time slot is not available. Please choose another time.')
            }
        } catch (err) {
            console.error('Availability check failed:', err)
            // Don't block booking if check fails
        } finally {
            setCheckingAvailability(false)
        }
    }

    const validateStep = (step: Step): boolean => {
        setError(null)
        setAvailabilityError(null)

        switch (step) {
            case 'date':
                if (!date) {
                    setError('Please select a date')
                    return false
                }
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const selectedDate = new Date(date)
                selectedDate.setHours(0, 0, 0, 0)
                if (selectedDate < today) {
                    setError('Please select a future date')
                    return false
                }
                return true

            case 'time':
                if (!time) {
                    setError('Please select a time')
                    return false
                }
                if (availabilityError) {
                    return false
                }
                // Validate time is in the future if date is today
                if (date) {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    const selectedDate = new Date(date)
                    selectedDate.setHours(0, 0, 0, 0)
                    
                    if (selectedDate.getTime() === today.getTime()) {
                        const [hours, minutes] = time.split(':').map(Number)
                        const bookingTime = new Date()
                        bookingTime.setHours(hours, minutes, 0, 0)
                        const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
                        
                        if (bookingTime <= oneHourFromNow) {
                            setError('Booking must be at least 1 hour in advance')
                            return false
                        }
                    }
                }
                return true

            case 'guests':
                if (guests < 1 || guests > 50) {
                    setError('Number of guests must be between 1 and 50')
                    return false
                }
                return true

            case 'details':
                if (!name || name.trim().length < 2) {
                    setError('Please enter your full name (at least 2 characters)')
                    return false
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!email || !emailRegex.test(email)) {
                    setError('Please enter a valid email address')
                    return false
                }
                return true

            default:
                return true
        }
    }

    const nextStep = () => {
        if (validateStep(currentStep)) {
            const steps: Step[] = ['date', 'time', 'guests', 'details', 'review']
            const currentIndex = steps.indexOf(currentStep)
            if (currentIndex < steps.length - 1) {
                setCurrentStep(steps[currentIndex + 1])
            }
        }
    }

    const prevStep = () => {
        const steps: Step[] = ['date', 'time', 'guests', 'details', 'review']
        const currentIndex = steps.indexOf(currentStep)
        if (currentIndex > 0) {
            setCurrentStep(steps[currentIndex - 1])
        }
    }

    const handleBooking = async () => {
        if (!date || !time) {
            setError('Please complete all required fields')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const bookingDate = new Date(date)
            const [hours, minutes] = time.split(':').map(Number)
            bookingDate.setHours(hours, minutes, 0, 0)

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    activityId: serviceId,
                    activityTitle: serviceTitle,
                    date: bookingDate.toISOString(),
                    guests,
                    totalPrice,
                    phone: phone || undefined,
                    name: name.trim(),
                    email: email.trim(),
                    pickupLocation: pickupLocation || undefined,
                    specialRequests: specialRequests || undefined,
                    language: language || undefined,
                    dietary: dietary || undefined,
                }),
            })

            if (res.status === 401) {
                const callbackUrl = typeof window !== 'undefined'
                    ? `${window.location.pathname}${window.location.search}`
                    : '/services'
                toast.error('Please log in to book this service.')
                router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
                return
            }

            const data = await res.json()

            if (!res.ok) {
                let errorMessage = data.error?.message || (typeof data.error === 'string' ? data.error : 'Failed to create booking')

                if (data.error?.code === 'VALIDATION_ERROR' && Array.isArray(data.error.details)) {
                    const details = data.error.details.map((issue: any) => {
                        const path = issue.path?.join('.') || 'field'
                        return `${path}: ${issue.message}`
                    }).join(', ')
                    errorMessage = `Validation error: ${details}`
                } else if (data.error?.code === 'CONFLICT') {
                    errorMessage = 'This time slot is already booked. Please choose another time.'
                } else if (data.error?.code === 'NOT_FOUND') {
                    errorMessage = 'Service not found. Please refresh the page and try again.'
                } else if (data.error?.code === 'BAD_REQUEST') {
                    errorMessage = data.error.message || 'Invalid booking request. Please check your details.'
                }

                throw new Error(errorMessage)
            }

            setCurrentStep('success')
            toast.success("Booking confirmed! We'll send you a confirmation email shortly.")
            onBookingSuccess()
        } catch (err: any) {
            setError(err.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 'date':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-semibold mb-3 block">Select Date</Label>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                disabled={(date) => {
                                    const today = new Date()
                                    today.setHours(0, 0, 0, 0)
                                    const selectedDate = new Date(date)
                                    selectedDate.setHours(0, 0, 0, 0)
                                    return selectedDate < today
                                }}
                                className="rounded-md border"
                            />
                        </div>
                    </div>
                )

            case 'time':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-semibold mb-3 block">Select Time</Label>
                            {date && (
                                <p className="text-sm text-medium-gray mb-4">
                                    {format(date, "EEEE, MMMM d, yyyy")}
                                </p>
                            )}
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {TIME_SLOTS.map((slot) => {
                                    const [hours, minutes] = slot.split(':').map(Number)
                                    const slotTime = date ? new Date(date) : new Date()
                                    slotTime.setHours(hours, minutes, 0, 0)
                                    const isPast = date && new Date(date).toDateString() === new Date().toDateString() && slotTime <= new Date(Date.now() + 60 * 60 * 1000)
                                    
                                    return (
                                        <button
                                            key={slot}
                                            onClick={() => {
                                                setTime(slot)
                                                setAvailabilityError(null)
                                            }}
                                            disabled={isPast || checkingAvailability}
                                            className={cn(
                                                "p-3 rounded-lg border text-sm font-medium transition-all",
                                                time === slot
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white hover:bg-cream border-border",
                                                isPast && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {slot}
                                        </button>
                                    )
                                })}
                            </div>
                            {checkingAvailability && (
                                <p className="text-sm text-medium-gray flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Checking availability...
                                </p>
                            )}
                            {availabilityError && (
                                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    {availabilityError}
                                </div>
                            )}
                        </div>
                    </div>
                )

            case 'guests':
                return (
                    <div className="space-y-4">
                        <div>
                            <Label className="text-base font-semibold mb-3 block flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Number of Guests
                            </Label>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setGuests(Math.max(1, guests - 1))}
                                    disabled={guests <= 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <div className="flex-1 text-center">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={50}
                                        value={guests}
                                        onChange={(e) => setGuests(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                                        className="text-center text-2xl font-bold"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setGuests(Math.min(50, guests + 1))}
                                    disabled={guests >= 50}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-sm text-medium-gray mt-2 text-center">
                                Price: €{servicePrice.toFixed(0)} × {guests} = €{totalPrice.toFixed(0)}
                            </p>
                        </div>
                    </div>
                )

            case 'details':
                return (
                    <div className="space-y-4">
                        <div className="grid gap-4">
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4" />
                                    Full Name *
                                </Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4" />
                                    Email *
                                </Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    required
                                    disabled={!!user?.email}
                                />
                            </div>
                            <div>
                                <Label className="flex items-center gap-2 mb-2">
                                    <Phone className="w-4 h-4" />
                                    Phone (Optional)
                                </Label>
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div>
                                <Label>Pickup Location (Optional)</Label>
                                <Input
                                    value={pickupLocation}
                                    onChange={(e) => setPickupLocation(e.target.value)}
                                    placeholder="Hotel name or address"
                                />
                            </div>
                            <div>
                                <Label>Language Preference (Optional)</Label>
                                <Input
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    placeholder="English, French, Arabic..."
                                />
                            </div>
                            <div>
                                <Label>Dietary Requirements (Optional)</Label>
                                <Input
                                    value={dietary}
                                    onChange={(e) => setDietary(e.target.value)}
                                    placeholder="Vegetarian, Vegan, Allergies..."
                                />
                            </div>
                            <div>
                                <Label>Special Requests (Optional)</Label>
                                <Textarea
                                    value={specialRequests}
                                    onChange={(e) => setSpecialRequests(e.target.value)}
                                    placeholder="Any special requests or notes..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                )

            case 'review':
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Review Your Booking</h3>
                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-medium-gray">Experience</span>
                                        <span className="font-medium">{serviceTitle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-medium-gray">Date</span>
                                        <span className="font-medium">
                                            {date ? format(date, "EEEE, MMMM d, yyyy") : 'Not selected'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-medium-gray">Time</span>
                                        <span className="font-medium">{time || 'Not selected'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-medium-gray">Guests</span>
                                        <span className="font-medium">{guests}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-medium-gray">Price per person</span>
                                        <span className="font-medium">€{servicePrice.toFixed(0)}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">€{totalPrice.toFixed(0)}</span>
                                    </div>
                                </CardContent>
                            </Card>
                            <div className="mt-4 space-y-2">
                                <p className="text-sm font-medium">Contact Information</p>
                                <p className="text-sm text-medium-gray">{name}</p>
                                <p className="text-sm text-medium-gray">{email}</p>
                                {phone && <p className="text-sm text-medium-gray">{phone}</p>}
                            </div>
                        </div>
                    </div>
                )

            case 'success':
                return (
                    <div className="text-center space-y-4 py-4">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-success" />
                        </div>
                        <h3 className="text-xl font-bold">Booking Confirmed!</h3>
                        <p className="text-medium-gray">
                            Your reservation for <span className="font-semibold text-charcoal">{serviceTitle}</span> has been confirmed.
                        </p>
                        <p className="text-sm text-medium-gray">
                            We've sent a confirmation email to {email}
                        </p>
                    </div>
                )

            default:
                return null
        }
    }

    const getStepTitle = () => {
        switch (currentStep) {
            case 'date': return 'Select Date'
            case 'time': return 'Select Time'
            case 'guests': return 'Number of Guests'
            case 'details': return 'Your Details'
            case 'review': return 'Review & Confirm'
            case 'success': return 'Booking Confirmed!'
            default: return 'Book Experience'
        }
    }

    const steps: Step[] = ['date', 'time', 'guests', 'details', 'review']
    const currentStepIndex = steps.indexOf(currentStep)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{getStepTitle()}</DialogTitle>
                    <DialogDescription>
                        {currentStep !== 'success' && serviceTitle}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                {currentStep !== 'success' && (
                    <div className="flex items-center justify-between mb-6">
                        {steps.map((step, index) => (
                            <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                                        index < currentStepIndex
                                            ? "bg-primary text-white"
                                            : index === currentStepIndex
                                                ? "bg-primary text-white"
                                                : "bg-border text-medium-gray"
                                    )}>
                                        {index < currentStepIndex ? (
                                            <CheckCircle2 className="w-5 h-5" />
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-xs mt-1 hidden sm:block",
                                        index <= currentStepIndex ? "text-charcoal font-medium" : "text-medium-gray"
                                    )}>
                                        {step.charAt(0).toUpperCase() + step.slice(1)}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "h-0.5 flex-1 mx-2",
                                        index < currentStepIndex ? "bg-primary" : "bg-border"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="py-4">
                    {renderStep()}
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="flex gap-3 justify-end">
                    {currentStep === 'success' ? (
                        <Button onClick={onClose} className="w-full">
                            Close
                        </Button>
                    ) : (
                        <>
                            {currentStepIndex > 0 && (
                                <Button variant="outline" onClick={prevStep}>
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            )}
                            {currentStep === 'review' ? (
                                <Button onClick={handleBooking} disabled={loading} className="flex-1">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </Button>
                            ) : (
                                <Button onClick={nextStep} className="flex-1">
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
