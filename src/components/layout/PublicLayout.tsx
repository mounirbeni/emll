'use client'

import { usePathname } from 'next/navigation'
import { Header } from "@/components/layout/Header"
import { MobileHeader } from "@/components/layout/MobileHeader"
import { Footer } from "@/components/layout/Footer"
import { WhatsAppButton } from "@/components/shared/WhatsAppButton"
import SkipLink from "@/components/shared/SkipLink"

export function PublicLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isExcluded = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard')

    if (isExcluded) {
        return <>{children}</>
    }

    return (
        <>
            <SkipLink />
            <div className="hidden md:block">
                <Header />
            </div>
            <MobileHeader />
            <main id="main-content" className="flex-1 w-full pt-[56px] md:pt-20 pb-safe-nav">{children}</main>
            <Footer />
            <WhatsAppButton />
        </>
    )
}
