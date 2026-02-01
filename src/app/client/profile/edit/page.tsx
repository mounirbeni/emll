import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
                <form action="/api/client/profile/update" method="POST" className="space-y-6">
                    {/* Just a UI form for now as the action is server-side in actions.ts, 
                        but wrapping in client component would be better for interactivity.
                        For this task, I'll use the profile-client approach we built earlier 
                        but adapted to this standalone page if needed. 
                        Actually, let's just make a simple client wrapper or use the existing component logic.
                    */}

                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                name="name"
                                defaultValue={user.name || ''}
                                className="pl-9 h-11 rounded-xl bg-gray-50 hover:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                defaultValue={user.email}
                                disabled
                                className="pl-9 h-11 rounded-xl bg-gray-100 text-gray-500"
                            />
                        </div>
                        <p className="text-xs text-gray-400">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                name="phone"
                                defaultValue={user.phone || ''}
                                placeholder="+212..."
                                className="pl-9 h-11 rounded-xl bg-gray-50 hover:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-accent shadow-lg shadow-orange-500/20">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </MobileAppContainer>
    );
}
