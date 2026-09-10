export type AppErrorKind =
  | "authentication"
  | "authorization"
  | "business"
  | "conflict"
  | "network"
  | "not-found"
  | "rate-limit"
  | "system"
  | "validation";

export interface ApiErrorPayload {
  code: string;
  details?: Record<string, unknown>;
  message: string;
  requestId?: string;
}

export interface AppError {
  code: string;
  fieldErrors: Record<string, string[]>;
  kind: AppErrorKind;
  message: string;
  requestId?: string;
  status?: number;
}

