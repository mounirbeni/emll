"use client";

import { Clock, CheckCircle2, MessageSquare } from "lucide-react";
import { format } from "date-fns";

// Mock data integration - in real app would come from props/API
const ACTIVITIES = [
    {
        id: 1,
        type: "booking",
        title: "Booking Confirmed",
        description: "Marrakech Medina Tour",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "success"
    },
    {
        id: 2,
        type: "message",
        title: "New Message",
        description: "From Guide Youssef regarding your trip",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        status: "info"
    },
    {
        id: 3,
        type: "system",
        title: "Welcome to Explore Marrakesh",
        description: "Your account has been successfully created",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        status: "success"
    }
];

export function RecentActivity() {
    return (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                </h3>
            </div>

            <div className="space-y-6">
                {ACTIVITIES.map((activity) => (
                    <div key={activity.id} className="relative pl-6 pb-6 last:pb-0 border-l border-gray-100 last:border-0 group">
                        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white group-hover:scale-110 transition-transform" />

                        <div className="flex flex-col gap-1 -mt-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-900">{activity.title}</span>
                                <span className="text-xs text-gray-400 font-medium">
                                    {format(activity.date, "MMM d, h:mm a")}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1">{activity.description}</p>

                            <div className="mt-2 flex items-center gap-2">
                                {activity.type === 'booking' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Booked</span>}
                                {activity.type === 'message' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider"><MessageSquare className="w-3 h-3" /> Message</span>}
                                {activity.type === 'system' && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">System</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
