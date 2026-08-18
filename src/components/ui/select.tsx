import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, required, icon, id, placeholder = "Chọn...", ...props }, ref) => {
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
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
              {icon}
            </div>
          )}
          <select
            id={inputId}
            ref={ref}
            className={cn(
              "flex h-11 w-full rounded-xl border border-brand-border bg-white px-3.5 py-2 text-sm font-medium text-brand-heading placeholder:text-brand-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-plum/20 focus-visible:border-brand-plum disabled:cursor-not-allowed disabled:opacity-50 transition-all appearance-none cursor-pointer pr-10",
              icon && "pl-10",
              error && "border-brand-lost focus-visible:ring-brand-lost/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-muted pointer-events-none" />
        </div>
        {error && <p className="text-xs text-brand-lost font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
