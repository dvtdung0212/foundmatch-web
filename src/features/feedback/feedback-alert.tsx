import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AppError } from "./types";

export interface FeedbackAlertProps {
  error: AppError | string | null;
  className?: string;
  showRequestId?: boolean;
}

export function FeedbackAlert({
  error,
  className,
  showRequestId,
}: FeedbackAlertProps) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message;
  const requestId = typeof error === "string" ? undefined : error.requestId;

  const isCriticalKind =
    typeof error !== "string" &&
    (error.kind === "system" ||
      error.kind === "conflict" ||
      error.kind === "network");

  const shouldDisplayRequestId =
    showRequestId !== undefined
      ? Boolean(showRequestId && requestId)
      : Boolean(requestId && isCriticalKind);

  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-brand-lostBorder bg-brand-lostBg p-3.5 text-xs font-semibold text-brand-lost",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        {message}
        {shouldDisplayRequestId && requestId ? (
          <span className="mt-1 block text-[11px] font-medium">
            Mã yêu cầu: {requestId}
          </span>
        ) : null}
      </span>
    </div>
  );
}

