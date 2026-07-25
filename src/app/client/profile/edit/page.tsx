import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';

import { EditProfileForm } from './edit-profile-form';

export default async function EditProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) redirect('/login');

    return (
        <MobileAppContainer className="bg-white">
            <MobileTopBar title="Edit Profile" showBack />

            <div className="p-6">
                <EditProfileForm
                    initialName={user.name || ''}
                    email={user.email}
                    initialPhone={user.phone || ''}
                />
            </div>
        </MobileAppContainer>
    );
}
