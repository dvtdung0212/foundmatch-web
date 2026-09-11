import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, icon, error, hint, ...props }, ref) => {
    const generatedId = useId();
    const inputId = props.id ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            className="block text-xs font-bold text-brand-heading uppercase tracking-wider"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-brand-muted pointer-events-none flex items-center justify-center z-10">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            type={actualType}
            className={cn(
              "w-full rounded-xl border border-brand-border bg-brand-cream/60 px-4 py-3 text-sm text-brand-heading placeholder:text-brand-muted/60 focus:border-brand-plum focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium relative",
              icon && "pl-11",
              isPassword && "pr-11",
              error && "border-red-500 focus:ring-red-500/20",
              className,
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
              className="absolute right-3.5 text-brand-muted hover:text-brand-heading transition-colors p-1 z-20 cursor-pointer flex items-center justify-center"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs font-semibold text-red-500 mt-1">{error}</p>
        )}
        {hint && !error && (
          <p className="text-[11px] text-brand-muted mt-1">{hint}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";
