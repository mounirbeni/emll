'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Clock, MapPin, Star, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Experience {
    id: string;
    title: string;
    category: string;
    location: string;
    duration: string;
    price: number;
    currency: string;
    shortDescription: string;
    gallery: string[];
    avgRating: number;
    reviewCount: number;
    slug: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = { EUR: '€', USD: '$', MAD: 'DH' };

export default function WishlistPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/wishlist')
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data)) setExperiences(data);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleRemove = async (id: string) => {
        setRemoving(id);
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ experienceId: id }),
            });
            if (res.ok) {
                setExperiences((prev) => prev.filter((e) => e.id !== id));
                toast.success('Removed from wishlist');
            } else {
                toast.error('Failed to remove');
            }
        } finally {
            setRemoving(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Heart className="h-6 w-6 text-primary fill-primary" />
                    My Wishlist
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {experiences.length === 0
                        ? 'No saved experiences yet'
                        : `${experiences.length} saved experience${experiences.length !== 1 ? 's' : ''}`}
                </p>
            </div>

            {experiences.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-20 text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                    <p className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</p>
                    <p className="text-sm text-muted-foreground mb-6">
                        Save experiences you love to plan your perfect trip
                    </p>
                    <Link href="/experiences">
                        <Button className="rounded-full bg-primary text-white">
                            Browse Experiences
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="group rounded-2xl border border-border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-[4/3] bg-muted">
                                {exp.gallery[0] ? (
                                    <Image
                                        src={exp.gallery[0]}
                                        alt={exp.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                                        <MapPin className="h-8 w-8 text-orange-300" />
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemove(exp.id)}
                                    disabled={removing === exp.id}
                                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white transition-colors"
                                    title="Remove from wishlist"
                                >
                                    {removing === exp.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    ) : (
                                        <Heart className="h-4 w-4 text-primary fill-primary" />
                                    )}
                                </button>
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-white/90 text-foreground text-xs font-medium">
                                        {exp.category}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
                                    {exp.title}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />{exp.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />{exp.location}
                                    </span>
                                </div>
                                {exp.avgRating > 0 && (
                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-medium">{exp.avgRating.toFixed(1)}</span>
                                        <span className="text-xs text-muted-foreground">({exp.reviewCount})</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-bold text-primary">
                                        {CURRENCY_SYMBOLS[exp.currency] ?? exp.currency}{exp.price}
                                        <span className="text-xs font-normal text-muted-foreground ml-1">/ person</span>
                                    </p>
                                    <Link href={`/experiences/${exp.id}`}>
                                        <Button size="sm" className="rounded-full bg-primary text-white text-xs h-8 px-4">
                                            Book Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
