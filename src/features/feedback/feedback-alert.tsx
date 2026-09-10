import { AlertCircle } from "lucide-react";

import type { AppError } from "./types";

export function FeedbackAlert({ error }: { error: AppError | string | null }) {
  if (!error) return null;
  const message = typeof error === "string" ? error : error.message;
  const requestId = typeof error === "string" ? undefined : error.requestId;

  return (
    <div
      className="flex items-start gap-2.5 rounded-xl border border-brand-lostBorder bg-brand-lostBg p-3.5 text-xs font-semibold text-brand-lost"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        {message}
        {requestId ? (
          <span className="mt-1 block text-[11px] font-medium">
            Mã yêu cầu: {requestId}
          </span>
        ) : null}
      </span>
    </div>
  );
}

