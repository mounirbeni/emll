import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { Wallet, CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WalletPage() {
    return (
        <MobileAppContainer className="bg-beige-50">
            <MobileTopBar title="Wallet" showBack />

            <div className="p-4 space-y-6">
                {/* Balance Card */}
                <div className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl">
                    <p className="text-gray-400 text-sm mb-1">Current Balance</p>
                    <h1 className="text-4xl font-bold mb-6">€0.00</h1>

                    <div className="flex gap-4">
                        <Button size="sm" className="flex-1 bg-white/10 hover:bg-white/20 border-0 rounded-xl">
                            <Plus className="w-4 h-4 mr-2" /> Top Up
                        </Button>
                        <Button size="sm" className="flex-1 bg-white/10 hover:bg-white/20 border-0 rounded-xl">
                            Withdraw
                        </Button>
                    </div>
                </div>

                {/* Payment Methods */}
                <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h2 className="text-lg font-semibold text-charcoal">Payment Methods</h2>
                        <button className="text-sm text-primary font-medium">Add New</button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                            <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-[8px] text-white font-bold">
                                VISA
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-charcoal">Visa ending in 4242</p>
                                <p className="text-xs text-gray-400">Expires 12/28</p>
                            </div>
                            <div className="w-3 h-3 bg-green-500 rounded-full ring-4 ring-green-100" />
                        </div>
                        <div className="p-4 flex items-center justify-center text-gray-400 text-sm hover:bg-gray-50 transition-colors cursor-pointer">
                            <Plus className="w-4 h-4 mr-2" /> Add a payment method
                        </div>
                    </div>
                </div>
            </div>
        </MobileAppContainer>
    );
}
