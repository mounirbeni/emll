import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

export default function PasswordPage() {
    return (
        <MobileAppContainer className="bg-white">
            <MobileTopBar title="Change Password" showBack />

            <div className="p-6">
                <form className="space-y-6">
                    <div className="bg-orange-50 p-4 rounded-xl text-sm text-orange-800 border border-orange-100 mb-6">
                        Use a strong password with at least 8 characters, including numbers and symbols.
                    </div>

                    <div className="space-y-2">
                        <Label>Current Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="password"
                                className="pl-9 h-11 rounded-xl bg-gray-50 hover:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="password"
                                className="pl-9 h-11 rounded-xl bg-gray-50 hover:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="password"
                                className="pl-9 h-11 rounded-xl bg-gray-50 hover:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-8">
                        <Button className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-accent shadow-brand">
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>
        </MobileAppContainer>
    );
}
