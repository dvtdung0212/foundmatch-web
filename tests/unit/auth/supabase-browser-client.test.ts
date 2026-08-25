import { beforeEach, describe, expect, it, vi } from "vitest";

const createBrowserClient = vi.fn(() => ({ auth: {} }));

vi.mock("@supabase/ssr", () => ({ createBrowserClient }));

describe("Supabase browser client", () => {
  beforeEach(() => {
    createBrowserClient.mockClear();
  });

  it("reads the current SSR cookies instead of reusing stale auth state", async () => {
    const { createClient } = await import("@/lib/supabase/client");

    createClient();

    expect(createBrowserClient).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { isSingleton: false },
    );
  });
});
