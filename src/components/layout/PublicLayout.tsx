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
            {/* Bottom clearance lives on the Footer (.footer-safe), since that is
                the last element on the page — padding <main> would leave the
                footer itself trapped under the fixed bottom nav. */}
            <main id="main-content" className="w-full flex-1 pt-[56px] md:pt-20">{children}</main>
            <Footer />
            <WhatsAppButton />
        </>
    )
}
