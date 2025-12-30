interface AttentionWidgetProps {
    alerts?: {
        id: string;
        type: 'CRITICAL' | 'WARNING' | 'INFO';
        title: string;
        time: string;
        action: string;
    }[];
}

import React from 'react';
import { AlertCircle, Clock, MessageSquare, ChevronRight } from 'lucide-react';

export const AttentionWidget = ({ alerts }: AttentionWidgetProps) => {
    // Use props if available, otherwise fallback to mock (or empty)
    const items = alerts && alerts.length > 0 ? alerts : [
        { id: '1', type: 'CRITICAL' as const, title: 'No critical items found.', time: 'Now', action: 'Relax' },
    ];

    const pendingCount = items.length;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {items.some(i => i.type === 'CRITICAL') && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                    Attention Required
                </h2>
                <span className="text-xs font-medium bg-rose-100 text-rose-700 px-2 py-1 rounded-full">{pendingCount} Items</span>
            </div>

            <div className="flex-1 overflow-auto p-2">
                {items.map((item) => (
                    <div key={item.id} className="group flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                        <div className="flex items-start gap-3">
                            <div className={`mt-1 p-2 rounded-lg shrink-0 ${item.type === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                }`}>
                                {item.type === 'CRITICAL' ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                <span className="text-xs text-slate-400 font-medium">{item.time}</span>
                            </div>
                        </div>
                        <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                            {item.action}
                        </button>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button className="w-full text-center text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1">
                    View All Alerts <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
