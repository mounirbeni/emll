import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/utils/supabase'; // Use admin client for uploads to bypass RLS if needed, or better to ensure write access
import { PaymentStatus, TransactionStatus, PaymentMethod } from '@prisma/client';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Allow upload if user is authenticated
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const bookingId = formData.get('bookingId') as string | null;
        const type = formData.get('type') as string | null; // e.g., 'paymentProof'

        if (!file || !(file instanceof File)) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPG and PNG are allowed.' },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB.' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const timestamp = Date.now();
        // Use user ID in path for better organization/security possibilities
        const fileName = `${session.user.id}/${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
        const bucketName = 'uploads';

        // Convert to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to Supabase
        const { error: uploadError } = await supabaseAdmin.storage
            .from(bucketName)
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload to storage: ' + uploadError.message },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from(bucketName)
            .getPublicUrl(fileName);


        // Handle Booking Payment Proof Update
        if (bookingId && type === 'paymentProof') {
            // Verify booking ownership
            const booking = await prisma.booking.findUnique({
                where: { id: bookingId },
                select: { userId: true, userEmail: true, totalPrice: true }
            });

            if (!booking) {
                return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
            }

            const isOwner = booking.userId === session.user.id || booking.userEmail === session.user.email;
            // Also allow admins? For now strict ownership.
            if (!isOwner) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            // Create Payment record and update Booking
            await prisma.$transaction([
                prisma.payment.create({
                    data: {
                        bookingId,
                        amount: booking.totalPrice, // Assuming full amount for now
                        currency: 'EUR',
                        status: TransactionStatus.PENDING,
                        method: PaymentMethod.BANK_TRANSFER,
                        proofImageUrl: publicUrl,
                    }
                }),
                prisma.booking.update({
                    where: { id: bookingId },
                    data: { paymentStatus: PaymentStatus.PENDING_VERIFICATION }
                })
            ]);
        }

        return NextResponse.json({
            success: true,
            url: publicUrl,
            message: 'File uploaded successfully'
        });

    } catch (err) {
        console.error('Upload handler error:', err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : 'Internal Server Error' },
            { status: 500 }
        );
    }
}
