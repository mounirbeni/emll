import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProfileClient from './profile-client';

export const dynamic = 'force-dynamic';

async function getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            loyaltyPoints: true,
        },
    });

    return user;
}

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const user = await getUserProfile(session.user.id);

    if (!user) {
        redirect('/login');
    }

    return <ProfileClient user={user} />;
}
