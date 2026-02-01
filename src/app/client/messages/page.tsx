import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
    return (
        <MobileAppContainer className="bg-white">
            <MobileTopBar title="Messages" showBack />

            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Messages</h2>
                <p className="text-gray-500 max-w-xs mx-auto mb-8">
                    You don't have any messages yet. Start a conversation with support if you need help!
                </p>

                <a
                    href="/support"
                    className="bg-primary text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
                >
                    Contact Support
                </a>
            </div>
        </MobileAppContainer>
    );
}
