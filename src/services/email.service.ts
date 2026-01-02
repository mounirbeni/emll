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
        this.fromEmail = gmailUser ? `Explore Marrakesh <${gmailUser}>` : 'Explore Marrakesh <no-reply@example.com>';
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
        } catch (error: any) {
            console.error('❌ Error sending email:', {
                error: error,
                message: error?.message,
                stack: error?.stack,
                to: options.to,
                subject: options.subject
            });
            throw error;
        }
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

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
                <h2>New Booking Received</h2>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <p><strong>Activity:</strong> ${activityTitle}</p>
                <p><strong>Date & Time:</strong> ${formattedDate}</p>
                <p><strong>Guests:</strong> ${guests}</p>
                <p><strong>Total Price:</strong> €${totalPrice.toFixed(2)}</p>
                <hr />
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Customer Email:</strong> ${customerEmail}</p>
            </body>
            </html>
        `;

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

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6; 
                        color: #1f2937; 
                        background-color: #f3f4f6;
                    }
                    .email-wrapper { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: #ffffff;
                    }
                    .header { 
                        background: linear-gradient(135deg, #FF5F00 0%, #E55500 100%);
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0;
                        letter-spacing: -0.5px;
                    }
                    .content { 
                        padding: 40px 30px; 
                        background-color: #ffffff;
                    }
                    .greeting {
                        font-size: 16px;
                        color: #1f2937;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 15px;
                        color: #4b5563;
                        margin-bottom: 30px;
                        line-height: 1.7;
                    }
                    .booking-details { 
                        background: #f9fafb; 
                        border: 1px solid #e5e7eb;
                        border-radius: 8px;
                        padding: 24px; 
                        margin: 30px 0;
                    }
                    .booking-details h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 20px;
                        padding-bottom: 12px;
                        border-bottom: 2px solid #FF5F00;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid #e5e7eb;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 500;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .detail-value {
                        font-weight: 600;
                        color: #111827;
                        font-size: 14px;
                        text-align: right;
                    }
                    .info-box {
                        background: #eff6ff;
                        border-left: 4px solid #3b82f6;
                        padding: 16px 20px;
                        margin: 24px 0;
                        border-radius: 4px;
                    }
                    .info-box p {
                        margin: 0;
                        font-size: 14px;
                        color: #1e40af;
                        line-height: 1.6;
                    }
                    .closing {
                        margin-top: 30px;
                        font-size: 15px;
                        color: #4b5563;
                    }
                    .signature {
                        margin-top: 20px;
                        font-size: 15px;
                        color: #111827;
                        font-weight: 500;
                    }
                    .footer { 
                        text-align: center; 
                        padding: 30px; 
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 13px;
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <div style="padding: 20px 0;">
                    <div class="email-wrapper">
                        <div class="header">
                            <h1>Booking Received</h1>
                        </div>
                        <div class="content">
                            <p class="greeting">Dear ${name},</p>
                            <p class="message">
                                We have received your booking request. We will review it and get back to you as soon as possible with a confirmation or any additional information we may need.
                            </p>
                            
                            <div class="booking-details">
                                <h3>Booking Details</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Activity</span>
                                    <span class="detail-value">${activityTitle}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Date & Time</span>
                                    <span class="detail-value">${formattedDate}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Number of Guests</span>
                                    <span class="detail-value">${guests}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Total Price</span>
                                    <span class="detail-value">€${totalPrice.toFixed(2)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Booking ID</span>
                                    <span class="detail-value">${bookingId}</span>
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <p><strong>What's Next?</strong><br>
                                Our team will review your booking and send you a confirmation email once it's been processed. You will receive an email notification when your booking is confirmed or if we need any additional information.</p>
                            </div>
                            
                            <p class="closing">If you have any questions or need to make changes to your booking, please don't hesitate to contact us.</p>
                            <p class="signature">Best regards,<br>The Explore Marrakesh Team</p>
                        </div>
                        <div class="footer">
                            <p><strong>Explore Marrakesh</strong></p>
                            <p>Your trusted partner for authentic experiences</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

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

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6; 
                        color: #1f2937; 
                        background-color: #f3f4f6;
                    }
                    .email-wrapper { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: #ffffff;
                    }
                    .header { 
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0;
                        letter-spacing: -0.5px;
                    }
                    .content { 
                        padding: 40px 30px; 
                        background-color: #ffffff;
                    }
                    .greeting {
                        font-size: 16px;
                        color: #1f2937;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 15px;
                        color: #4b5563;
                        margin-bottom: 30px;
                        line-height: 1.7;
                    }
                    .booking-details { 
                        background: #f0fdf4; 
                        border: 1px solid #bbf7d0;
                        border-radius: 8px;
                        padding: 24px; 
                        margin: 30px 0;
                    }
                    .booking-details h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 20px;
                        padding-bottom: 12px;
                        border-bottom: 2px solid #10b981;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid #d1fae5;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 500;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .detail-value {
                        font-weight: 600;
                        color: #111827;
                        font-size: 14px;
                        text-align: right;
                    }
                    .info-box {
                        background: #eff6ff;
                        border-left: 4px solid #3b82f6;
                        padding: 16px 20px;
                        margin: 24px 0;
                        border-radius: 4px;
                    }
                    .info-box p {
                        margin: 0;
                        font-size: 14px;
                        color: #1e40af;
                        line-height: 1.6;
                    }
                    .closing {
                        margin-top: 30px;
                        font-size: 15px;
                        color: #4b5563;
                    }
                    .signature {
                        margin-top: 20px;
                        font-size: 15px;
                        color: #111827;
                        font-weight: 500;
                    }
                    .footer { 
                        text-align: center; 
                        padding: 30px; 
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 13px;
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <div style="padding: 20px 0;">
                    <div class="email-wrapper">
                        <div class="header">
                            <h1>Booking Confirmed</h1>
                        </div>
                        <div class="content">
                            <p class="greeting">Dear ${name},</p>
                            <p class="message">
                                Great news! Your booking has been confirmed. We're excited to have you join us for this experience.
                            </p>
                            
                            <div class="booking-details">
                                <h3>Booking Details</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Activity</span>
                                    <span class="detail-value">${activityTitle}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Date & Time</span>
                                    <span class="detail-value">${formattedDate}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Number of Guests</span>
                                    <span class="detail-value">${guests}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Total Price</span>
                                    <span class="detail-value">€${totalPrice.toFixed(2)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Booking ID</span>
                                    <span class="detail-value">${bookingId}</span>
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <p><strong>Important Information</strong><br>
                                We'll send you a reminder 24 hours before your activity. If you have any questions or need to make changes, please contact us as soon as possible.</p>
                            </div>
                            
                            <p class="closing">We're looking forward to providing you with an unforgettable experience!</p>
                            <p class="signature">Best regards,<br>The Explore Marrakesh Team</p>
                        </div>
                        <div class="footer">
                            <p><strong>Explore Marrakesh</strong></p>
                            <p>Your trusted partner for authentic experiences</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

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
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6; 
                        color: #1f2937; 
                        background-color: #f3f4f6;
                    }
                    .email-wrapper { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: #ffffff;
                    }
                    .header { 
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0;
                        letter-spacing: -0.5px;
                    }
                    .content { 
                        padding: 40px 30px; 
                        background-color: #ffffff;
                    }
                    .greeting {
                        font-size: 16px;
                        color: #1f2937;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 15px;
                        color: #4b5563;
                        margin-bottom: 30px;
                        line-height: 1.7;
                    }
                    .receipt { 
                        background: #f0fdf4; 
                        border: 1px solid #bbf7d0;
                        border-radius: 8px;
                        padding: 24px; 
                        margin: 30px 0;
                    }
                    .receipt h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 20px;
                        padding-bottom: 12px;
                        border-bottom: 2px solid #10b981;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid #d1fae5;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 500;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .detail-value {
                        font-weight: 600;
                        color: #111827;
                        font-size: 14px;
                        text-align: right;
                    }
                    .closing {
                        margin-top: 30px;
                        font-size: 15px;
                        color: #4b5563;
                    }
                    .signature {
                        margin-top: 20px;
                        font-size: 15px;
                        color: #111827;
                        font-weight: 500;
                    }
                    .footer { 
                        text-align: center; 
                        padding: 30px; 
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 13px;
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <div style="padding: 20px 0;">
                    <div class="email-wrapper">
                        <div class="header">
                            <h1>Payment Received</h1>
                        </div>
                        <div class="content">
                            <p class="greeting">Dear ${name},</p>
                            <p class="message">
                                Thank you for your payment! We have successfully processed your transaction.
                            </p>
                            
                            <div class="receipt">
                                <h3>Payment Receipt</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Activity</span>
                                    <span class="detail-value">${activityTitle}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Amount Paid</span>
                                    <span class="detail-value">€${amount.toFixed(2)}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Booking ID</span>
                                    <span class="detail-value">${bookingId}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Payment Date</span>
                                    <span class="detail-value">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                            
                            <p class="closing">Your booking is now confirmed and paid. We'll see you soon!</p>
                            <p class="signature">Best regards,<br>The Explore Marrakesh Team</p>
                        </div>
                        <div class="footer">
                            <p><strong>Explore Marrakesh</strong></p>
                            <p>Your trusted partner for authentic experiences</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

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

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6; 
                        color: #1f2937; 
                        background-color: #f3f4f6;
                    }
                    .email-wrapper { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: #ffffff;
                    }
                    .header { 
                        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0;
                        letter-spacing: -0.5px;
                    }
                    .content { 
                        padding: 40px 30px; 
                        background-color: #ffffff;
                    }
                    .greeting {
                        font-size: 16px;
                        color: #1f2937;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 15px;
                        color: #4b5563;
                        margin-bottom: 30px;
                        line-height: 1.7;
                    }
                    .reminder { 
                        background: #eff6ff; 
                        border: 1px solid #bfdbfe;
                        border-radius: 8px;
                        padding: 24px; 
                        margin: 30px 0;
                    }
                    .reminder h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 20px;
                        padding-bottom: 12px;
                        border-bottom: 2px solid #3b82f6;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid #dbeafe;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 500;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .detail-value {
                        font-weight: 600;
                        color: #111827;
                        font-size: 14px;
                        text-align: right;
                    }
                    .info-box {
                        background: #fef3c7;
                        border-left: 4px solid #f59e0b;
                        padding: 16px 20px;
                        margin: 24px 0;
                        border-radius: 4px;
                    }
                    .info-box p {
                        margin: 0;
                        font-size: 14px;
                        color: #92400e;
                        line-height: 1.6;
                    }
                    .closing {
                        margin-top: 30px;
                        font-size: 15px;
                        color: #4b5563;
                    }
                    .signature {
                        margin-top: 20px;
                        font-size: 15px;
                        color: #111827;
                        font-weight: 500;
                    }
                    .footer { 
                        text-align: center; 
                        padding: 30px; 
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 13px;
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <div style="padding: 20px 0;">
                    <div class="email-wrapper">
                        <div class="header">
                            <h1>Activity Reminder</h1>
                        </div>
                        <div class="content">
                            <p class="greeting">Dear ${name},</p>
                            <p class="message">
                                This is a friendly reminder that your activity is scheduled for tomorrow!
                            </p>
                            
                            <div class="reminder">
                                <h3>Activity Details</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Activity</span>
                                    <span class="detail-value">${activityTitle}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Date & Time</span>
                                    <span class="detail-value">${formattedDate}</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Number of Guests</span>
                                    <span class="detail-value">${guests}</span>
                                </div>
                            </div>
                            
                            <div class="info-box">
                                <p><strong>Important:</strong> Please arrive 15 minutes early. If you have any questions or need to make changes, please contact us immediately.</p>
                            </div>
                            
                            <p class="closing">We're looking forward to seeing you!</p>
                            <p class="signature">Best regards,<br>The Explore Marrakesh Team</p>
                        </div>
                        <div class="footer">
                            <p><strong>Explore Marrakesh</strong></p>
                            <p>Your trusted partner for authentic experiences</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

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
        const refundText = refundAmount
            ? `<div class="detail-row">
                <span class="detail-label">Refund Amount</span>
                <span class="detail-value">€${refundAmount.toFixed(2)}</span>
            </div>
            <div class="info-box" style="margin-top: 16px;">
                <p>Your refund will be processed within 5-7 business days and returned to your original payment method.</p>
            </div>`
            : '';

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6; 
                        color: #1f2937; 
                        background-color: #f3f4f6;
                    }
                    .email-wrapper { 
                        max-width: 600px; 
                        margin: 0 auto; 
                        background-color: #ffffff;
                    }
                    .header { 
                        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                        color: white; 
                        padding: 40px 30px; 
                        text-align: center;
                    }
                    .header h1 {
                        font-size: 28px;
                        font-weight: 600;
                        margin: 0;
                        letter-spacing: -0.5px;
                    }
                    .content { 
                        padding: 40px 30px; 
                        background-color: #ffffff;
                    }
                    .greeting {
                        font-size: 16px;
                        color: #1f2937;
                        margin-bottom: 20px;
                    }
                    .message {
                        font-size: 15px;
                        color: #4b5563;
                        margin-bottom: 30px;
                        line-height: 1.7;
                    }
                    .cancellation-details { 
                        background: #fef2f2; 
                        border: 1px solid #fecaca;
                        border-radius: 8px;
                        padding: 24px; 
                        margin: 30px 0;
                    }
                    .cancellation-details h3 {
                        font-size: 18px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 20px;
                        padding-bottom: 12px;
                        border-bottom: 2px solid #ef4444;
                    }
                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 12px 0;
                        border-bottom: 1px solid #fee2e2;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        font-weight: 500;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .detail-value {
                        font-weight: 600;
                        color: #111827;
                        font-size: 14px;
                        text-align: right;
                    }
                    .info-box {
                        background: #eff6ff;
                        border-left: 4px solid #3b82f6;
                        padding: 16px 20px;
                        margin: 24px 0;
                        border-radius: 4px;
                    }
                    .info-box p {
                        margin: 0;
                        font-size: 14px;
                        color: #1e40af;
                        line-height: 1.6;
                    }
                    .closing {
                        margin-top: 30px;
                        font-size: 15px;
                        color: #4b5563;
                    }
                    .signature {
                        margin-top: 20px;
                        font-size: 15px;
                        color: #111827;
                        font-weight: 500;
                    }
                    .footer { 
                        text-align: center; 
                        padding: 30px; 
                        background-color: #f9fafb;
                        border-top: 1px solid #e5e7eb;
                    }
                    .footer p {
                        color: #6b7280;
                        font-size: 13px;
                        margin: 4px 0;
                    }
                </style>
            </head>
            <body>
                <div style="padding: 20px 0;">
                    <div class="email-wrapper">
                        <div class="header">
                            <h1>Booking Cancelled</h1>
                        </div>
                        <div class="content">
                            <p class="greeting">Dear ${name},</p>
                            <p class="message">
                                We're sorry to inform you that your booking has been cancelled.
                            </p>
                            
                            <div class="cancellation-details">
                                <h3>Cancellation Details</h3>
                                <div class="detail-row">
                                    <span class="detail-label">Activity</span>
                                    <span class="detail-value">${activityTitle}</span>
                                </div>
                                ${refundText}
                            </div>
                            
                            <p class="closing">If you have any questions or would like to book a different activity, please don't hesitate to contact us. We hope to see you in the future!</p>
                            <p class="signature">Best regards,<br>The Explore Marrakesh Team</p>
                        </div>
                        <div class="footer">
                            <p><strong>Explore Marrakesh</strong></p>
                            <p>Your trusted partner for authentic experiences</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: `Booking Cancelled: ${activityTitle}`,
            html
        });
    }
}

// Export singleton instance
export const emailService = new EmailService();

