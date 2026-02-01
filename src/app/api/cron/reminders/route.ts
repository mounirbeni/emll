import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email-client';
import { getEmailTemplate } from '@/lib/email-templates';

// This route should be called by a Cron job (e.g. Vercel Cron or external service)
export async function GET(req: Request) {
    // Verify Cron secret if needed (omitted for simplicity as not requested, but good practice)
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { return new Response('Unauthorized', { status: 401 }); }

    try {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const tomorrowEnd = new Date(tomorrow.getTime() + 60 * 60 * 1000); // 1 hour window

        // Find confirmed bookings for tomorrow ( approx 24h from now)
        // To be more robust, we might query for "Date = Tomorrow" regardless of time if we just run once a day
        // Or if date is DateTime, we check range.
        // Assuming 'date' in booking is the start time.

        // Let's grab all bookings starting between 24h from now and 25h from now to avoid double sending if run hourly?
        // Or better, check specific "reminderSent" flag? Booking model doesn't have it.
        // We'll trust the cron schedule (e.g. daily) and query bookings for the "next day".

        // Simple approach: Bookings where date is tomorrow (calendar date).
        const startOfTomorrow = new Date(now);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
        startOfTomorrow.setHours(0, 0, 0, 0);

        const endOfTomorrow = new Date(startOfTomorrow);
        endOfTomorrow.setHours(23, 59, 59, 999);

        const bookings = await prisma.booking.findMany({
            where: {
                status: 'CONFIRMED',
                date: {
                    gte: startOfTomorrow,
                    lte: endOfTomorrow
                }
            },
            include: {
                experience: true
            } as any
        });

        console.log(`Found ${bookings.length} bookings for reminders.`);

        let sentCount = 0;

        for (const booking of bookings) {
            // Check if we already logged a REMINDER email for this booking to avoid duplicates?
            // For now, assume this runs once daily.

            try {
                const b = booking as any;
                const html = await getEmailTemplate('booking-reminder', {
                    name: b.userName,
                    experienceTitle: b.experience.title,
                    time: new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    meetingPoint: b.experience.meetingPoint || 'Central Square',
                    whatToBring: 'Comfortable shoes, camera, water', // Could be dynamic from experience
                    supportPhone: '+212 555 123 456',
                    bookingId: b.id
                });

                await sendEmail({
                    to: b.userEmail,
                    subject: `Reminder: Your experience tomorrow!`,
                    html,
                    userId: b.id,
                    type: 'REMINDER'
                });
                sentCount++;
            } catch (err) {
                console.error(`Failed to send reminder for booking ${booking.id}`, err);
            }
        }

        return NextResponse.json({ success: true, sent: sentCount });

    } catch (error) {
        console.error('Reminder Cron Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
