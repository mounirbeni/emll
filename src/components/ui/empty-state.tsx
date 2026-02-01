"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  Package,
  Users,
  Search,
  FileText,
  MessageSquare,
  ShoppingBag,
  Heart,
  Bell,
  Inbox,
  type LucideIcon
} from "lucide-react";
import { Button } from "./button";

const presetIcons: Record<string, LucideIcon> = {
  bookings: Calendar,
  services: Package,
  customers: Users,
  search: Search,
  documents: FileText,
  messages: MessageSquare,
  orders: ShoppingBag,
  wishlist: Heart,
  notifications: Bell,
  inbox: Inbox,
};

interface EmptyStateProps {
  icon?: LucideIcon | keyof typeof presetIcons;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  const IconComponent =
    typeof icon === "string" ? presetIcons[icon] || Inbox : icon || Inbox;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full bg-primary/10 flex items-center justify-center mb-4",
          compact ? "h-12 w-12" : "h-16 w-16"
        )}
      >
        <IconComponent
          className={cn(
            "text-primary",
            compact ? "h-6 w-6" : "h-8 w-8"
          )}
        />
      </div>

      <h3
        className={cn(
          "font-semibold text-foreground",
          compact ? "text-base" : "text-lg"
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            "text-muted-foreground max-w-sm",
            compact ? "text-sm mt-1" : "text-sm mt-2"
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className={cn("flex items-center gap-3", compact ? "mt-4" : "mt-6")}>
          {action && (
            <Button
              onClick={action.onClick}
              className="rounded-xl"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="rounded-xl"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function NoBookingsState({ onCreateBooking }: { onCreateBooking?: () => void }) {
  return (
    <EmptyState
      icon="bookings"
      title="No bookings yet"
      description="When customers book your experiences, they'll appear here."
      action={onCreateBooking ? { label: "Create Booking", onClick: onCreateBooking } : undefined}
    />
  );
}

export function NoServicesState({ onCreateService }: { onCreateService?: () => void }) {
  return (
    <EmptyState
      icon="services"
      title="No services available"
      description="Start by adding your first experience or service to showcase."
      action={onCreateService ? { label: "Add Service", onClick: onCreateService } : undefined}
    />
  );
}

export function NoSearchResultsState({ query, onClear }: { query?: string; onClear?: () => void }) {
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={query ? `We couldn't find anything matching "${query}"` : "Try adjusting your search or filters"}
      action={onClear ? { label: "Clear Search", onClick: onClear } : undefined}
    />
  );
}

export function NoCustomersState() {
  return (
    <EmptyState
      icon="customers"
      title="No customers yet"
      description="Your customer list will grow as people book your experiences."
    />
  );
}

export function NoMessagesState() {
  return (
    <EmptyState
      icon="messages"
      title="No messages"
      description="Customer inquiries and messages will appear here."
    />
  );
}

export function NoWishlistState({ onExplore }: { onExplore?: () => void }) {
  return (
    <EmptyState
      icon="wishlist"
      title="Your wishlist is empty"
      description="Save experiences you love by clicking the heart icon."
      action={onExplore ? { label: "Explore Experiences", onClick: onExplore } : undefined}
    />
  );
}
