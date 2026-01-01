import { NextResponse } from 'next/server';
import { emailService } from '@/services/email.service';

/**
 * Simple test endpoint - no authentication required for testing
 * POST: Send a test email
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email address is required' },
                { status: 400 }
            );
        }

        // Check if Resend is configured
        const hasApiKey = !!process.env.RESEND_API_KEY;
        if (!hasApiKey) {
            return NextResponse.json({
                error: 'RESEND_API_KEY not configured',
                configured: false,
                message: 'Please add RESEND_API_KEY to .env and restart the server'
            }, { status: 500 });
        }

        // Send test email
        await emailService.sendBookingConfirmation(
            email,
            'Test User',
            'TEST-123',
            'Test Activity - Email Service',
            new Date(),
            2,
            100
        );

        return NextResponse.json({
            success: true,
            message: `Test email sent successfully to ${email}`,
            configured: true
        });
    } catch (error: any) {
        console.error('Test email error:', error);
        return NextResponse.json({
            error: error.message || 'Failed to send test email',
            configured: !!process.env.RESEND_API_KEY,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

/**
 * GET: Check email service status
 */
export async function GET() {
    const hasApiKey = !!process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Explore Marrakesh <onboarding@resend.dev>';

    return NextResponse.json({
        configured: hasApiKey,
        fromEmail,
        apiKeyPresent: hasApiKey,
        message: hasApiKey
            ? 'Email service is configured and ready'
            : 'RESEND_API_KEY not found in environment variables'
    });
}

