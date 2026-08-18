import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, required, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

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
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <input
            type="date"
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-xl border border-brand-border bg-white pl-10 pr-3.5 py-2 text-sm font-medium text-brand-heading placeholder:text-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-plum/20 focus-visible:border-brand-plum disabled:cursor-not-allowed disabled:opacity-50 transition-all",
              error && "border-brand-lost focus-visible:ring-brand-lost/20",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-brand-lost font-medium">{error}</p>}
      </div>
    );
  }
);
DatePicker.displayName = "DatePicker";
