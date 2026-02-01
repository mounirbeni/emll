/**
 * Email Service
 * Handles sending emails for bookings, confirmations, and notifications
 * Uses Nodemailer (Gmail) for email delivery
 */

import nodemailer, { type Transporter } from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export class EmailService {
    private transporter: Transporter | null = null;
    private fromEmail: string;
    private adminEmail: string | null;

    constructor() {
        // In Next.js, environment variables need to be accessed at runtime, not in constructor
        // We'll initialize Nodemailer lazily when sending emails
        const gmailUser = process.env.GMAIL_USER;
        this.fromEmail = gmailUser ? `Explore Marrakesh <${gmailUser}>` : 'Explore Marrakesh <infoexploremarrakesh@gmail.com>';
        this.adminEmail = gmailUser || null;
    }

    private getTransporter(): Transporter | null {
        if (this.transporter) {
            return this.transporter;
        }

        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;

        if (!user || !pass) {
            console.warn('⚠️ Gmail email credentials not found in environment variables. Emails will be logged to console only.');
            console.warn('⚠️ Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in .env and restart the server.');
            return null;
        }

        try {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user,
                    pass
                }
            });
            console.log('✅ Nodemailer Gmail service initialized successfully');
            return this.transporter;
        } catch (error) {
            console.error('❌ Failed to initialize Nodemailer transport:', error);
            return null;
        }
    }

    /**
     * Send an email using Nodemailer
     */
    private async sendEmail(options: EmailOptions): Promise<void> {
        const transporter = this.getTransporter();

        if (!transporter) {
            console.log('📧 Email would be sent (Gmail not configured):', {
                to: options.to,
                subject: options.subject,
            });
            return;
        }

        try {
            console.log('📧 Attempting to send email via Gmail:', {
                to: options.to,
                subject: options.subject,
                from: this.fromEmail
            });

            const info = await transporter.sendMail({
                from: this.fromEmail,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || options.html.replace(/<[^>]*>/g, ''),
            });

            console.log('✅ Email sent successfully via Gmail:', {
                to: options.to,
                subject: options.subject,
                messageId: info.messageId,
                from: this.fromEmail
            });
        } catch (error: unknown) {
            const err = error instanceof Error ? error : new Error(String(error));
            console.error('Γ¥î Error sending email:', {
                error: err,
                message: err.message,
                stack: err.stack,
                to: options.to,
                subject: options.subject
            });
            throw error;
        }
    }

    private getAppBaseUrl(): string {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || '';
        return baseUrl.replace(/\/$/, '');
    }

    private buildAppUrl(path: string): string {
        if (/^https?:\/\//i.test(path)) {
            return path;
        }

        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const baseUrl = this.getAppBaseUrl();
        return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
    }

    private escapeHtml(value: string): string {
        return value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    private renderKeyValueRows(rows: Array<{ label: string; value: string }>): string {
        return rows
            .map(({ label, value }, idx) => {
                const borderTop = idx === 0 ? 'border-top: none;' : 'border-top: 1px solid #F1F5F9;';
                return `
                    <tr>
                        <td style="padding: 12px 0; ${borderTop}">
                            <span style="font-size: 13px; color: #6B7280;">${this.escapeHtml(label)}</span>
                        </td>
                        <td align="right" style="padding: 12px 0; ${borderTop}">
                            <span style="font-size: 13px; font-weight: 700; color: #111827;">${this.escapeHtml(value)}</span>
                        </td>
                    </tr>
                `;
            })
            .join('');
    }

    private renderEmailTemplate(options: {
        title: string;
        preheader: string;
        greetingName?: string;
        messageHtml: string;
        detailsTitle?: string;
        detailsRows?: Array<{ label: string; value: string }>;
        ctaLabel?: string;
        ctaUrl?: string;
        accentColor?: string;
        accentColorDark?: string;
    }): string {
        const accentColor = options.accentColor || '#FF5F00';

        const greetingName = options.greetingName ? this.escapeHtml(options.greetingName) : '';
        const detailsTitle = options.detailsTitle ? this.escapeHtml(options.detailsTitle) : '';
        const ctaUrl = options.ctaUrl ? this.escapeHtml(options.ctaUrl) : '';
        const ctaLabel = options.ctaLabel ? this.escapeHtml(options.ctaLabel) : '';

        const detailsBlock = options.detailsRows && options.detailsRows.length
            ? `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 22px 0 18px; border: 1px solid #E5E7EB; border-radius: 14px; background: #FFFFFF; box-shadow: 0 10px 20px rgba(17, 24, 39, 0.06);">
                    <tr>
                        <td style="padding: 18px 18px 10px;">
                            <div style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #6B7280;">${detailsTitle || 'Details'}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 18px 18px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                ${this.renderKeyValueRows(options.detailsRows)}
                            </table>
                        </td>
                    </tr>
                </table>
            `
            : '';

        const ctaBlock = options.ctaLabel && options.ctaUrl
            ? `
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 18px 0 0;">
                    <tr>
                        <td bgcolor="${accentColor}" style="border-radius: 12px;">
                            <a href="${ctaUrl}" style="display: inline-block; padding: 12px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; text-decoration: none; border-radius: 12px;">
                                ${ctaLabel}
                            </a>
                        </td>
                    </tr>
                </table>
                <div style="margin-top: 10px; font-size: 12px; color: #9CA3AF;">If the button doesn't work, copy and paste this link: <span style="color: ${accentColor};">${ctaUrl}</span></div>
            `
            : '';

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="x-apple-disable-message-reformatting">
                <title>${this.escapeHtml(options.title)}</title>
                <style>
                    body { margin: 0; padding: 0; background-color: #F5F5F5; }
                    table { border-collapse: collapse; }
                    img { border: 0; outline: none; text-decoration: none; }
                    a { color: inherit; }
                    .container { width: 600px; max-width: 600px; }
                    .px { padding-left: 24px; padding-right: 24px; }
                    @media (max-width: 600px) {
                        .container { width: 100% !important; }
                        .px { padding-left: 16px !important; padding-right: 16px !important; }
                        .h1 { font-size: 20px !important; }
                    }
                    .preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; overflow: hidden; mso-hide: all; }
                </style>
            </head>
            <body>
                <div class="preheader">${this.escapeHtml(options.preheader)}</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5;">
                    <tr>
                        <td align="center" style="padding: 28px 12px;">
                            <table role="presentation" class="container" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 18px 50px rgba(17, 24, 39, 0.10);">
                                <tr>
                                    <td style="background: ${accentColor};" class="px">
                                        <div style="padding: 22px 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            <div style="font-size: 18px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.02em;">Explore Marrakesh</div>
                                            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.92); margin-top: 4px;">Your trusted partner for authentic experiences</div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px" style="padding-top: 22px;">
                                        <div class="h1" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 22px; font-weight: 800; color: #111827; line-height: 1.25;">
                                            ${this.escapeHtml(options.title)}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="px" style="padding-top: 14px; padding-bottom: 22px;">
                                        ${greetingName ? `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 15px; color: #111827;">Dear ${greetingName},</div>` : ''}
                                        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; font-size: 14px; line-height: 1.7; color: #374151; margin-top: ${greetingName ? '10px' : '0'};">
                                            ${options.messageHtml}
                                        </div>
                                        ${detailsBlock}
                                        ${ctaBlock}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background: #FAFAFA; border-top: 1px solid #E5E7EB;" class="px">
                                        <div style="padding: 18px 0; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                            <div style="font-size: 12px; color: #6B7280;">Follow us</div>
                                            <div style="margin-top: 10px; font-size: 12px;">
                                                <a href="#" style="color: ${accentColor}; text-decoration: none; margin: 0 8px;">Instagram</a>
                                                <a href="#" style="color: ${accentColor}; text-decoration: none; margin: 0 8px;">Facebook</a>
                                                <a href="#" style="color: ${accentColor}; text-decoration: none; margin: 0 8px;">WhatsApp</a>
                                            </div>
                                            <div style="margin-top: 12px; font-size: 11px; color: #9CA3AF;">© ${new Date().getFullYear()} Explore Marrakesh</div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }

    async sendAdminBookingNotification(
        bookingId: string,
        activityTitle: string,
        date: Date,
        guests: number,
        totalPrice: number,
        customerName: string,
        customerEmail: string
    ): Promise<void> {
        if (!this.adminEmail) {
            console.warn('⚠️ Admin email is not configured. Skipping admin booking notification.');
            return;
        }

        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const html = this.renderEmailTemplate({
            title: 'New booking received',
            preheader: `Booking ${bookingId} received for ${activityTitle}`,
            messageHtml: `<div style="margin: 0;">A new booking request has been received.</div>`,
            detailsTitle: 'Booking details',
            detailsRows: [
                { label: 'Activity', value: activityTitle },
                { label: 'Date & Time', value: formattedDate },
                { label: 'Guests', value: String(guests) },
                { label: 'Total', value: `€${totalPrice.toFixed(2)}` },
                { label: 'Booking ID', value: bookingId },
                { label: 'Customer', value: customerName },
                { label: 'Customer email', value: customerEmail },
            ],
            ctaLabel: 'Open admin bookings',
            ctaUrl: this.buildAppUrl('/admin/bookings'),
        });

        await this.sendEmail({
            to: this.adminEmail,
            subject: `New Booking Received: ${activityTitle}`,
            html
        });
    }

    /**
     * Send booking received email (when booking is created, not yet confirmed)
     */
    async sendBookingReceived(
        email: string,
        name: string,
        bookingId: string,
        activityTitle: string,
        date: Date,
        guests: number,
        totalPrice: number
    ): Promise<void> {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const html = this.renderEmailTemplate({
            title: 'Booking received',
            preheader: `We received your booking for ${activityTitle}`,
            greetingName: name,
            messageHtml: `
                <div style="margin: 0 0 12px;">We’ve received your booking request and our team is reviewing it now.</div>
                <div style="margin: 0;">You’ll get a confirmation email as soon as it’s processed.</div>
            `,
            detailsTitle: 'Booking details',
            detailsRows: [
                { label: 'Activity', value: activityTitle },
                { label: 'Date & Time', value: formattedDate },
                { label: 'Guests', value: String(guests) },
                { label: 'Guests', value: String(guests) },
                { label: 'Total', value: `€${totalPrice.toFixed(2)}` },
                { label: 'Booking ID', value: bookingId },
            ],
            ctaLabel: 'View my bookings',
            ctaUrl: this.buildAppUrl('/bookings'),
            accentColor: '#FF5F00',
            accentColorDark: '#E55500',
        });

        await this.sendEmail({
            to: email,
            subject: `Booking Received: ${activityTitle}`,
            html
        });
    }

    /**
     * Send booking confirmation email (when admin confirms the booking)
     */
    async sendBookingConfirmation(
        email: string,
        name: string,
        bookingId: string,
        activityTitle: string,
        date: Date,
        guests: number,
        totalPrice: number
    ): Promise<void> {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const html = this.renderEmailTemplate({
            title: 'Booking confirmed',
            preheader: `Your booking ${bookingId} is confirmed`,
            greetingName: name,
            messageHtml: `
                <div style="margin: 0 0 12px;">Great news — your booking has been confirmed.</div>
                <div style="margin: 0;">We’re excited to welcome you. You can review your details anytime from your dashboard.</div>
            `,
            detailsTitle: 'Booking details',
            detailsRows: [
                { label: 'Activity', value: activityTitle },
                { label: 'Date & Time', value: formattedDate },
                { label: 'Guests', value: String(guests) },
                { label: 'Total', value: `€${totalPrice.toFixed(2)}` },
                { label: 'Booking ID', value: bookingId },
            ],
            ctaLabel: 'View my bookings',
            ctaUrl: this.buildAppUrl('/bookings'),
            accentColor: '#FF5F00',
            accentColorDark: '#E55500',
        });

        await this.sendEmail({
            to: email,
            subject: `Booking Confirmed: ${activityTitle}`,
            html
        });
    }

    /**
     * Send payment receipt email
     */
    async sendPaymentReceipt(
        email: string,
        name: string,
        bookingId: string,
        amount: number,
        activityTitle: string
    ): Promise<void> {
        const paymentDate = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const html = this.renderEmailTemplate({
            title: 'Payment received',
            preheader: `Payment received for booking ${bookingId}`,
            greetingName: name,
            messageHtml: `
                <div style="margin: 0 0 12px;">Thank you — we’ve successfully processed your payment.</div>
                <div style="margin: 0;">This email serves as your receipt.</div>
            `,
            detailsTitle: 'Payment receipt',
            detailsRows: [
                { label: 'Activity', value: activityTitle },
                { label: 'Amount paid', value: `€${amount.toFixed(2)}` },
                { label: 'Booking ID', value: bookingId },
                { label: 'Payment date', value: paymentDate },
            ],
            ctaLabel: 'View my bookings',
            ctaUrl: this.buildAppUrl('/bookings'),
            accentColor: '#FF5F00',
            accentColorDark: '#E55500',
        });

        await this.sendEmail({
            to: email,
            subject: `Payment Receipt - ${activityTitle}`,
            html
        });
    }

    /**
     * Send booking reminder email (24 hours before)
     */
    async sendBookingReminder(
        email: string,
        name: string,
        activityTitle: string,
        date: Date,
        guests: number
    ): Promise<void> {
        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const html = this.renderEmailTemplate({
            title: 'Reminder: your experience is tomorrow',
            preheader: `Reminder for ${activityTitle} on ${formattedDate}`,
            greetingName: name,
            messageHtml: `
                <div style="margin: 0 0 12px;">This is a friendly reminder that your experience is scheduled for tomorrow.</div>
                <div style="margin: 0;">Please arrive 15 minutes early. If you need to make changes, contact us as soon as possible.</div>
            `,
            detailsTitle: 'Experience details',
            detailsRows: [
                { label: 'Activity', value: activityTitle },
                { label: 'Date & Time', value: formattedDate },
                { label: 'Guests', value: String(guests) },
            ],
            ctaLabel: 'View my bookings',
            ctaUrl: this.buildAppUrl('/bookings'),
            accentColor: '#FF5F00',
            accentColorDark: '#E55500',
        });

        await this.sendEmail({
            to: email,
            subject: `Reminder: ${activityTitle} - Tomorrow`,
            html
        });
    }

    /**
     * Send booking cancellation email
     */
    async sendBookingCancellation(
        email: string,
        name: string,
        activityTitle: string,
        refundAmount?: number
    ): Promise<void> {
        const detailsRows: Array<{ label: string; value: string }> = [
            { label: 'Activity', value: activityTitle },
        ];

        if (refundAmount !== undefined) {
            detailsRows.push({ label: 'Refund amount', value: `€${refundAmount.toFixed(2)}` });
        }

        const messageHtml = refundAmount !== undefined
            ? `
                <div style="margin: 0 0 12px;">Your booking has been cancelled.</div>
                <div style="margin: 0;">Your refund will be processed within 5–7 business days and returned to your original payment method.</div>
            `
            : `
                <div style="margin: 0 0 12px;">Your booking has been cancelled.</div>
                <div style="margin: 0;">If you have questions or would like to book a different experience, reply to this email and we’ll be happy to help.</div>
            `;

        const html = this.renderEmailTemplate({
            title: 'Booking cancelled',
            preheader: `Your booking for ${activityTitle} has been cancelled`,
            greetingName: name,
            messageHtml,
            detailsTitle: 'Cancellation details',
            detailsRows,
            ctaLabel: 'View my bookings',
            ctaUrl: this.buildAppUrl('/bookings'),
            accentColor: '#FF5F00',
            accentColorDark: '#E55500',
        });

        await this.sendEmail({
            to: email,
            subject: `Booking Cancelled: ${activityTitle}`,
            html
        });
    }

    /**
     * Check configuration
     */
    async checkConfiguration(): Promise<{ configured: boolean; fromEmail: string; message: string }> {
        const user = process.env.GMAIL_USER;
        const pass = process.env.GMAIL_APP_PASSWORD;

        if (user && pass) {
            return { configured: true, fromEmail: this.fromEmail, message: 'Gmail service is configured via Nodemailer.' };
        }
        return { configured: false, fromEmail: '', message: 'Missing GMAIL_USER or GMAIL_APP_PASSWORD.' };
    }

    /**
     * Send test email
     */
    async sendTestEmail(to: string): Promise<void> {
        const title = 'Test Email from Admin Panel';
        const html = this.renderEmailTemplate({
            title,
            preheader: 'This is a test email to verify your configuration.',
            messageHtml: '<div>If you are reading this, your email service is working correctly!</div>',
            ctaLabel: 'Visit Website',
            ctaUrl: this.getAppBaseUrl()
        });

        await this.sendEmail({ to, subject: title, html });
    }
    /**
     * Send password reset email
     */
    async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
        const resetUrl = this.buildAppUrl(`/reset-password?token=${resetToken}`);

        const html = this.renderEmailTemplate({
            title: 'Reset your password',
            preheader: 'You requested a password reset',
            messageHtml: `
                <div style="margin: 0 0 12px;">We received a request to reset your password.</div>
                <div style="margin: 0;">Click the button below to choose a new password. If you didn't ask for this, you can safely ignore this email.</div>
            `,
            ctaLabel: 'Reset Password',
            ctaUrl: resetUrl,
            accentColor: '#FF5F00'
        });

        await this.sendEmail({
            to: email,
            subject: 'Reset Your Password',
            html
        });
    }
}

// Export singleton instance
export const emailService = new EmailService();

