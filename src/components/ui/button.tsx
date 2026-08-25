import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-plum text-white hover:bg-brand-dark shadow-sm rounded-xl",
        secondary:
          "border border-brand-border bg-white text-brand-plum hover:bg-brand-cream rounded-xl",
        outline:
          "border border-brand-plum bg-transparent text-brand-plum hover:bg-brand-plum/5 rounded-xl",
        ghost: "bg-transparent text-brand-heading hover:bg-brand-plum/5 rounded-xl",
        google:
          "border border-brand-border bg-white text-brand-heading hover:bg-brand-cream shadow-sm rounded-xl",
        lostAction:
          "bg-brand-lostBg border border-brand-lostBorder text-brand-lost hover:bg-[#FFEBE5] rounded-2xl text-left",
        foundAction:
          "bg-brand-foundBg border border-brand-foundBorder text-brand-found hover:bg-[#E8F4E5] rounded-2xl text-left",
      },
      size: {
        sm: "h-9 px-3.5 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-6 text-base font-bold",
        icon: "h-10 w-10 p-0 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin shrink-0" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
