import nodemailer from 'nodemailer';
import { logEmail } from './email-logger';

// Create a transporter using Gmail SMTP
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    userId?: string; // Optional: Link email to a user for logging
    type?: string;   // Optional: Categorize email type (e.g., "WELCOME", "BOOKING_CONFIRMED")
}

export async function sendEmail({ to, subject, html, userId, type = 'GENERAL' }: SendEmailOptions) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('GMAIL_USER or GMAIL_APP_PASSWORD not set. Email simulation:', { to, subject });
        await logEmail({ userId, type, status: 'FAILED', metadata: { error: 'Missing credentials', to, subject } });
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"Explore Marrakech" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html,
        });

        // Email sent successfully
        await logEmail({ userId, type, status: 'SENT', metadata: { messageId: info.messageId, to } });
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        await logEmail({
            userId,
            type,
            status: 'FAILED',
            metadata: { error: error instanceof Error ? error.message : 'Unknown error', to }
        });
        // We don't throw here to avoid failing the parent request (like booking creation) just because email failed.
        // However, the caller should check the return value if they need to know.
        return null;
    }
}
