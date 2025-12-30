'use client'

import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, Search, User, Settings, LogOut, Shield } from "lucide-react"
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Notifications } from '@/components/admin/Notifications'
import { Input } from "@/components/ui/input"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import React from "react"
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function AdminHeader() {
    const pathname = usePathname()
    const [sheetOpen, setSheetOpen] = React.useState(false)
    const { data: session } = useSession()

    // Generate breadcrumbs from path
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`
        const label = segment.charAt(0).toUpperCase() + segment.slice(1)
        return { href, label, isLast: index === segments.length - 1 }
    })

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-2 md:gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-md transition-all">
            <div className="flex items-center gap-2 md:gap-4">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="-ml-2 md:-ml-3">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64 md:w-72 border-r-0">
                        <SheetTitle className="sr-only">Navigation</SheetTitle>
                        <AdminSidebar onClose={() => setSheetOpen(false)} />
                    </SheetContent>
                </Sheet>
                
                <div className="flex md:hidden">
                    <h1 className="text-lg font-semibold truncate max-w-[120px] md:max-w-xs">
                        {breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : 'Dashboard'}
                    </h1>
                </div>
            </div>

            <div className="flex flex-1 items-center gap-2 md:gap-4">
                <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={item.href}>
                                <BreadcrumbItem>
                                    {item.isLast ? (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    ) : (
                                        <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </React.Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className="relative hidden sm:block w-full max-w-[120px] md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-32 md:w-64 rounded-xl bg-muted/50 pl-9 focus-visible:bg-background transition-colors text-sm md:text-base"
                    />
                </div>

                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                <Notifications />

                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-full pl-0 pr-3 py-1.5 h-auto hover:bg-orange-50 border border-transparent hover:border-orange-100 gap-3 transition-all">
                            <div className="h-10 w-10 bg-[#FF5F00] rounded-full flex items-center justify-center text-white font-medium shadow-md shadow-orange-500/20 ring-2 ring-white">
                                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-medium text-gray-800 leading-none mb-1">
                                    {session?.user?.name?.split(' ')[0] || 'Admin'}
                                </span>
                                <span className="text-[10px] text-[#FF5F00] uppercase tracking-wider leading-none">
                                    Admin
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-3xl shadow-xl border-gray-100 bg-white">
                        <DropdownMenuLabel className="p-4">
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-[#FF5F00]" />
                                    <p className="text-sm font-medium leading-none text-gray-900">{session?.user?.name || 'Admin'}</p>
                                </div>
                                <p className="text-xs leading-none text-gray-500 font-normal mt-1">{session?.user?.email}</p>
                                <span className="text-[10px] text-[#FF5F00] uppercase tracking-wider leading-none mt-1">
                                    {session?.user?.role || 'ADMIN'}
                                </span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-100 my-1" />
                        <DropdownMenuItem asChild>
                            <Link href="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-orange-50 text-gray-600 hover:text-[#FF5F00] transition-colors font-medium">
                                <User className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-orange-50 text-gray-600 hover:text-[#FF5F00] transition-colors font-medium">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100 my-1" />
                        <DropdownMenuItem
                            className="flex items-center gap-3 p-3 rounded-2xl text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-medium"
                            onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
