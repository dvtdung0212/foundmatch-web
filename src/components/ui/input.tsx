import React, { useEffect, useId, useState } from "react";
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

    const [displayedText, setDisplayedText] = useState(error ?? hint);

    useEffect(() => {
      if (error || hint) {
        setDisplayedText(error ?? hint);
      }
    }, [error, hint]);

    const hasContent = Boolean(error || hint);
    const isError = Boolean(error);

    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1.5"
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
              "w-full rounded-xl border border-brand-border bg-brand-cream/60 px-4 py-3 text-sm text-brand-heading placeholder:text-brand-muted/60 focus:border-brand-plum focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium relative disabled:cursor-not-allowed disabled:bg-slate-100/80 disabled:border-slate-200 disabled:text-slate-500 disabled:opacity-75 disabled:shadow-none",
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
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
            hasContent
              ? "grid-rows-[1fr] opacity-100 mt-1.5"
              : "grid-rows-[0fr] opacity-0 mt-0 pointer-events-none",
          )}
          aria-live="polite"
        >
          <div className="overflow-hidden">
            <p
              className={cn(
                "text-xs font-semibold leading-tight",
                isError ? "text-red-500" : "text-brand-muted text-[11px]",
              )}
            >
              {displayedText}
            </p>
          </div>
        </div>
      </div>
    );
  },
);
Input.displayName = "Input";
