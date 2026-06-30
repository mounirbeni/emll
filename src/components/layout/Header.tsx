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
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white shadow-sm py-3"
                    : "bg-white py-4"
            )}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="relative z-50">
                        {/* Assuming Logo component takes className or similar, 
                 but sticking to simple link wrapper if Logo text is internal */}
                        <div className="flex items-center gap-2">
                            <Compass className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold text-primary">
                                Explore Marrakesh
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-gray-700"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
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
                                <Button className="bg-primary hover:bg-accent text-white rounded-full font-bold px-6 shadow-md shadow-orange-500/20">
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
