// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

import { middleware } from "../../src/middleware";

describe("web authentication middleware", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("redirects an authenticated visitor away from login", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 200 })),
    );
    const request = new NextRequest("http://localhost:3000/login", {
      headers: { cookie: "foundmatch_web_access=opaque-access" },
    });

    const response = await middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("keeps login available and clears invalid credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 401 })),
    );
    const request = new NextRequest("http://localhost:3000/login", {
      headers: {
        cookie:
          "foundmatch_web_access=invalid-access; foundmatch_web_refresh=invalid-refresh",
      },
    });

    const response = await middleware(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain(
      "foundmatch_web_access=",
    );
    expect(response.headers.get("set-cookie")).toContain(
      "foundmatch_web_refresh=",
    );
  });
});
