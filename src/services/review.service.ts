import { Review, ReviewStatus, reviewRepository } from "@/repositories/review.repository";
import { adminNotificationService } from "@/services/admin-notification.service";
import { prisma } from "@/lib/prisma";

export interface CreateReviewDTO {
    experienceId: string;
    userId?: string;
    userName: string;
    userEmail?: string;
    rating: number;
    comment: string;
}

export const reviewService = {
    async createReview(data: CreateReviewDTO): Promise<Review> {
        // Create review
        const review = await reviewRepository.create({
            rating: data.rating,
            comment: data.comment,
            userName: data.userName,
            userEmail: data.userEmail,
            status: ReviewStatus.PENDING,
            experience: { connect: { id: data.experienceId } },
            user: data.userId ? { connect: { id: data.userId } } : undefined
        });

        // Get experience title for notification
        const experience = await prisma.experience.findUnique({
            where: { id: data.experienceId },
            select: { title: true }
        });

        const experienceTitle = experience?.title || 'Unknown Experience';

        // Trigger Admin Notification
        try {
            await adminNotificationService.notifyNewReview(
                data.userName,
                data.rating,
                experienceTitle,
                review.id
            );
        } catch (error) {
            console.error('[REVIEW_SERVICE] Failed to send admin notification', error);
        }

        return review;
    },

    async getReviewsByExperience(experienceId: string) {
        return await reviewRepository.findAll({ experienceId, status: ReviewStatus.APPROVED });
    },

    async getPendingReviews() {
        return await reviewRepository.findAll({ status: ReviewStatus.PENDING });
    },

    async approveReview(id: string) {
        return await reviewRepository.updateStatus(id, ReviewStatus.APPROVED);
    },

    async rejectReview(id: string) {
        return await reviewRepository.updateStatus(id, ReviewStatus.REJECTED);
    }
};
