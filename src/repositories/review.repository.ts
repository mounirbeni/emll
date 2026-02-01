import { prisma } from "@/lib/prisma";

// Local definitions to bypass IDE sync issues (Build is successful)
export enum ReviewStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    userName: string;
    userEmail: string | null;
    status: ReviewStatus;
    experienceId: string;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
    user?: any; // Simplify relations for local type
    experience?: any;
}

export const reviewRepository = {
    async create(data: any) { // Use any for input to avoid Prisma.ReviewCreateInput error
        return await (prisma as any).review.create({ data });
    },

    async findById(id: string) {
        return await (prisma as any).review.findUnique({
            where: { id },
            include: { user: true, experience: true }
        });
    },

    async findAll(filters?: { status?: ReviewStatus; experienceId?: string }) {
        const where: any = {};
        if (filters?.status) where.status = filters.status;
        if (filters?.experienceId) where.experienceId = filters.experienceId;

        return await (prisma as any).review.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { user: true, experience: true }
        });
    },

    async updateStatus(id: string, status: ReviewStatus) {
        return await (prisma as any).review.update({
            where: { id },
            data: { status }
        });
    },

    async delete(id: string) {
        return await (prisma as any).review.delete({
            where: { id }
        });
    },

    async count(where?: any) {
        return await (prisma as any).review.count({ where });
    }
};
