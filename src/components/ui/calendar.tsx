"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center mb-1",
        caption_label: "text-sm font-bold text-brand-heading capitalize",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 text-brand-muted hover:text-brand-heading hover:bg-black/5 flex items-center justify-center rounded-lg transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex justify-between",
        head_cell: "text-brand-muted/70 rounded-md w-9 font-semibold text-[0.75rem] text-center uppercase tracking-wider",
        row: "flex w-full mt-1.5 justify-between",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-xl [&:has([aria-selected].day-outside)]:bg-brand-plum/5 [&:has([aria-selected])]:bg-brand-plum/10 first:[&:has([aria-selected])]:rounded-l-xl last:[&:has([aria-selected])]:rounded-r-xl focus-within:relative focus-within:z-20",
        day: cn(
          "h-9 w-9 p-0 font-medium text-brand-heading aria-selected:opacity-100 rounded-xl hover:bg-black/5 transition-colors flex items-center justify-center cursor-pointer"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "!bg-brand-plum !text-white hover:!bg-brand-plum hover:!text-white focus:!bg-brand-plum focus:!text-white font-bold shadow-xs",
        day_today: "bg-brand-soft text-brand-plum font-bold border border-brand-plum/30",
        day_outside:
          "day-outside text-brand-muted/40 opacity-40 aria-selected:bg-brand-plum/10 aria-selected:text-brand-muted aria-selected:opacity-30",
        day_disabled: "text-brand-muted/30 opacity-30 cursor-not-allowed hover:bg-transparent",
        day_range_middle: "aria-selected:bg-brand-plum/10 aria-selected:text-brand-plum",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
