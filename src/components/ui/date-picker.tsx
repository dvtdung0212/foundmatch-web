"use client";

import * as React from "react";
import { format, parseISO, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DatePickerProps {
  value?: string | Date;
  onChange?: (
    eventOrValue: React.ChangeEvent<HTMLInputElement> | string | undefined,
    dateObj?: Date
  ) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledDays?: (date: Date) => boolean;
  error?: string;
  id?: string;
  label?: string;
  required?: boolean;
  name?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
  disabled,
  disabledDays,
  error,
  id,
  label,
  required,
  name,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  // Parse value to Date object
  const dateValue = React.useMemo<Date | undefined>(() => {
    if (!value) return undefined;
    if (value instanceof Date) return isValid(value) ? value : undefined;
    if (typeof value === "string") {
      const parsed = parseISO(value);
      if (isValid(parsed)) return parsed;
      const parsedTimestamp = new Date(value);
      if (isValid(parsedTimestamp)) return parsedTimestamp;
    }
    return undefined;
  }, [value]);

  const handleSelect = (selectedDate?: Date) => {
    const formattedStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
    if (onChange) {
      // Create synthetic event for backward compatibility with (e) => e.target.value
      const syntheticEvent = {
        target: { value: formattedStr, name: name || inputId },
        currentTarget: { value: formattedStr, name: name || inputId },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      (onChange as any)(syntheticEvent, selectedDate);
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSelect(undefined);
  };

  const handleToday = () => {
    handleSelect(new Date());
  };

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-brand-heading"
        >
          {label} {required && <span className="text-brand-lost">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={inputId}
            disabled={disabled}
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-xl border border-brand-border bg-white px-3.5 text-sm font-medium text-brand-heading transition-all hover:border-brand-plum/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-brand-plum disabled:cursor-not-allowed disabled:opacity-50",
              !dateValue && "text-brand-muted font-normal",
              error && "border-brand-lost focus:ring-destructive/20",
              className
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CalendarIcon className="h-4 w-4 shrink-0 text-brand-muted" />
              <span className="truncate">
                {dateValue ? format(dateValue, "dd/MM/yyyy") : placeholder}
              </span>
            </div>

            {dateValue && !disabled && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => e.key === "Enter" && handleClear(e as any)}
                className="p-1 rounded-full text-brand-muted hover:text-brand-heading hover:bg-black/5 transition-colors"
                title="Xóa ngày đã chọn"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={handleSelect}
            disabled={disabledDays}
            initialFocus
            locale={vi}
          />
          <div className="flex items-center justify-between border-t border-brand-border/60 px-4 py-2.5 bg-brand-cream/40 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-semibold text-brand-muted hover:text-brand-lost transition-colors"
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={handleToday}
              className="text-xs font-bold text-brand-plum hover:underline"
            >
              Hôm nay
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {error && <p className="text-xs text-brand-lost font-medium">{error}</p>}
    </div>
  );
}

DatePicker.displayName = "DatePicker";
