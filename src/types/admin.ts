export interface AdminBooking {
    id: string
    name: string
    email: string
    phone?: string
    activityTitle: string
    guests: number
    date: string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    totalPrice?: number
    createdAt: string
    pickupLocation?: string
    flightNumber?: string
    language?: string
    dietary?: string
    specialRequests?: string
    packageName?: string
}

export interface Service {
    id: string
    title: string
    category: string
    price: number
    images: string[]
    description?: string
    duration?: string
    location?: string
    latitude?: number
    longitude?: number
    maxPeople?: number
    languages?: string[]
    included?: string[]
    excluded?: string[]
    requirements?: string[]
    rating?: number
    reviews?: number
    features?: string[]
    whatToBring?: string[]
    highlights?: string[]
    itinerary?: ItineraryItem[]
    host?: Host | string
    tags?: string[]
}

export interface ItineraryItem {
    time: string
    title: string
    description: string
}

export interface Host {
    name: string
    image: string
    bio?: string
    verified?: boolean
}

export interface User {
    id: string
    name: string | null
    email: string
    role: 'ADMIN' | 'CUSTOMER'
    source?: 'REGISTERED' | 'NEWSLETTER'
    createdAt: string
    _count?: {
        bookings: number
    }
}

export interface Notification {
    id: string
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'BOOKING' | 'REVIEW'
    title: string
    message: string
    read: boolean
    createdAt: string
    link?: string
}

export interface AdminNotification {
    id: string
    type: 'BOOKING' | 'CANCELLATION' | 'REVIEW' | 'MESSAGE' | 'SYSTEM' | 'ALERT'
    title: string
    message: string
    read: boolean
    createdAt: string
    link?: string
}