import { getApiClient } from "@/lib/api/client";

export async function getWebSessionPolicy() {
  const { data } = await getApiClient().GET("/api/v1/public/web-auth/policy");
  return data;
}
export async function loginWeb(input: {
  identifier: string;
  password: string;
  rememberLogin: boolean;
}) {
  const { data } = await getApiClient().POST("/api/v1/public/web-auth/login", {
    body: input,
  });
  return data;
}

export async function loginWebDemo(email: string) {
  const { data } = await getApiClient().POST(
    "/api/v1/public/web-auth/demo-login",
    { body: { email } },
  );
  return data;
}

export async function logoutWeb(): Promise<void> {
  await getApiClient().POST("/api/v1/public/web-auth/logout");
}

export async function requestWebPasswordRecovery(identifier: string) {
  const { data } = await getApiClient().POST(
    "/api/v1/public/web-auth/password-recovery-requests",
    { body: { identifier } },
  );
  return data;
}

export async function resetWebPassword(token: string, password: string) {
  await getApiClient().POST("/api/v1/public/web-auth/password-resets", {
    body: { password, token },
  });
}

export async function changeWebPassword(input: {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}) {
  return await getApiClient().POST("/api/v1/public/web-auth/change-password", {
    body: {
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
      revokeOtherSessions: input.revokeOtherSessions ?? true,
    },
  });
}

export async function getWebSessions() {
  return await getApiClient().GET("/api/v1/public/web-auth/sessions");
}

export async function revokeWebSession(sessionId: string) {
  return await getApiClient().DELETE(
    "/api/v1/public/web-auth/sessions/{sessionId}",
    {
      params: {
        path: { sessionId },
      },
    },
  );
}
