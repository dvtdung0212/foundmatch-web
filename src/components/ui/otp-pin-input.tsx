"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface OtpPinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function OtpPinInput({
  length = 6,
  value = "",
  onChange,
  disabled = false,
  error = false,
  autoFocus = true,
  className,
}: OtpPinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      if (newDigits[index]) {
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else if (index > 0) {
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const rawVal = e.target.value;
    const digit = rawVal.replace(/\D/g, "").slice(-1);

    if (!digit) {
      const newDigits = [...digits];
      newDigits[index] = "";
      onChange(newDigits.join(""));
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = digit;
    const combined = newDigits.slice(0, length).join("");
    onChange(combined);

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (!pasted) return;

    const trimmed = pasted.slice(0, length);
    onChange(trimmed);

    const nextFocusIndex = Math.min(trimmed.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div
      className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}
      role="group"
      aria-label="Nhập mã xác thực OTP"
    >
      {Array.from({ length }).map((_, index) => {
        const char = digits[index] || "";
        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={char}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-12 w-10 sm:h-14 sm:w-12 text-center text-lg sm:text-xl font-bold text-brand-heading",
              "rounded-xl border border-brand-border bg-brand-cream/60 transition-all outline-none",
              "focus:border-brand-plum focus:bg-white focus:ring-2 focus:ring-primary/20",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-600",
              disabled && "cursor-not-allowed opacity-50 bg-slate-100",
            )}
            aria-label={`Ký tự số ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
