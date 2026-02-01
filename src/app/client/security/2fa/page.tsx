import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { Switch } from '@/components/ui/switch';
import { Shield, Smartphone } from 'lucide-react';

export default function TwoFactorPage() {
    return (
        <MobileAppContainer className="bg-beige-50">
            <MobileTopBar title="Two-Factor Auth" showBack />

            <div className="p-4 space-y-6">
                <div className="text-center py-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-charcoal">Secure Your Account</h2>
                    <p className="text-gray-500 text-sm mt-2 px-4">
                        Add an extra layer of security by requiring a code from your phone when you sign in.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-charcoal">Text Message (SMS)</p>
                            <p className="text-xs text-gray-400">Receive codes via SMS</p>
                        </div>
                    </div>
                    <Switch />
                </div>

                <div className="p-4 bg-gray-100 rounded-xl">
                    <p className="text-xs text-gray-500 text-center">
                        Note: Authenticator app support is coming soon.
                    </p>
                </div>
            </div>
        </MobileAppContainer>
    );
}
