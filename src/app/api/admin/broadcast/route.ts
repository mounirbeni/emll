import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email-client';
import { getEmailTemplate } from '@/lib/email-templates';
import { z } from 'zod';

import { UserRole, Prisma } from '@prisma/client';

// Schema for broadcast request
const broadcastSchema = z.object({
    subject: z.string().min(1),
    message: z.string().min(1),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    targetRole: z.enum(['ALL', 'CUSTOMER', 'ADMIN']).default('ALL'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = broadcastSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                error: 'Invalid input',
                details: result.error.flatten()
            }, { status: 400 });
        }

        const { subject, message, ctaText, ctaLink, targetRole } = result.data;

        // Fetch users based on target
        const whereClause: Prisma.UserWhereInput =
            targetRole === 'ALL'
                ? {}
                : { role: targetRole as UserRole };

        const consumers = await prisma.user.findMany({
            where: whereClause,
            select: { id: true, email: true, name: true }
        });

        console.log(`Sending broadcast "${subject}" to ${consumers.length} users...`);

        // Send emails in batches to avoid overwhelming SMTP
        const BATCH_SIZE = 20;
        let sentCount = 0;

        for (let i = 0; i < consumers.length; i += BATCH_SIZE) {
            const batch = consumers.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (user) => {
                try {
                    const html = await getEmailTemplate('announcement', {
                        name: user.name || 'Traveler',
                        subject,
                        message,
                        ctaText: ctaText || '',
                        ctaLink: ctaLink || '',
                        unsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe?email=${user.email}`
                    });

                    await sendEmail({
                        to: user.email,
                        subject,
                        html,
                        userId: user.id,
                        type: 'BROADCAST'
                    });
                    sentCount++;
                } catch (err) {
                    console.error(`Failed to send broadcast to ${user.email}`, err);
                }
            }));
        }

        return NextResponse.json({ success: true, count: sentCount, total: consumers.length });
    } catch (error) {
        console.error('Broadcast error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
