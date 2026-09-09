import { getApiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";

export type EmailVerification =
  components["schemas"]["EmailVerificationResponseDto"];

export class EmailVerificationApiError extends Error {
  constructor(
    message: string,
    readonly code?: string,
    readonly field?: string,
    readonly details?: Record<string, unknown>,
  ) {
    super(message);
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
    const { data } = await operation();
    if (data === undefined) throw new Error("EMPTY_API_RESPONSE");
    return data;
  } catch (error) {
    const candidate = error as {
      data?: {
        code?: string;
        details?: Record<string, unknown>;
        message?: string;
      };
      message?: string;
    };
    const payload = candidate.data;
    throw new EmailVerificationApiError(
      payload?.message ??
        candidate.message ??
        "Không thể xử lý xác minh email.",
      payload?.code,
      typeof payload?.details?.field === "string"
        ? payload.details.field
        : undefined,
      payload?.details,
    );
  }
}
