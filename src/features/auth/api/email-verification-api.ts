import { getApiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";
import {
  ApiRequestError,
  callApi,
  normalizeApiError,
  type ApiErrorPayload,
} from "@/features/feedback";

export type EmailVerification =
  components["schemas"]["EmailVerificationResponseDto"];

export class EmailVerificationApiError extends ApiRequestError {
  constructor(
    message: string,
    code = "EMAIL_VERIFICATION_REQUEST_FAILED",
    field?: string,
    details?: Record<string, unknown>,
    requestId?: string,
    status?: number,
  ) {
    const payload: ApiErrorPayload = {
      code,
      details: { ...details, ...(field ? { field } : {}) },
      message,
      requestId,
    };
    super(normalizeApiError({ data: payload, status }), payload);
    this.name = "EmailVerificationApiError";
  }
}

export async function createWebRegistration(input: {
  email: string;
  fullName: string;
  password: string;
  username: string;
}): Promise<EmailVerification> {
  return call(() =>
    getApiClient().POST("/api/v1/public/web-auth/registrations", {
      body: input,
    }),
  );
}

export async function getWebEmailVerification(
  verificationId: string,
): Promise<EmailVerification> {
  return call(() =>
    getApiClient().GET(
      "/api/v1/public/web-auth/email-verifications/{verificationId}",
      {
        params: { path: { verificationId } },
      },
    ),
  );
}

export async function verifyWebRegistrationEmail(
  verificationId: string,
  code: string,
) {
  return call(() =>
    getApiClient().POST(
      "/api/v1/public/web-auth/email-verifications/{verificationId}/verify",
      { body: { code }, params: { path: { verificationId } } },
    ),
  );
}

export async function resendWebRegistrationEmailOtp(
  verificationId: string,
): Promise<EmailVerification> {
  return call(() =>
    getApiClient().POST(
      "/api/v1/public/web-auth/email-verifications/{verificationId}/resend",
      { params: { path: { verificationId } } },
    ),
  );
}

async function call<T>(operation: () => Promise<{ data?: T }>): Promise<T> {
  try {
    return await callApi(operation, {
      emptyMessage: "Máy chủ không trả về dữ liệu xác minh email.",
      fallback: "Không thể xử lý xác minh email.",
    });
  } catch (cause) {
    const error = normalizeApiError(cause, "Không thể xử lý xác minh email.");
    throw new EmailVerificationApiError(
      error.message,
      error.code,
      Object.keys(error.fieldErrors)[0],
      cause instanceof ApiRequestError ? cause.details : undefined,
      error.requestId,
      error.status,
    );
  }
}
