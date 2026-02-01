import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { MobileAppContainer } from '@/components/mobile/MobileAppContainer';
import { MobileTopBar } from '@/components/mobile/MobileTopBar';
import { Award, TrendingUp, History, Star, ShieldCheck } from 'lucide-react';
import { UserHubSection } from '@/components/mobile/UserHubSection';

export const dynamic = 'force-dynamic';

export default async function MembershipPage() {
    const session = await auth();
    if (!session?.user?.id) redirect('/login');

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            pointsHistory: {
                orderBy: { createdAt: 'desc' },
                take: 20
            }
        }
    });

    if (!user) redirect('/login');

    // Calculate tier (simple logic for now)
    const points = user.loyaltyPoints || 0;
    const tier = points >= 1000 ? 'Gold' : points >= 500 ? 'Silver' : 'Bronze';
    const nextTier = points >= 1000 ? null : points >= 500 ? 1000 : 500;
    const progress = nextTier ? Math.min(100, (points / nextTier) * 100) : 100;

    return (
        <MobileAppContainer className="bg-beige-50 pb-20">
            <MobileTopBar title="Member Benefits" showBack />

            <div className="p-4 space-y-6">
                {/* Hero Card */}
                <div className="bg-primary rounded-3xl p-6 text-white shadow-lg shadow-primary/20">
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <p className="text-white/80 font-medium mb-1">Total Points</p>
                            <h1 className="text-4xl font-bold">{points}</h1>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                            <span className="font-semibold text-sm">{tier} Member</span>
                        </div>
                    </div>

                    {nextTier && (
                        <div>
                            <div className="flex justify-between text-xs text-white/80 mb-2">
                                <span>Current Progress</span>
                                <span>{nextTier - points} to {tier === 'Bronze' ? 'Silver' : 'Gold'}</span>
                            </div>
                            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Benefits Grid */}
                <div>
                    <h2 className="text-lg font-semibold text-charcoal mb-4 px-2">Your Rewards</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-sm">Best Price</h3>
                            <p className="text-xs text-gray-500">Guaranteed rates</p>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                                <Award className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-sm">Priority</h3>
                            <p className="text-xs text-gray-500">Support access</p>
                        </div>
                    </div>
                </div>

                {/* How to Earn */}
                <UserHubSection title="How to Earn">
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-charcoal">Complete Experiences</p>
                                <p className="text-sm text-gray-500">Get +100 points per booking</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                                <Star className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-charcoal">Leave a Review</p>
                                <p className="text-sm text-gray-500">Get +50 points (Coming Soon)</p>
                            </div>
                        </div>
                    </div>
                </UserHubSection>

                {/* History */}
                <UserHubSection title="Points History">
                    {user.pointsHistory && user.pointsHistory.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {user.pointsHistory.map((history) => (
                                <div key={history.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-charcoal text-sm">{history.reason}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(history.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-green-600 font-semibold text-sm">+{history.points}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No history yet. Book your first trip!
                        </div>
                    )}
                </UserHubSection>
            </div>
        </MobileAppContainer>
    );
}
