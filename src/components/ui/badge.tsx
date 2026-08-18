import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        found: "bg-brand-foundBg text-brand-found border border-brand-foundBorder",
        lost: "bg-brand-lostBg text-brand-lost border border-brand-lostBorder",
        matchSuccess:
          "bg-brand-foundBg text-brand-found border border-brand-foundBorder font-semibold text-xs normal-case px-3 py-1 shadow-xs",
        neutral: "bg-brand-cream text-brand-muted border border-brand-border",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
