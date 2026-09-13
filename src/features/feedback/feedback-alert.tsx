import React, { useEffect, useState, useRef } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AppError } from "./types";

export type FeedbackAlertVariant = "error" | "success" | "warning" | "info";

export type GenericErrorLike = {
  message: string;
  requestId?: string;
  code?: string;
  kind?: string;
};

export interface FeedbackAlertProps {
  error?: AppError | GenericErrorLike | string | null;
  message?: string | null;
  variant?: FeedbackAlertVariant;
  className?: string;
  showRequestId?: boolean;
  onClose?: () => void;
  title?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<
  FeedbackAlertVariant,
  {
    container: string;
    icon: React.ReactNode;
    closeBtn: string;
  }
> = {
  error: {
    container:
      "border-brand-lost/30 bg-[#FFF4F1] text-brand-lost",
    icon: <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-lost" aria-hidden="true" />,
    closeBtn: "text-brand-lost hover:bg-brand-lost/10 active:bg-brand-lost/20",
  },
  success: {
    container:
      "border-brand-found/30 bg-[#F3F9F1] text-brand-found",
    icon: <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-found" aria-hidden="true" />,
    closeBtn: "text-brand-found hover:bg-brand-found/10 active:bg-brand-found/20",
  },
  warning: {
    container:
      "border-amber-200 bg-amber-50 text-amber-900",
    icon: <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />,
    closeBtn: "text-amber-900 hover:bg-amber-200/50 active:bg-amber-200/80",
  },
  info: {
    container:
      "border-sky-200 bg-sky-50 text-sky-900",
    icon: <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />,
    closeBtn: "text-sky-900 hover:bg-sky-200/50 active:bg-sky-200/80",
  },
};

export function FeedbackAlert({
  error,
  message: directMessage,
  variant: propVariant,
  className,
  showRequestId,
  onClose,
  title,
  children,
}: FeedbackAlertProps) {
  const [isClosing, setIsClosing] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Determine message and request ID
  const errorMessage = typeof error === "string" ? error : error?.message;
  const rawMessage = directMessage || errorMessage;
  const requestId = typeof error === "string" ? undefined : error?.requestId;

  const isCriticalKind =
    typeof error !== "string" &&
    (error?.kind === "system" ||
      error?.kind === "conflict" ||
      error?.kind === "network");

  const effectiveVariant: FeedbackAlertVariant =
    propVariant || (error ? "error" : directMessage ? "success" : "error");

  const hasRawContent = Boolean(rawMessage || children);

  // Keep last content during collapse animation so text doesn't vanish prematurely
  const [lastMessage, setLastMessage] = useState(rawMessage);
  const [lastRequestId, setLastRequestId] = useState(requestId);
  const [lastCritical, setLastCritical] = useState(isCriticalKind);
  const [lastVariant, setLastVariant] = useState(effectiveVariant);
  const [lastChildren, setLastChildren] = useState(children);

  useEffect(() => {
    if (hasRawContent) {
      setLastMessage(rawMessage);
      setLastRequestId(requestId);
      setLastCritical(isCriticalKind);
      setLastVariant(effectiveVariant);
      setLastChildren(children);
      setIsClosing(false);
    }
  }, [hasRawContent, rawMessage, requestId, isCriticalKind, effectiveVariant, children]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsClosing(true);

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Wait for the collapse animation (280ms) to finish before notifying parent
    closeTimeoutRef.current = setTimeout(() => {
      setIsClosing(false);
      onClose?.();
    }, 280);
  };

  const isVisible = hasRawContent && !isClosing;
  const activeMessage = rawMessage || lastMessage;
  const activeRequestId = requestId || lastRequestId;
  const activeCritical = isCriticalKind || lastCritical;
  const activeVariant = hasRawContent ? effectiveVariant : lastVariant;
  const activeChildren = children || lastChildren;

  const activeShouldDisplayRequestId =
    showRequestId !== undefined
      ? Boolean(showRequestId && activeRequestId)
      : Boolean(activeRequestId && activeCritical);

  const styles = variantStyles[activeVariant] || variantStyles.error;

  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity,margin-bottom] duration-300 ease-in-out !mt-0",
        isVisible
          ? "grid-rows-[1fr] opacity-100 mb-5"
          : "grid-rows-[0fr] opacity-0 mb-0 pointer-events-none",
      )}
      role="alert"
      aria-hidden={!isVisible}
    >
      <div className="overflow-hidden min-h-0">
        <div
          className={cn(
            "flex items-start justify-between gap-3 rounded-2xl border p-3.5 sm:p-4 text-xs sm:text-[13px] font-semibold shadow-xs transition-transform duration-300 ease-out",
            isVisible ? "translate-y-0 scale-100" : "-translate-y-1.5 scale-[0.98]",
            styles.container,
            className,
          )}
        >
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            {styles.icon}
            <div className="leading-snug min-w-0 flex-1">
              {title && <div className="font-bold mb-0.5">{title}</div>}
              {activeMessage && <span>{activeMessage}</span>}
              {activeChildren}
              {activeShouldDisplayRequestId && activeRequestId ? (
                <span className="mt-1 block text-[11px] font-medium opacity-80">
                  Mã yêu cầu: {activeRequestId}
                </span>
              ) : null}
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={handleCloseClick}
              className={cn(
                "p-1 rounded-lg transition-colors shrink-0 cursor-pointer -mr-1 -mt-1",
                styles.closeBtn,
              )}
              title="Đóng thông báo"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

