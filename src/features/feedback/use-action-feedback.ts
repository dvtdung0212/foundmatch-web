"use client";

import { useCallback, useState } from "react";

import { appFeedback } from "./app-feedback";
import { normalizeApiError } from "./normalize-api-error";
import type { AppError } from "./types";

export function useActionFeedback() {
  const [error, setError] = useState<AppError | null>(null);

  const clearError = useCallback(() => setError(null), []);
  const showInlineError = useCallback((cause: unknown, fallback?: string) => {
    const normalized = normalizeApiError(cause, fallback);
    setError(normalized);
    return normalized;
  }, []);
  const notifyError = useCallback(
    (cause: unknown, fallback?: string) => appFeedback.error(cause, { fallback }),
    [],
  );

  return {
    clearError,
    error,
    normalizeError: normalizeApiError,
    notifyError,
    notifySuccess: appFeedback.success,
    showInlineError,
  };
}
