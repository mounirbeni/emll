import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface InfoCardProps {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    className?: string;
}

/**
 * InfoCard Component
 * 
 * Reusable card for displaying information sections with icons.
 * Luxury design with consistent spacing and typography.
 */
export function InfoCard({ icon: Icon, title, children, className = "" }: InfoCardProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF5F00]/10 rounded-lg">
                    <Icon className="h-5 w-5 text-[#FF5F00]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            </div>
            <div className="text-muted-foreground leading-relaxed pl-11">
                {children}
            </div>
        </div>
    );
}
