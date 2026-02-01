'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Trash2, Star, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Review {
    id: string;
    rating: number;
    title?: string | null;
    comment: string;
    createdAt: string;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
    experience: {
        id: string;
        title: string;
        slug: string;
    };
    booking: {
        id: string;
        date: string;
        userName: string;
    };
}

interface ReviewStats {
    totalReviews: number;
    ratingDistribution: { rating: number; count: number }[];
}

export default function AdminReviewsClient() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [ratingFilter, setRatingFilter] = useState<string>('all');
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (ratingFilter !== 'all') {
                params.set('rating', ratingFilter);
            }
            const response = await fetch(`/api/admin/reviews?${params}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data.reviews || []);
                setStats(data.stats || null);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ratingFilter]);

    const handleDelete = async (reviewId: string) => {
        setDeleting(reviewId);
        try {
            const response = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete review');
            }

            toast.success('Review deleted successfully');
            fetchReviews();
        } catch {
            toast.error('Failed to delete review');
        } finally {
            setDeleting(null);
        }
    };

    const averageRating =
        stats && stats.totalReviews > 0
            ? stats.ratingDistribution.reduce(
                (sum, d) => sum + d.rating * d.count,
                0
            ) / stats.totalReviews
            : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
                    <p className="text-gray-500">Manage customer reviews</p>
                </div>
                <Button variant="outline" onClick={fetchReviews} disabled={loading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border p-4">
                        <div className="text-sm text-gray-500">Total Reviews</div>
                        <div className="text-2xl font-bold">{stats.totalReviews}</div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div className="text-sm text-gray-500">Average Rating</div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold">
                                {averageRating.toFixed(1)}
                            </span>
                            <Star className="w-5 h-5 fill-[#FF6900] text-[#FF6900]" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div className="text-sm text-gray-500">5-Star Reviews</div>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.ratingDistribution.find((d) => d.rating === 5)?.count || 0}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border p-4">
                        <div className="text-sm text-gray-500">Low Ratings (1-2)</div>
                        <div className="text-2xl font-bold text-red-600">
                            {(stats.ratingDistribution.find((d) => d.rating === 1)?.count || 0) +
                                (stats.ratingDistribution.find((d) => d.rating === 2)?.count || 0)}
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Filter by rating:</span>
                </div>
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All ratings</SelectItem>
                        <SelectItem value="5">5 stars</SelectItem>
                        <SelectItem value="4">4 stars</SelectItem>
                        <SelectItem value="3">3 stars</SelectItem>
                        <SelectItem value="2">2 stars</SelectItem>
                        <SelectItem value="1">1 star</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rating</TableHead>
                            <TableHead>Review</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Experience</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                                </TableCell>
                            </TableRow>
                        ) : reviews.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No reviews found
                                </TableCell>
                            </TableRow>
                        ) : (
                            reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating
                                                        ? 'fill-[#FF6900] text-[#FF6900]'
                                                        : 'text-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="max-w-xs">
                                            {review.title && (
                                                <div className="font-medium text-gray-900 truncate">
                                                    {review.title}
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-500 line-clamp-2">
                                                {review.comment}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {review.user?.name || review.booking?.userName || 'Unknown'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {review.user?.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <a
                                            href={`/experiences/${review.experience?.slug}`}
                                            className="text-[#FF6900] hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {review.experience?.title}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(review.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    disabled={deleting === review.id}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. The review will be permanently
                                                        deleted and the experience rating will be recalculated.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(review.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
