import { getApiClient } from "@/lib/api/client";

export async function requestWebEmailChange(input: {
  currentPassword: string;
  newEmail: string;
}) {
  return await getApiClient().POST(
    "/api/v1/public/web-auth/email-change/request",
    {
      body: input,
    },
  );
}

export async function verifyWebEmailChange(input: {
  verificationId: string;
  code: string;
}) {
  return await getApiClient().POST(
    "/api/v1/public/web-auth/email-change/verify",
    {
      body: input,
    },
  );
}

export async function resendWebEmailChangeOtp(verificationId: string) {
  return await getApiClient().POST(
    "/api/v1/public/web-auth/email-change/resend",
    {
      body: { verificationId },
    },
  );
}

export async function cancelWebEmailChange(verificationId: string) {
  return await getApiClient().POST(
    "/api/v1/public/web-auth/email-change/cancel",
    {
      body: { verificationId },
    },
  );
}
