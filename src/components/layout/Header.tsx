"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    User, LogOut, LayoutDashboard,
    ShoppingBag, ChevronDown, Compass
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
    { href: "/experiences", label: "Experiences" },
    { href: "/recommendations", label: "Recommendations" },
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/support", label: "Support" },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const isLoading = status === "loading";

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300",
                isScrolled
                    ? "bg-background/95 border-border py-3 shadow-sm backdrop-blur-md"
                    : "bg-background border-transparent py-4"
            )}
        >
            <div className="app-container">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50">
                        {/* Assuming Logo component takes className or similar, 
                 but sticking to simple link wrapper if Logo text is internal */}
                        <div className="flex items-center gap-2">
                            <Compass className="text-primary h-7 w-7" />
                            <span className="text-primary text-xl font-bold tracking-tight">
                                Explore Marrakesh
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-7 md:flex">
                        {navLinks.map((link) => {
                            const isActive =
                                pathname === link.href || pathname?.startsWith(`${link.href}/`);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "hover:text-primary relative py-1 text-sm font-medium transition-colors",
                                        "after:bg-primary after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:rounded-full after:transition-all",
                                        isActive
                                            ? "text-primary after:w-full"
                                            : "text-ink-700 after:w-0 hover:after:w-full"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isLoading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="rounded-full border-gray-200 pl-2 pr-4 bg-white hover:bg-gray-50">
                                        <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center mr-2 text-primary">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="max-w-[100px] truncate">{session.user?.name?.split(' ')[0] || 'User'}</span>
                                        <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/client" className="cursor-pointer">
                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/client/bookings" className="cursor-pointer">
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            My Bookings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-red-600 focus:text-red-600 cursor-pointer"
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button className="rounded-full px-6 font-bold">
                                    Sign In
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle - REMOVED for v12.0 User Hub */}
                    {/* Mobile menu removed - users now access settings via Profile tab in bottom nav */}
                </div>
            </div >


        </header >
    );
}
