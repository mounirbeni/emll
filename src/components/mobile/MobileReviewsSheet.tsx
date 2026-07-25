import { Star, X } from 'lucide-react';
import ReviewCard from '../experiences/reviews/ReviewCard';

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

interface MobileReviewsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    reviews: Review[];
    summary: { avgRating: number; reviewCount: number };
}

export function MobileReviewsSheet({ isOpen, onClose, reviews, summary }: MobileReviewsSheetProps) {
    if (!isOpen) return null;

    return (
        <div className="layer-modal fixed inset-0 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Sheet Content */}
            <div className="absolute inset-x-0 bottom-0 h-[90vh] bg-white rounded-t-3xl overflow-hidden flex flex-col safe-area-bottom shadow-2xl animate-slide-up">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 safe-area-top bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                            <span className="font-bold">{summary.avgRating.toFixed(1)}</span>
                            <span>({summary.reviewCount} reviews)</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                            <ReviewCard review={review} />
                        </div>
                    ))}
                    <div className="h-16" /> {/* Spacer for bottom safe area */}
                </div>
            </div>
        </div>
    )
}
