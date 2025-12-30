import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authorization';
import { errorResponse } from '@/lib/api-response';
import { emailService } from '@/services/email.service';
import { BadRequestError } from '@/lib/errors';

/**
 * POST: Test email sending
 */
export async function POST(request: Request) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { email } = body;

        if (!email) {
            return errorResponse(new BadRequestError('Email address is required'));
        }

        // Test sending a simple email
        try {
            await emailService.sendBookingConfirmation(
                email,
                'Test User',
                'TEST-123',
                'Test Activity',
                new Date(),
                2,
                100
            );

            return NextResponse.json({
                data: {
                    message: 'Test email sent successfully',
                    email,
                    success: true
                }
            }, { status: 200 });
        } catch (emailError: any) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json({
                error: emailError?.message || 'Failed to send email',
                message: 'Email sending failed. Check server logs for details.',
                email,
                success: false,
                details: process.env.NODE_ENV === 'development' ? emailError?.stack : undefined
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Test email error:', error);
        return errorResponse(error);
    }
}

/**
 * GET: Check email service status
 */
export async function GET() {
    try {
        await requireAdmin();

        const hasApiKey = !!process.env.RESEND_API_KEY;
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Marrakech Tours <onboarding@resend.dev>';

        return NextResponse.json({
            data: {
                configured: hasApiKey,
                fromEmail,
                message: hasApiKey 
                    ? 'Email service is configured and ready' 
                    : 'RESEND_API_KEY not found in environment variables'
            }
        }, { status: 200 });
    } catch (error) {
        console.error('Error checking email status:', error);
        return errorResponse(error);
    }
}

