import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, error, label, checked, onChange, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div>
        <label className="flex items-start gap-2.5 select-none cursor-pointer group">
          <div className="relative flex items-center shrink-0 mt-0.5">
            <input
              type="checkbox"
              id={inputId}
              checked={checked}
              onChange={onChange}
              className="peer sr-only"
              ref={ref}
              {...props}
            />
            <div className="h-5 w-5 rounded-[4px] border border-[#D7C6BE] bg-white peer-checked:bg-brand-plum peer-checked:border-brand-plum peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20 transition-all flex items-center justify-center shadow-sm [&_svg]:opacity-0 peer-checked:[&_svg]:opacity-100">
              <Check className="h-3.5 w-3.5 text-white transition-opacity stroke-[3]" />
            </div>
          </div>
          {label && (
            <span className="text-xs font-medium text-[#7A6E67] leading-relaxed">
              {label}
            </span>
          )}
        </label>
        {error ? (
          <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>
        ) : null}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
