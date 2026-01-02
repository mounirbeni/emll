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

        // Check if Gmail is configured
        const hasGmailConfig = !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD;
        if (!hasGmailConfig) {
            return NextResponse.json({
                error: 'Gmail not configured',
                configured: false,
                message: 'Please add GMAIL_USER and GMAIL_APP_PASSWORD to .env and restart the server'
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
            configured: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

/**
 * GET: Check email service status
 */
export async function GET() {
    const configured = !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD;
    const gmailUser = process.env.GMAIL_USER;
    const fromEmail = gmailUser ? `Explore Marrakesh <${gmailUser}>` : 'Explore Marrakesh <no-reply@example.com>';

    return NextResponse.json({
        configured,
        fromEmail,
        message: configured
            ? 'Email service is configured and ready'
            : 'GMAIL_USER / GMAIL_APP_PASSWORD not found in environment variables'
    });
}

