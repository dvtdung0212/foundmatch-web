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
