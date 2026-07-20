"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileHeader() {
    const pathname = usePathname()
    const router = useRouter()
    const isHome = pathname === "/"

    const handleBack = () => {
        router.back()
    }

    if (pathname?.startsWith('/admin')) return null

    return (
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm safe-area-top">
            <div className="flex items-center justify-between h-[56px] px-4">
                {isHome ? (
                    <div className="flex items-center gap-2">
                        <span className="font-serif text-xl font-bold text-primary tracking-tight">Marrakech</span>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleBack}
                        className="touch-target -ml-2 hover:bg-transparent text-gray-800"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                )}

                <div className="flex-1 text-center font-semibold text-gray-900 truncate px-2">
                    {isHome ? "" : getPageTitle(pathname)}
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="touch-target text-gray-600">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="touch-target text-gray-600">
                        <Bell className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}

function getPageTitle(pathname: string | null): string {
    if (!pathname) return ""
    if (pathname.startsWith("/experiences")) return "Experiences"
    if (pathname.startsWith("/recommendations")) return "Recommendations"
    if (pathname.startsWith("/client/bookings")) return "My Trips"
    if (pathname.startsWith("/client/profile")) return "Profile"
    return ""
}
