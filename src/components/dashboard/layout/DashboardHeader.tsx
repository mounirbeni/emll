"use client";

import { Bell, Search, Menu, User, Settings, LogOut, Heart, ShoppingBag, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export function DashboardHeader() {
    const { data: session } = useSession();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Simple polling for unread notifications/messages could go here
        // For now, we'll leave it simple or fetch from the stats API we built
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard/stats');
                if (res.ok) {
                    const data = await res.json();
                    setUnreadCount(data.stats?.unreadMessages || 0);
                }
            } catch (e) { }
        }
        fetchStats();
    }, []);

    return (
        <header className="sticky top-0 z-40 flex h-24 w-full items-center gap-4 bg-white border-b border-gray-100 px-8 transition-all duration-300 shadow-sm">
            {/* Mobile Nav Toggle */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden text-gray-500 hover:text-[#FF5F00] hover:bg-orange-50 rounded-xl">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 border-r border-gray-100 bg-white">
                    <SheetHeader className="p-6 border-b border-gray-100 text-left">
                        <SheetTitle className="text-xl font-bold text-[#FF5F00] flex items-center gap-2">
                            <Compass className="w-6 h-6" />
                            Explore Marrakesh
                        </SheetTitle>
                    </SheetHeader>
                    <DashboardSidebar className="border-none shadow-none" showLogo={false} />
                </SheetContent>
            </Sheet>

            {/* Title / Breadcrumb Placeholder */}
            <div className="flex-1 hidden md:block">
                <nav className="flex text-sm text-gray-500 font-medium items-center">
                    <Link href="/" className="hover:text-[#FF5F00] transition-colors">Home</Link>
                    <span className="mx-3 text-gray-300">/</span>
                    <span className="text-[#FF5F00] bg-orange-50 px-3 py-1 rounded-full">Dashboard</span>
                </nav>
            </div>

            {/* Desktop Center - Search */}
            <div className="flex-1 md:flex-initial max-w-md w-full relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#FF5F00] transition-colors" />
                <Input
                    placeholder="Search trips, messages..."
                    className="pl-12 bg-white border border-gray-200 focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00] h-12 transition-all rounded-full font-normal"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-5">
                <Button variant="ghost" size="icon" className="relative group hover:bg-orange-50 text-gray-400 hover:text-[#FF5F00] rounded-full h-11 w-11 transition-all">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-[#FF5F00] ring-2 ring-white animate-pulse" />
                    )}
                </Button>

                <div className="h-8 w-px bg-gray-100 hidden md:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="rounded-full pl-0 pr-3 py-1.5 h-auto hover:bg-orange-50 border border-transparent hover:border-orange-100 gap-3 transition-all">
                            <div className="h-10 w-10 bg-[#FF5F00] rounded-full flex items-center justify-center text-white font-medium shadow-md shadow-orange-500/20 ring-2 ring-white">
                                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="hidden md:flex flex-col items-start">
                                <span className="text-sm font-medium text-gray-800 leading-none mb-1">
                                    {session?.user?.name?.split(' ')[0]}
                                </span>
                                <span className="text-[10px] text-[#FF5F00] uppercase tracking-wider leading-none">
                                    Premium
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-3xl shadow-xl border-gray-100 bg-white">
                        <DropdownMenuLabel className="p-4">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-gray-900">{session?.user?.name}</p>
                                <p className="text-xs leading-none text-gray-500 font-normal">{session?.user?.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-gray-100 my-1" />
                        <DropdownMenuItem asChild>
                            <Link href="/client/profile" className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-orange-50 text-gray-600 hover:text-[#FF5F00] transition-colors font-medium">
                                <User className="h-4 w-4" />
                                <span>My Profile</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/client/bookings" className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-orange-50 text-gray-600 hover:text-[#FF5F00] transition-colors font-medium">
                                <ShoppingBag className="h-4 w-4" />
                                <span>Bookings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/client/wishlist" className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-orange-50 text-gray-600 hover:text-[#FF5F00] transition-colors font-medium">
                                <Heart className="h-4 w-4" />
                                <span>Wishlist</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/client/settings" className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer hover:bg-orange-50 text-gray-600 hover:text-[#FF5F00] transition-colors font-medium">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-gray-100 my-1" />
                        <DropdownMenuItem
                            className="flex items-center gap-3 p-3 rounded-2xl text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-medium"
                            onClick={() => signOut({ callbackUrl: '/' })}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
