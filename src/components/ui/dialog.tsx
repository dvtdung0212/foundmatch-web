"use client";

import * as React from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType | null>(null);

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  className,
  maxWidth = "max-w-lg",
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  const context = React.useContext(DialogContext);
  const [mounted, setMounted] = React.useState(false);
  const [isRendered, setIsRendered] = React.useState(Boolean(context?.open));
  const [isClosing, setIsClosing] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (context?.open) {
      setIsRendered(true);
      setIsClosing(false);
      document.body.style.overflow = "hidden";
    } else if (isRendered) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
        document.body.style.overflow = "";
      }, 180);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [context?.open, isRendered]);

  // Handle ESC key for accessible modal closing
  React.useEffect(() => {
    if (!context?.open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        context.onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [context?.open, context]);

  React.useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted || !isRendered) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-brand-dark/45 backdrop-blur-[3px]",
          isClosing ? "animate-fm-fade-out pointer-events-none" : "animate-fm-fade-in"
        )}
        onClick={() => context?.onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        className={cn(
          "relative z-50 w-full rounded-[28px] bg-white p-6 sm:p-8 shadow-2xl border border-brand-border max-h-[90vh] overflow-y-auto will-change-transform",
          isClosing ? "animate-fm-modal-out pointer-events-none" : "animate-fm-modal-in",
          maxWidth,
          className
        )}
      >
        <button
          type="button"
          onClick={() => context?.onOpenChange(false)}
          className="absolute right-5 top-5 rounded-xl p-1.5 text-brand-muted hover:bg-brand-cream/80 hover:text-brand-heading transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-plum cursor-pointer"
          aria-label="Đóng"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Đóng</span>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={cn("text-lg font-bold text-brand-heading", className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-sm text-brand-muted", className)}>{children}</p>
  );
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 border-t border-brand-border/60 mt-4",
        className
      )}
    >
      {children}
    </div>
  );
}
