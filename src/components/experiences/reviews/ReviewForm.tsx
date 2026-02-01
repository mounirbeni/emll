'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import StarRating from './StarRating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
    experienceId: string;
    experienceTitle: string;
    onCancel?: () => void;
}

export default function ReviewForm({
    experienceId,
    experienceTitle,
    onCancel,
}: ReviewFormProps) {
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (!comment.trim()) {
            newErrors.comment = 'Please write your review';
        } else if (comment.trim().length < 30) {
            newErrors.comment = `Review must be at least 30 characters (${comment.trim().length}/30)`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    experienceId,
                    rating,
                    title: title.trim() || undefined,
                    comment: comment.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit review');
            }

            toast.success('Review submitted successfully!');
            router.push(`/experiences/${experienceId}`);
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Failed to submit review'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePreview = () => {
        if (validate()) {
            setShowPreview(true);
        }
    };

    if (showPreview) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Preview Your Review
                </h3>

                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <StarRating rating={rating} size="md" />
                        <span className="text-gray-500">({rating} stars)</span>
                    </div>

                    {title && (
                        <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                    )}

                    <p className="text-gray-600 leading-relaxed">{comment}</p>
                </div>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowPreview(false)}
                    >
                        Edit Review
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#FF6900] hover:bg-[#E55A00] text-white"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        <Send className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                    Review: {experienceTitle}
                </h3>
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handlePreview();
                }}
                className="space-y-6"
            >
                {/* Rating */}
                <div>
                    <Label className="text-base font-medium text-gray-900 mb-3 block">
                        Your Rating *
                    </Label>
                    <div className="flex items-center gap-4">
                        <StarRating
                            rating={rating}
                            size="lg"
                            interactive
                            onChange={setRating}
                        />
                        {rating > 0 && (
                            <span className="text-sm text-gray-500">
                                {rating === 5
                                    ? 'Excellent!'
                                    : rating === 4
                                        ? 'Very Good'
                                        : rating === 3
                                            ? 'Good'
                                            : rating === 2
                                                ? 'Fair'
                                                : 'Poor'}
                            </span>
                        )}
                    </div>
                    {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
                    )}
                </div>

                {/* Title */}
                <div>
                    <Label htmlFor="title" className="text-base font-medium text-gray-900">
                        Review Title (Optional)
                    </Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Sum up your experience in a few words"
                        maxLength={100}
                        className="mt-2"
                    />
                </div>

                {/* Comment */}
                <div>
                    <Label htmlFor="comment" className="text-base font-medium text-gray-900">
                        Your Review *
                    </Label>
                    <Textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience. What did you enjoy? What could be improved? (minimum 30 characters)"
                        rows={6}
                        maxLength={2000}
                        className="mt-2 resize-none"
                    />
                    <div className="flex justify-between mt-1">
                        {errors.comment ? (
                            <p className="text-red-500 text-sm">{errors.comment}</p>
                        ) : (
                            <span />
                        )}
                        <span className="text-sm text-gray-400">
                            {comment.length}/2000
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    {onCancel && (
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    )}
                    <Button
                        type="submit"
                        className="bg-[#FF6900] hover:bg-[#E55A00] text-white"
                    >
                        Preview Review
                    </Button>
                </div>
            </form>
        </div>
    );
}
