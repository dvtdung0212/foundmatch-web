import { translateWebError } from "./error-catalog";
import type { ApiErrorPayload, AppError, AppErrorKind } from "./types";

const DEFAULT_MESSAGE = "Không thể hoàn tất yêu cầu. Vui lòng thử lại.";
const INVALID_FIELD_MESSAGE = "Dữ liệu chưa hợp lệ.";

export class ApiRequestError extends Error {
  readonly apiError: ApiErrorPayload | null;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly field?: string;
  readonly requestId?: string;
  readonly status?: number;

  constructor(error: AppError, payload: ApiErrorPayload | null = null) {
    super(error.message);
    this.name = "ApiRequestError";
    this.apiError = payload;
    this.code = error.code;
    this.details = payload?.details;
    this.field = firstField(error.fieldErrors);
    this.requestId = error.requestId;
    this.status = error.status;
  }
}

export function normalizeApiError(
  error: unknown,
  fallback = DEFAULT_MESSAGE,
): AppError {
  if (error instanceof ApiRequestError) {
    return {
      code: error.code,
      fieldErrors: normalizeFieldErrors(error.details, error.message),
      kind: classifyError(error.code, error.status),
      message: error.message,
      ...(error.requestId ? { requestId: error.requestId } : {}),
      ...(error.status === undefined ? {} : { status: error.status }),
    };
  }

  const payload = getApiError(error);
  const status = getStatus(error);
  const code = payload?.code ?? getDirectString(error, "code") ?? inferCode(error, status);
  const message =
    translateWebError(code) ??
    payload?.message ??
    (typeof error === "string" ? error : undefined) ??
    fallback;
  const details = payload?.details ?? getDirectRecord(error, "details");
  const requestId = payload?.requestId ?? getDirectString(error, "requestId");

  return {
    code,
    fieldErrors: normalizeFieldErrors(details, message, getDirectString(error, "field")),
    kind: classifyError(code, status),
    message,
    ...(requestId ? { requestId } : {}),
    ...(status === undefined ? {} : { status }),
  };
}

export function getApiError(error: unknown): ApiErrorPayload | null {
  if (error instanceof ApiRequestError) return error.apiError;
  if (isRecord(error) && "data" in error) return getApiError(error.data);
  if (!isRecord(error)) return null;
  return typeof error.code === "string" && typeof error.message === "string"
    ? (error as unknown as ApiErrorPayload)
    : null;
}

export function toApiRequestError(
  error: unknown,
  fallback = DEFAULT_MESSAGE,
): ApiRequestError {
  if (error instanceof ApiRequestError) return error;
  return new ApiRequestError(normalizeApiError(error, fallback), getApiError(error));
}

function normalizeFieldErrors(
  details: Record<string, unknown> | undefined,
  message: string,
  directField?: string,
): Record<string, string[]> {
  const output: Record<string, string[]> = {};
  if (isRecord(details?.fieldErrors)) {
    for (const [field, messages] of Object.entries(details.fieldErrors)) {
      if (Array.isArray(messages) && messages.some((item) => typeof item === "string")) {
        output[field] = [INVALID_FIELD_MESSAGE];
      }
    }
  }
  const field = typeof details?.field === "string" ? details.field : directField;
  if (field && !output[field]) output[field] = [message];
  if (Array.isArray(details?.fields)) {
    for (const item of details.fields) {
      if (typeof item === "string" && !output[item]) output[item] = [message];
    }
  }
  return output;
}

function classifyError(code: string, status?: number): AppErrorKind {
  if (code === "NETWORK_ERROR" || status === 0) return "network";
  if (code === "VALIDATION_FAILED" || status === 400 || status === 422) return "validation";
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status === 404) return "not-found";
  if (status === 409) return "conflict";
  if (status === 429) return "rate-limit";
  if (status !== undefined && status >= 500) return "system";
  if (code === "UNKNOWN_ERROR") return "system";
  return "business";
}

function inferCode(error: unknown, status?: number): string {
  if (status === 0 || (error instanceof TypeError && /fetch/i.test(error.message))) {
    return "NETWORK_ERROR";
  }
  return "UNKNOWN_ERROR";
}

function getStatus(error: unknown): number | undefined {
  return isRecord(error) && typeof error.status === "number" ? error.status : undefined;
}

function getDirectString(error: unknown, key: string): string | undefined {
  return isRecord(error) && typeof error[key] === "string" ? error[key] : undefined;
}

function getDirectRecord(error: unknown, key: string): Record<string, unknown> | undefined {
  const value = isRecord(error) ? error[key] : undefined;
  return isRecord(value) ? value : undefined;
}

function firstField(fieldErrors: Record<string, string[]>): string | undefined {
  return Object.keys(fieldErrors)[0];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
