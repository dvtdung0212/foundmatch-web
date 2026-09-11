"use client";

import React, {
  useId,
  useRef,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
  id?: string;
  label?: string;
  length?: number;
  onChange: (value: string) => void;
  value: string;
}

export function OtpInput({
  autoFocus = false,
  className,
  disabled = false,
  error,
  id,
  label,
  length = 6,
  onChange,
  value,
}: OtpInputProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const errorId = error ? `${baseId}-error` : undefined;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into individual characters per slot
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function focusSlot(index: number) {
    const target = inputRefs.current[index];
    if (target) {
      target.focus();
      target.select();
    }
  }

  function handleSlotChange(index: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const clean = raw.replace(/\D/g, "");

    if (!clean) {
      // User deleted character
      const nextDigits = [...digits];
      nextDigits[index] = "";
      onChange(nextDigits.join(""));
      return;
    }

    if (clean.length === 1) {
      // Single digit entered
      const nextDigits = [...digits];
      nextDigits[index] = clean;
      const nextValue = nextDigits.join("");
      onChange(nextValue);

      if (index < length - 1) {
        focusSlot(index + 1);
      }
    } else {
      // Multi-digit entry (paste, autofill, or test change event)
      const startIndex = clean.length >= length ? 0 : index;
      const nextDigits = [...digits];
      for (let i = 0; i < clean.length && startIndex + i < length; i++) {
        nextDigits[startIndex + i] = clean[i];
      }
      const nextValue = nextDigits.join("");
      onChange(nextValue);

      const nextFocus = Math.min(startIndex + clean.length, length - 1);
      focusSlot(nextFocus);
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Current slot is empty, move back and clear previous slot
        e.preventDefault();
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        onChange(nextDigits.join(""));
        focusSlot(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (index > 0) {
        e.preventDefault();
        focusSlot(index - 1);
      }
    } else if (e.key === "ArrowRight") {
      if (index < length - 1) {
        e.preventDefault();
        focusSlot(index + 1);
      }
    }
  }

  function handlePaste(index: number, e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const clean = pasted.replace(/\D/g, "");
    if (!clean) return;

    const startIndex = clean.length >= length ? 0 : index;
    const nextDigits = [...digits];
    for (let i = 0; i < clean.length && startIndex + i < length; i++) {
      nextDigits[startIndex + i] = clean[i];
    }
    const nextValue = nextDigits.join("");
    onChange(nextValue);

    const nextFocus = Math.min(startIndex + clean.length, length - 1);
    focusSlot(nextFocus);
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <label
          className="block text-xs font-bold uppercase tracking-wider text-brand-heading"
          htmlFor={`${baseId}-0`}
          id={`${baseId}-label`}
        >
          {label}
        </label>
      )}

      <div
        aria-describedby={errorId}
        aria-labelledby={label ? `${baseId}-label` : undefined}
        className="flex items-center justify-between gap-2 sm:gap-3"
        role="group"
      >
        {Array.from({ length }).map((_, index) => {
          const isFirst = index === 0;
          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              aria-label={isFirst && label ? undefined : `Số thứ ${index + 1}`}
              autoComplete={isFirst ? "one-time-code" : "off"}
              autoFocus={autoFocus && isFirst}
              className={cn(
                "h-12 w-11 sm:h-14 sm:w-13 text-center text-xl sm:text-2xl font-extrabold text-brand-light rounded-xl border border-brand-border bg-surface-page transition-all outline-none",
                "focus:border-brand-plum focus:bg-surface-card focus:ring-2 focus:ring-primary/20",
                digits[index] && "border-brand-plum border-2 bg-surface-card text-brand-light",
                error && "border-brand-lost text-brand-lost focus:border-brand-lost focus:ring-destructive/20",
                disabled && "cursor-not-allowed opacity-50 bg-surface-muted text-content-muted",
              )}
              disabled={disabled}
              id={`${baseId}-${index}`}
              inputMode="numeric"
              maxLength={isFirst ? length : 1}
              onChange={(e) => handleSlotChange(index, e)}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={(e) => handlePaste(index, e)}
              pattern="[0-9]*"
              type="text"
              value={digits[index]}
            />
          );
        })}
      </div>

      {error && (
        <p className="text-xs font-semibold text-brand-lost" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
