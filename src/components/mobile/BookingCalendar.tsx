"use client";

import { useMemo, useState } from "react";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isBefore,
    isSameDay,
    isSameMonth,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Month picker for the booking flow.
 *
 * Purpose-built rather than react-day-picker: the shared Calendar sizes its
 * cells from an intrinsic `--cell-size`, which on a narrow phone produced very
 * tall rows, large dead gaps, and a grid that could outgrow its card. Here the
 * grid is a plain 7-column layout, so every row is the same height and the
 * whole month always fits its container.
 */

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function BookingCalendar({
    selected,
    onSelect,
    minDate,
    className,
}: {
    selected?: Date;
    onSelect: (date: Date) => void;
    /** Earliest selectable day; defaults to today. */
    minDate?: Date;
    className?: string;
}) {
    const today = startOfDay(new Date());
    const floor = startOfDay(minDate ?? today);

    const [viewMonth, setViewMonth] = useState<Date>(() =>
        startOfMonth(selected ?? floor)
    );

    // Always render whole weeks so every row has exactly seven cells.
    const days = useMemo(() => {
        const gridStart = startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 0 });
        const gridEnd = endOfWeek(endOfMonth(viewMonth), { weekStartsOn: 0 });
        return eachDayOfInterval({ start: gridStart, end: gridEnd });
    }, [viewMonth]);

    // Don't let the traveller page back past the first bookable month.
    const canGoBack = isBefore(startOfMonth(floor), startOfMonth(viewMonth));

    return (
        <div className={cn("w-full", className)}>
            {/* Month navigation */}
            <div className="mb-3 flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => canGoBack && setViewMonth((m) => subMonths(m, 1))}
                    disabled={!canGoBack}
                    aria-label="Previous month"
                    className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                        canGoBack
                            ? "text-ink-700 hover:bg-ink-100"
                            : "text-ink-300 cursor-not-allowed"
                    )}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                <span aria-live="polite" className="text-base font-semibold">
                    {format(viewMonth, "MMMM yyyy")}
                </span>

                <button
                    type="button"
                    onClick={() => setViewMonth((m) => addMonths(m, 1))}
                    aria-label="Next month"
                    className="text-ink-700 hover:bg-ink-100 flex h-11 w-11 items-center justify-center rounded-full transition-colors"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Weekday header */}
            <div className="mb-1 grid grid-cols-7">
                {WEEKDAYS.map((d) => (
                    <div
                        key={d}
                        className="text-ink-400 py-1 text-center text-xs font-semibold uppercase tracking-wide"
                    >
                        {d}
                    </div>
                ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-1">
                {days.map((day) => {
                    const outside = !isSameMonth(day, viewMonth);
                    const disabled = isBefore(day, floor);
                    const isSelected = selected ? isSameDay(day, selected) : false;
                    const isToday = isSameDay(day, today);

                    return (
                        <div key={day.toISOString()} className="flex justify-center py-0.5">
                            <button
                                type="button"
                                data-day={format(day, "yyyy-MM-dd")}
                                disabled={disabled}
                                aria-label={format(day, "EEEE, MMMM d, yyyy")}
                                aria-pressed={isSelected}
                                aria-current={isToday ? "date" : undefined}
                                onClick={() => !disabled && onSelect(day)}
                                className={cn(
                                    "flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors",
                                    disabled && "text-ink-300 cursor-not-allowed",
                                    !disabled && !isSelected && "text-foreground hover:bg-brand-50 active:scale-95",
                                    // Outside days stay in the grid for alignment but recede.
                                    !disabled && outside && !isSelected && "text-ink-400",
                                    isSelected && "bg-primary font-bold text-white",
                                    !isSelected && isToday && "ring-brand-300 font-semibold ring-1"
                                )}
                            >
                                {format(day, "d")}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
