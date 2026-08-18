import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, required, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={inputId}
              className="block text-xs font-bold text-brand-heading"
            >
              {label} {required && <span className="text-brand-lost">*</span>}
            </label>
            {hint && <span className="text-[11px] text-brand-muted font-mono">{hint}</span>}
          </div>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "flex min-h-[90px] w-full rounded-xl border border-brand-border bg-white px-3.5 py-2.5 text-sm text-brand-heading placeholder:text-brand-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-plum/20 focus-visible:border-brand-plum disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-brand-lost focus-visible:ring-brand-lost/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-brand-lost font-medium">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
