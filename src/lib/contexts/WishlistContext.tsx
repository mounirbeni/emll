"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
    wishlist: string[];
    addToWishlist: (id: string) => void;
    removeFromWishlist: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('marrakech-wishlist');
        if (saved) {
            // eslint-disable-next-line
            setWishlist(JSON.parse(saved));
        }
        setMounted(true);
    }, []);

    // Save to localStorage whenever wishlist changes
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('marrakech-wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, mounted]);

    const addToWishlist = (id: string) => {
        setWishlist(prev => [...prev, id]);
    };

    const removeFromWishlist = (id: string) => {
        setWishlist(prev => prev.filter(item => item !== id));
    };

    const isInWishlist = (id: string) => {
        return wishlist.includes(id);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            wishlistCount: wishlist.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
}
