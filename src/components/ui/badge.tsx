import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        found: "bg-[#F3F9F1] text-[#37783C] border border-[#C4E1BE]",
        lost: "bg-[#FFF4F1] text-[#BF403F] border border-[#FFC7BA]",
        matchSuccess:
          "bg-[#F3F9F1] text-[#37783C] border border-[#C4E1BE] font-semibold text-xs normal-case px-3 py-1 shadow-sm",
        neutral: "bg-[#F5EFE6] text-[#7A6E67] border border-[#EFE8DF]",
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
