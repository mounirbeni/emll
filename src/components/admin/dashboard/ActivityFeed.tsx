import React from 'react';

export const ActivityFeed = () => {
    const activities = [
        { id: 1, user: 'John D.', action: 'booked', target: 'Desert Safari', time: '2m ago' },
        { id: 2, user: 'Marketing', action: 'sent', target: 'Newsletter Campaign', time: '15m ago' },
        { id: 3, user: 'System', action: 'updated', target: 'Exchange Rates', time: '1h ago' },
        { id: 4, user: 'Ali (Guide)', action: 'completed', target: 'Medina Tour', time: '1h ago' },
    ];

    return (
        <div className="space-y-8 pr-4 h-[350px] overflow-y-auto custom-scrollbar">
            {activities.map((item) => (
                <div key={item.id} className="flex items-center">
                    <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {item.user} <span className="text-muted-foreground font-normal">{item.action}</span> {item.target}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {item.time}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
