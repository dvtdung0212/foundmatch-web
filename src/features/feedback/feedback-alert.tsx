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
  autoClose?: boolean | number;
  duration?: number;
}

const variantIcons: Record<
  FeedbackAlertVariant,
  React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>
> = {
  error: AlertCircle,
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles: Record<
  FeedbackAlertVariant,
  {
    container: string;
    iconColor: string;
    closeBtn: string;
  }
> = {
  error: {
    container: "border-brand-lost/30 bg-[#FFF4F1] text-brand-lost",
    iconColor: "text-brand-lost",
    closeBtn: "text-brand-lost hover:bg-brand-lost/10 active:bg-brand-lost/20",
  },
  success: {
    container: "border-brand-found/30 bg-[#F3F9F1] text-brand-found",
    iconColor: "text-brand-found",
    closeBtn: "text-brand-found hover:bg-brand-found/10 active:bg-brand-found/20",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    iconColor: "text-amber-600",
    closeBtn: "text-amber-900 hover:bg-amber-200/50 active:bg-amber-200/80",
  },
  info: {
    container: "border-sky-200 bg-sky-50 text-sky-900",
    iconColor: "text-sky-600",
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
  autoClose,
  duration,
}: FeedbackAlertProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  const handleCloseClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

  // Auto-close after timeout (default 5000ms if onClose is provided)
  const autoCloseDuration =
    duration !== undefined
      ? duration
      : typeof autoClose === "number"
        ? autoClose
        : autoClose === false
          ? 0
          : 5000;

  useEffect(() => {
    if (!isVisible || !onClose || autoCloseDuration <= 0 || isHovered) return;

    const timer = setTimeout(() => {
      handleCloseClick();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [isVisible, activeMessage, autoCloseDuration, isHovered, onClose]);

  const activeShouldDisplayRequestId =
    showRequestId !== undefined
      ? Boolean(showRequestId && activeRequestId)
      : Boolean(activeRequestId && activeCritical);

  const styles = variantStyles[activeVariant] || variantStyles.error;
  const IconComponent = variantIcons[activeVariant] || AlertCircle;
  const isMultiLine = Boolean(
    title || activeChildren || (activeShouldDisplayRequestId && activeRequestId),
  );

  return (
    <div
      hidden={!isVisible && !isClosing}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out",
        isVisible
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 !m-0 pointer-events-none",
        className,
      )}
      role="alert"
      aria-hidden={!isVisible}
    >
      <div className="overflow-hidden min-h-0">
        <div
          className={cn(
            "flex justify-between gap-3 rounded-2xl border font-semibold shadow-xs transition-transform duration-300 ease-out",
            isMultiLine
              ? "items-start p-3.5 sm:p-4 text-xs sm:text-[13px]"
              : "items-center py-2.5 sm:py-3 px-3.5 sm:px-4 text-xs sm:text-[13px]",
            isVisible ? "translate-y-0 scale-100" : "-translate-y-1.5 scale-[0.98]",
            styles.container,
          )}
        >
          <div
            className={cn(
              "flex gap-2.5 min-w-0 flex-1",
              isMultiLine ? "items-start" : "items-center",
            )}
          >
            <IconComponent
              className={cn(
                "h-4 w-4 shrink-0",
                isMultiLine && "mt-0.5",
                styles.iconColor,
              )}
              aria-hidden="true"
            />
            <div
              className={cn(
                "min-w-0 flex-1",
                isMultiLine ? "leading-snug" : "leading-normal",
              )}
            >
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
                "p-1 rounded-lg transition-colors shrink-0 cursor-pointer -mr-1",
                isMultiLine && "-mt-0.5",
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

