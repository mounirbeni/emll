import { cn } from "@/lib/utils"

interface MobilePageContainerProps {
    children: React.ReactNode
    className?: string
    withTopBar?: boolean
    withBottomNav?: boolean
    fullScreen?: boolean
}

export function MobilePageContainer({
    children,
    className,
    withTopBar = true,
    withBottomNav = true,
    fullScreen = false
}: MobilePageContainerProps) {
    return (
        <div
            className={cn(
                "md:hidden min-h-screen bg-beige-50",
                withTopBar && "pt-14",
                withBottomNav && "pb-16",
                fullScreen && "fixed inset-0 overflow-auto",
                className
            )}
        >
            {children}
        </div>
    )
}

export function DesktopPageContainer({
    children,
    className
}: {
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("hidden md:block", className)}>
            {children}
        </div>
    )
}
