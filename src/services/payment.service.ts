/**
 * Payment Service
 * Contains all business logic for payment operations
 */

import { Payment, PaymentCurrency, PaymentMethod, PaymentStatus, TransactionStatus } from '@prisma/client';
import { paymentRepository } from '@/repositories/payment.repository';
import { bookingRepository } from '@/repositories/booking.repository';
import { NotFoundError, BadRequestError } from '@/lib/errors';
import { notificationService } from '@/services/notification.service';
import { decimalToNumber } from '@/lib/decimal';

export interface CreatePaymentDTO {
    bookingId: string;
    amount: number;
    currency?: PaymentCurrency;
    method?: PaymentMethod;
}

export interface ProcessPaymentDTO {
    paymentId: string;
    transactionId?: string;
    metadata?: Record<string, unknown>;
}

export class PaymentService {
    /**
     * Create a new payment
     */
    async createPayment(data: CreatePaymentDTO): Promise<Payment> {
        // Validate booking exists
        const booking = await bookingRepository.findById(data.bookingId);
        if (!booking) {
            throw new NotFoundError('Booking', data.bookingId);
        }

        // Validate amount
        if (data.amount <= 0) {
            throw new BadRequestError('Payment amount must be greater than zero');
        }

        // Check if amount matches booking total
        const totalPaid = await paymentRepository.getTotalForBooking(data.bookingId);
        const remaining = decimalToNumber(booking.totalPrice) - totalPaid;

        if (data.amount > remaining) {
            throw new BadRequestError(
                `Payment amount exceeds remaining balance. Remaining: ${remaining.toFixed(2)}`
            );
        }

        // Create payment
        const payment = await paymentRepository.create({
            booking: { connect: { id: data.bookingId } },
            amount: data.amount,
            currency: data.currency || PaymentCurrency.EUR,
            method: data.method || undefined,
            status: TransactionStatus.PENDING
        });

        return payment;
    }

    /**
     * Process a payment (mark as completed)
     * This is a placeholder for actual payment gateway integration
     */
    async processPayment(data: ProcessPaymentDTO): Promise<Payment> {
        const payment = await paymentRepository.findById(data.paymentId);

        if (!payment) {
            throw new NotFoundError('Payment', data.paymentId);
        }

        if (payment.status !== TransactionStatus.PENDING) {
            throw new BadRequestError(`Cannot process payment with status: ${payment.status}`);
        }

        // TODO: Integrate with actual payment gateway (Stripe, PayPal, etc.)
        // For now, just mark as completed

        const updatedPayment = await paymentRepository.updateStatus(data.paymentId, TransactionStatus.COMPLETED);

        // Update booking payment status if fully paid
        const booking = await bookingRepository.findById(payment.bookingId);
        if (booking) {
            const totalPaid = await paymentRepository.getTotalForBooking(payment.bookingId);

            if (totalPaid >= decimalToNumber(booking.totalPrice)) {
                await bookingRepository.update(payment.bookingId, {
                    paymentStatus: PaymentStatus.PAID
                });
            }
        }


        // Send notification to user
        if (booking && booking.userId) {
            try {
                await notificationService.sendPaymentConfirmation(
                    booking.userId,
                    booking.id,
                    decimalToNumber(payment.amount)
                );
            } catch (error) {
                console.error('Failed to send payment notification:', error);
            }
        }

        return updatedPayment;
    }

    /**
     * Fail a payment
     */
    async failPayment(paymentId: string): Promise<Payment> {
        const payment = await paymentRepository.findById(paymentId);

        if (!payment) {
            throw new NotFoundError('Payment', paymentId);
        }

        if (payment.status !== TransactionStatus.PENDING) {
            throw new BadRequestError(`Cannot fail payment with status: ${payment.status}`);
        }

        return await paymentRepository.updateStatus(paymentId, TransactionStatus.FAILED);
    }

    /**
     * Refund a payment
     */
    async refundPayment(paymentId: string): Promise<Payment> {
        const payment = await paymentRepository.findById(paymentId);

        if (!payment) {
            throw new NotFoundError('Payment', paymentId);
        }

        if (payment.status !== TransactionStatus.COMPLETED) {
            throw new BadRequestError('Can only refund completed payments');
        }

        // TODO: Integrate with payment gateway for actual refund

        // Update payment status (note: schema uses TransactionStatus, not a refund status)
        // We might need to handle refunds differently or track them separately
        // For now, we'll leave the payment as COMPLETED and update booking paymentStatus

        const booking = await bookingRepository.findById(payment.bookingId);
        if (booking) {
            await bookingRepository.update(payment.bookingId, {
                paymentStatus: PaymentStatus.REFUNDED
            });
        }

        return payment;
    }

    /**
     * Get payment by ID
     */
    async getPaymentById(id: string): Promise<Payment> {
        const payment = await paymentRepository.findById(id);

        if (!payment) {
            throw new NotFoundError('Payment', id);
        }

        return payment;
    }

    /**
     * Get payments for a booking
     */
    async getPaymentsByBooking(bookingId: string): Promise<Payment[]> {
        return await paymentRepository.findByBookingId(bookingId);
    }

    /**
     * Get payment status for a booking
     */
    async getBookingPaymentStatus(bookingId: string): Promise<{
        totalPrice: number;
        totalPaid: number;
        remaining: number;
        fullyPaid: boolean;
        payments: Payment[];
    }> {
        const booking = await bookingRepository.findById(bookingId);

        if (!booking) {
            throw new NotFoundError('Booking', bookingId);
        }

        const payments = await paymentRepository.findByBookingId(bookingId);
        const totalPaid = await paymentRepository.getTotalForBooking(bookingId);
        const totalPrice = decimalToNumber(booking.totalPrice);
        const remaining = totalPrice - totalPaid;

        return {
            totalPrice,
            totalPaid,
            remaining: Math.max(0, remaining),
            fullyPaid: remaining <= 0,
            payments
        };
    }

    /**
     * Get pending payments
     */
    async getPendingPayments(): Promise<Payment[]> {
        return await paymentRepository.findPending();
    }

    /**
     * Get failed payments
     */
    async getFailedPayments(): Promise<Payment[]> {
        return await paymentRepository.findFailed();
    }

    /**
     * Get total revenue
     */
    async getTotalRevenue(): Promise<number> {
        return await paymentRepository.getSuccessfulPaymentsTotal();
    }

    /**
     * Delete payment (admin only, use with caution)
     */
    async deletePayment(id: string): Promise<void> {
        const exists = await paymentRepository.exists(id);
        if (!exists) {
            throw new NotFoundError('Payment', id);
        }

        await paymentRepository.delete(id);
    }
}

// Export singleton instance
export const paymentService = new PaymentService();
