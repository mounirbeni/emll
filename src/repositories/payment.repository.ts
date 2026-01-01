/**
 * Payment Repository
 * Handles all database operations for payments
 */

import prisma from '@/lib/prisma';
import { Payment, Prisma, TransactionStatus } from '@prisma/client';
import { BaseRepository, FindManyOptions } from './base.repository';

export class PaymentRepository implements BaseRepository<
    Payment,
    Prisma.PaymentCreateInput,
    Prisma.PaymentUpdateInput,
    Prisma.PaymentWhereInput
> {
    /**
     * Create a new payment
     */
    async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
        return await prisma.payment.create({ data });
    }

    /**
     * Find payment by ID
     */
    async findById(id: string): Promise<Payment | null> {
        return await prisma.payment.findUnique({
            where: { id },
            include: {
                booking: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        activityTitle: true,
                        totalPrice: true,
                    }
                }
            }
        });
    }

    /**
     * Find many payments with options
     */
    async findMany(options?: FindManyOptions<Prisma.PaymentWhereInput>): Promise<Payment[]> {
        const query: any = {
            where: options?.where,
            skip: options?.skip,
            take: options?.take,
            orderBy: options?.orderBy || { createdAt: 'desc' },
        };

        if (options?.include) {
            query.include = options.include;
        } else if (options?.select) {
            query.select = options.select;
        }

        return await prisma.payment.findMany(query);
    }

    /**
     * Find payments by booking ID
     */
    async findByBookingId(bookingId: string): Promise<Payment[]> {
        return await prisma.payment.findMany({
            where: { bookingId },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Find payments by status
     */
    async findByStatus(status: TransactionStatus): Promise<Payment[]> {
        return await prisma.payment.findMany({
            where: { status },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Get total amount for a booking
     */
    async getTotalForBooking(bookingId: string): Promise<number> {
        const result = await prisma.payment.aggregate({
            where: {
                bookingId,
                status: TransactionStatus.COMPLETED
            },
            _sum: {
                amount: true
            }
        });
        return result._sum.amount || 0;
    }

    /**
     * Get successful payments total
     */
    async getSuccessfulPaymentsTotal(where?: Prisma.PaymentWhereInput): Promise<number> {
        const result = await prisma.payment.aggregate({
            where: {
                ...where,
                status: TransactionStatus.COMPLETED
            },
            _sum: {
                amount: true
            }
        });
        return result._sum.amount || 0;
    }

    /**
     * Update payment
     */
    async update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
        return await prisma.payment.update({
            where: { id },
            data
        });
    }

    /**
     * Update payment status
     */
    async updateStatus(id: string, status: TransactionStatus): Promise<Payment> {
        return await prisma.payment.update({
            where: { id },
            data: { status }
        });
    }

    /**
     * Delete payment
     */
    async delete(id: string): Promise<void> {
        await prisma.payment.delete({
            where: { id }
        });
    }

    /**
     * Count payments
     */
    async count(where?: Prisma.PaymentWhereInput): Promise<number> {
        return await prisma.payment.count({ where });
    }

    /**
     * Check if payment exists
     */
    async exists(id: string): Promise<boolean> {
        const count = await prisma.payment.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Find pending payments
     */
    async findPending(): Promise<Payment[]> {
        return await prisma.payment.findMany({
            where: { status: TransactionStatus.PENDING },
            orderBy: { createdAt: 'asc' },
            include: {
                booking: true
            }
        });
    }

    /**
     * Find failed payments
     */
    async findFailed(): Promise<Payment[]> {
        return await prisma.payment.findMany({
            where: { status: TransactionStatus.FAILED },
            orderBy: { createdAt: 'desc' },
            include: {
                booking: true
            }
        });
    }
}

// Export singleton instance
export const paymentRepository = new PaymentRepository();
