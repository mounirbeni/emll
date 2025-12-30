/**
 * Centralized Authorization Module
 * Provides reusable authorization helpers for API routes
 */

import { auth } from '@/auth';
import { UnauthorizedError, ForbiddenError } from './errors';
import type { Session } from 'next-auth';

export type UserRole = 'CLIENT' | 'ADMIN' | 'SUPPLIER';

/**
 * Get the current authenticated session
 * Throws UnauthorizedError if no session exists
 */
export async function requireAuth(): Promise<Session> {
    const session = await auth();

    if (!session || !session.user) {
        throw new UnauthorizedError();
    }

    return session;
}

/**
 * Require admin role
 * Throws UnauthorizedError if not logged in
 * Throws ForbiddenError if not admin
 */
export async function requireAdmin(): Promise<Session> {
    const session = await requireAuth();

    if (session.user.role !== 'ADMIN') {
        throw new ForbiddenError('This action requires administrator privileges');
    }

    return session;
}

/**
 * Check if user has a specific role
 */
export function hasRole(session: Session, role: UserRole): boolean {
    return session.user.role === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(session: Session): boolean {
    return hasRole(session, 'ADMIN');
}

/**
 * Require ownership of a resource
 * Admins bypass this check
 */
export async function requireOwnership(
    session: Session,
    resourceUserId: string | null | undefined
): Promise<void> {
    // Admins can access any resource
    if (isAdmin(session)) {
        return;
    }

    // Check if user owns the resource
    if (!resourceUserId || resourceUserId !== session.user.id) {
        throw new ForbiddenError('You can only access your own resources');
    }
}

/**
 * Get authenticated session or null (doesn't throw)
 * Useful for optional authentication
 */
export async function getOptionalAuth(): Promise<Session | null> {
    try {
        return await auth();
    } catch {
        return null;
    }
}

/**
 * Require one of multiple roles
 */
export async function requireAnyRole(roles: UserRole[]): Promise<Session> {
    const session = await requireAuth();

    if (!roles.includes(session.user.role as UserRole)) {
        throw new ForbiddenError(
            `This action requires one of the following roles: ${roles.join(', ')}`
        );
    }

    return session;
}

/**
 * Check if user can modify booking
 * - Admins can modify any booking
 * - Users can only modify their own bookings
 */
export async function canModifyBooking(
    session: Session,
    bookingUserId: string | null | undefined
): Promise<boolean> {
    if (isAdmin(session)) {
        return true;
    }

    return bookingUserId === session.user.id;
}

/**
 * Require permission to modify booking
 */
export async function requireBookingPermission(
    session: Session,
    bookingUserId: string | null | undefined
): Promise<void> {
    if (!await canModifyBooking(session, bookingUserId)) {
        throw new ForbiddenError('You do not have permission to modify this booking');
    }
}
