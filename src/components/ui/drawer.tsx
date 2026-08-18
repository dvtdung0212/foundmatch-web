"use client";

import * as React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DrawerContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType | null>(null);

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
  return (
    <DrawerContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerContent({
  children,
  className,
  width = "max-w-md sm:max-w-lg",
}: {
  children: React.ReactNode;
  className?: string;
  width?: string;
}) {
  const context = React.useContext(DrawerContext);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (context?.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [context?.open]);

  if (!mounted || !context?.open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => context.onOpenChange(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={cn(
            "w-screen bg-white shadow-2xl border-l border-brand-border flex flex-col animate-in slide-in-from-right duration-200",
            width,
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function DrawerHeader({
  className,
  children,
  onClose,
}: {
  className?: string;
  children: React.ReactNode;
  onClose?: () => void;
}) {
  const context = React.useContext(DrawerContext);
  return (
    <div
      className={cn(
        "flex items-center justify-between p-5 border-b border-brand-border/60 shrink-0",
        className
      )}
    >
      <div>{children}</div>
      <button
        type="button"
        onClick={onClose || (() => context?.onOpenChange(false))}
        className="rounded-full p-1.5 text-brand-muted hover:bg-brand-cream hover:text-brand-heading transition-colors"
      >
        <X className="h-5 w-5" />
        <span className="sr-only">Đóng</span>
      </button>
    </div>
  );
}

export function DrawerTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn("text-lg font-bold text-brand-heading", className)}>
      {children}
    </h3>
  );
}

export function DrawerBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-5 space-y-4", className)}>
      {children}
    </div>
  );
}

export function DrawerFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-5 border-t border-brand-border/60 bg-brand-cream/30 shrink-0 flex items-center justify-end gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}
