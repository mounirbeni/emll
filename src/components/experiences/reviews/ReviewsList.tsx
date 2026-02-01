'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Review {
    id: string;
    rating: number;
    title?: string | null;
    comment: string;
    images?: string[];
    userName: string;
    verified?: boolean;
    createdAt: Date | string;
}

interface ReviewsListProps {
    experienceId: string;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export default function ReviewsList({ experienceId }: ReviewsListProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState<SortOption>('newest');
    const [summary, setSummary] = useState({ avgRating: 0, reviewCount: 0 });

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/reviews/${experienceId}?sort=${sort}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data.reviews || []);
                    setSummary(data.summary || { avgRating: 0, reviewCount: 0 });
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [experienceId, sort]);

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/3" />
                <div className="h-24 bg-gray-200 rounded" />
                <div className="h-24 bg-gray-200 rounded" />
            </div>
        );
    }

    // Don't show section if no reviews
    if (summary.reviewCount === 0) {
        return null;
    }

    // Calculate rating distribution
    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach((r) => {
            distribution[r.rating - 1]++;
        });
        return distribution;
    };

    const distribution = getRatingDistribution();

    return (
        <section className="mb-12 border-t border-gray-100 pt-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Reviews{' '}
                    <span className="text-gray-500 font-normal">
                        ({summary.reviewCount})
                    </span>
                </h2>
                <Select
                    value={sort}
                    onValueChange={(value) => setSort(value as SortOption)}
                >
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="oldest">Oldest first</SelectItem>
                        <SelectItem value="highest">Highest rating</SelectItem>
                        <SelectItem value="lowest">Lowest rating</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Summary */}
            <div className="flex items-start gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
                {/* Average Rating */}
                <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                        {summary.avgRating.toFixed(1)}
                    </div>
                    <StarRating rating={summary.avgRating} size="md" />
                    <div className="text-sm text-gray-500 mt-1">
                        {summary.reviewCount} review{summary.reviewCount !== 1 ? 's' : ''}
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = distribution[rating - 1];
                        const percentage =
                            summary.reviewCount > 0
                                ? (count / summary.reviewCount) * 100
                                : 0;

                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-sm font-medium text-gray-700">
                                        {rating}
                                    </span>
                                    <Star className="w-3 h-3 fill-[#FF6900] text-[#FF6900]" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#FF6900] rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-8">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reviews List */}
            <div className="divide-y divide-gray-100">
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </div>
        </section>
    );
}
