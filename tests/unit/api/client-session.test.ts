import { afterEach, describe, expect, it, vi } from "vitest";

import { getApiClient } from "@/lib/api/client";

describe("Web API cookie-session transport", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("sends same-origin cookies and the Web client marker", async () => {
    const fetchMock = vi.fn(async (request: Request) => {
      expect(request.credentials).toBe("include");
      expect(request.headers.get("x-foundmatch-client")).toBe("web");
      return jsonResponse({ service: "foundmatch-backend", status: "ok" });
    });
    vi.stubGlobal("fetch", fetchMock);

    await getApiClient().GET("/api/v1/health");

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("refreshes once before retrying an unauthorized request", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ code: "WEB_SESSION_ACCESS_EXPIRED" }, 401),
      )
      .mockResolvedValueOnce(jsonResponse({ rememberLogin: false }))
      .mockResolvedValueOnce(
        jsonResponse({ service: "foundmatch-backend", status: "ok" }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await getApiClient().GET("/api/v1/health");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    const refreshRequest = fetchMock.mock.calls[1]?.[0] as URL;
    expect(new URL(refreshRequest).pathname).toBe(
      "/api/v1/public/web-auth/refresh",
    );
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });
}
