import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  icon?: LucideIcon | React.ElementType;
  iconClass?: string;
  label: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
  noteClass?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  icon: Icon,
  iconClass,
  label,
  value,
  note,
  noteClass,
  onClick,
  className,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white border border-brand-border rounded-2xl p-5 flex flex-col justify-between transition-all",
        onClick && "cursor-pointer hover:border-brand-plum/40 hover:shadow-xs group",
        className
      )}
    >
      <div className="flex items-center gap-4">
        {Icon && (
          <div
            className={cn(
              "p-3 rounded-xl shrink-0 flex items-center justify-center",
              iconClass || "bg-brand-cream text-brand-plum"
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-heading">
            {value}
          </div>
          <div className="text-xs sm:text-sm font-semibold text-brand-muted mt-0.5 truncate">
            {label}
          </div>
        </div>
      </div>
      {note && (
        <div
          className={cn(
            "text-xs mt-3 pt-3 border-t border-brand-border/50 text-brand-muted",
            noteClass
          )}
        >
          {note}
        </div>
      )}
    </div>
  );
}
