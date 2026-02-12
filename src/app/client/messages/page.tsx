import { MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">Chat with support and guides</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center min-h-[400px] flex flex-col items-center justify-center shadow-sm">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Messages</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                    You don't have any messages yet. Start a conversation with support if you need help!
                </p>

                <Link
                    href="/support"
                    className="bg-primary text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:bg-primary-dark transition-all"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    );
}
