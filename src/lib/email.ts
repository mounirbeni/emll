
import nodemailer from 'nodemailer';

// Configure transporter
// In production, these should be env variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // fallback
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('SMTP credentials not found. Email simulation:', { to, subject });
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Marrakech Experiences" <noreply@marrakech-experiences.com>',
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw to prevent booking failure just because email failed
    }
}

export const EMAIL_TEMPLATES = {
    adminNotification: (booking: any) => `
    <h2>New Booking Received!</h2>
    <p><strong>Customer:</strong> ${booking.userName}</p>
    <p><strong>Experience:</strong> ${booking.experience.title}</p>
    <p><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</p>
    <p><strong>People:</strong> ${booking.numberOfPeople}</p>
    <p><strong>Total:</strong> ${booking.totalPrice}€</p>
    <br/>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings/${booking.id}">View Booking in Admin Panel</a>
  `,
    customerConfirmation: (booking: any) => `
    <h2>Booking Confirmation</h2>
    <p>Hi ${booking.userName},</p>
    <p>Thank you for booking with us! Here are your details:</p>
    <ul>
      <li><strong>Experience:</strong> ${booking.experience.title}</li>
      <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString()}</li>
      <li><strong>People:</strong> ${booking.numberOfPeople}</li>
      <li><strong>Total Price:</strong> ${booking.totalPrice}€</li>
    </ul>
    <p>Status: <strong>${booking.status}</strong></p>
    <p>If you have any questions, reply to this email.</p>
  `
};
