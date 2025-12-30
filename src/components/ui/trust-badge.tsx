import { BadgeCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TrustBadgeProps {
    type?: "verified" | "bestseller" | "popular";
    className?: string;
}

export function TrustBadge({ type = "verified", className }: TrustBadgeProps) {
    if (type === "verified") {
        return (
            <Badge variant="secondary" className={cn("bg-white/90 backdrop-blur-sm text-primary font-semibold flex items-center gap-1 shadow-sm px-2 py-0.5 h-6", className)}>
                <BadgeCheck className="w-3.5 h-3.5 fill-primary text-white" />
                <span className="text-[10px] uppercase tracking-wider">Verified</span>
            </Badge>
        );
    }

    if (type === "bestseller") {
        return (
            <Badge className={cn("bg-amber-500 text-white border-none flex items-center gap-1 shadow-sm px-2 py-0.5 h-6", className)}>
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] uppercase tracking-wider">Best Seller</span>
            </Badge>
        );
    }

    return null;
}
