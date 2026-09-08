import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

let refreshPromise: Promise<boolean> | null = null;

export function getApiClient(options: { cookieHeader?: string } = {}) {
  const browser = typeof window !== "undefined";
  const baseUrl = browser
    ? window.location.origin
    : process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001";

  return createClient<paths>({
    baseUrl,
    fetch: async (request: RequestInfo | URL, init?: RequestInit) => {
      const apiRequest = new Request(request, init);
      const headers = new Headers(apiRequest.headers);
      headers.set("x-foundmatch-client", "web");
      if (!browser && options.cookieHeader)
        headers.set("cookie", options.cookieHeader);
      const requestWithCredentials = new Request(apiRequest, {
        credentials: browser ? "include" : "omit",
        headers,
      });
      const retryRequest = requestWithCredentials.clone();
      let response = await globalThis.fetch(requestWithCredentials);

      if (
        browser &&
        response.status === 401 &&
        !isWebAuthRequest(retryRequest.url)
      ) {
        const refreshed = await refreshWebSession();
        if (refreshed) response = await globalThis.fetch(retryRequest);
      }

      if (!response.ok) throw await createApiError(response);
      return response;
    },
  });
}

function isWebAuthRequest(url: string): boolean {
  return new URL(url).pathname.startsWith("/api/v1/public/web-auth/");
}

function refreshWebSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = globalThis
      .fetch(
        new URL("/api/v1/public/web-auth/refresh", window.location.origin),
        {
          credentials: "include",
          headers: { "x-foundmatch-client": "web" },
          method: "POST",
        },
      )
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function createApiError(response: Response) {
  let data: unknown;
  try {
    data = await response.clone().json();
  } catch {
    data = { message: response.statusText };
  }
  const message =
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
      ? data.message
      : `Lỗi API ${response.status}`;
  return Object.assign(new Error(message), { data, status: response.status });
}
