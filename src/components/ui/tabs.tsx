"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TabsVariant = "pill" | "underline";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  variant = "pill",
  children,
  className,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  variant?: TabsVariant;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const activeValue = value !== undefined ? value : internalValue;
  const setActiveValue = onValueChange ?? setInternalValue;

  return (
    <TabsContext.Provider
      value={{ value: activeValue, onValueChange: setActiveValue, variant }}
    >
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  const variant = context?.variant ?? "pill";

  return (
    <div
      className={cn(
        variant === "underline"
          ? "flex items-center gap-6 sm:gap-8 border-b border-brand-border px-2 overflow-x-auto hide-scrollbar w-full"
          : "inline-flex items-center gap-1.5 p-1 rounded-xl bg-transparent",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  badge,
  icon,
  variant: propVariant,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: TabsVariant;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used inside Tabs");

  const variant = propVariant ?? context.variant;
  const isActive = context.value === value;

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        variant === "underline"
          ? cn(
              "flex items-center gap-2 pb-3.5 px-1 border-b-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
              isActive
                ? "border-brand-plum text-brand-plum"
                : "border-transparent text-brand-muted hover:text-brand-heading",
            )
          : cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer border",
              isActive
                ? "bg-brand-plum text-white border-brand-plum shadow-xs"
                : "bg-white text-brand-muted border-brand-border hover:bg-brand-cream/60 hover:text-brand-heading",
            ),
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center text-[11px] font-semibold",
            variant === "underline"
              ? isActive
                ? "text-brand-plum"
                : "text-brand-muted"
              : isActive
                ? "text-white/80"
                : "text-brand-muted",
          )}
        >
          ({badge})
        </span>
      )}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used inside Tabs");

  if (context.value !== value) return null;

  return <div className={cn("mt-6", className)}>{children}</div>;
}
