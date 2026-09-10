import { toast } from "sonner";

import { normalizeApiError } from "./normalize-api-error";

type ToastOptions = Parameters<typeof toast.success>[1];
type ErrorFeedbackOptions = NonNullable<ToastOptions> & { fallback?: string };

export const appFeedback = {
  error(error: unknown, options: ErrorFeedbackOptions = {}) {
    const normalized = normalizeApiError(error, options.fallback);
    const description = normalized.requestId
      ? `Mã yêu cầu: ${normalized.requestId}`
      : options.description;
    const { fallback: _fallback, ...toastOptions } = options;
    if (description || Object.keys(toastOptions).length > 0) {
      toast.error(normalized.message, { ...toastOptions, description });
    } else {
      toast.error(normalized.message);
    }
    return normalized;
  },
  info(message: string, options?: ToastOptions) {
    if (options) toast.info(message, options);
    else toast.info(message);
  },
  success(message: string, options?: ToastOptions) {
    if (options) toast.success(message, options);
    else toast.success(message);
  },
  warning(message: string, options?: ToastOptions) {
    if (options) toast.warning(message, options);
    else toast.warning(message);
  },
};
