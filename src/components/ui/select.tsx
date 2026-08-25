"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  id?: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  "aria-label"?: string;
}

export function Select({
  id,
  label,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Chọn...",
  className,
  triggerClassName,
  error,
  hint,
  required,
  disabled,
  icon,
  "aria-label": ariaLabel,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedValue = value !== undefined ? value : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleSelect = (val: string) => {
    if (disabled) return;
    if (value === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);
    setOpen(false);
  };

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("w-full space-y-1.5 text-left", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-brand-heading uppercase tracking-wide"
        >
          {label} {required && <span className="text-brand-lost">*</span>}
        </label>
      )}

      <div ref={containerRef} className="relative w-full">
        {/* Trigger Button */}
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel || label}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-brand-border bg-white px-3.5 py-2 text-sm font-semibold text-brand-heading transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-plum/20 focus:border-brand-plum disabled:cursor-not-allowed disabled:opacity-50",
            icon && "pl-10",
            error && "border-brand-lost focus:ring-brand-lost/20",
            open && "border-brand-plum ring-2 ring-brand-plum/20",
            triggerClassName
          )}
        >
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none">
              {icon}
            </div>
          )}

          <span
            className={cn(
              "truncate block text-left",
              !selectedOption && "text-brand-muted/70 font-normal"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDown
            className={cn(
              "h-4 w-4 text-brand-muted shrink-0 transition-transform duration-200 ml-2",
              open && "rotate-180 text-brand-plum"
            )}
          />
        </button>

        {/* Floating Dropdown Options Menu */}
        {open && (
          <div className="absolute z-[100] mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-brand-border bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-100 hide-scrollbar">
            {options.length === 0 ? (
              <div className="p-3 text-center text-xs text-brand-muted">
                Không có lựa chọn nào
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === selectedValue;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-left",
                      isSelected
                        ? "bg-brand-cream/80 text-brand-plum font-bold"
                        : "text-brand-heading hover:bg-brand-cream/50"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-brand-plum shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-brand-lost font-medium mt-1">{error}</p>}
      {hint && !error && (
        <p className="text-[11px] text-brand-muted mt-1">{hint}</p>
      )}
    </div>
  );
}
