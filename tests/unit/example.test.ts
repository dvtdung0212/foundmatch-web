import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Base Project Utilities", () => {
  it("cn() helper merges tailwind classnames correctly", () => {
    const result = cn("px-2 py-1", "bg-primary", { "text-white": true });
    expect(result).toBe("px-2 py-1 bg-primary text-white");
  });

  it("environment variables are properly configured", () => {
    expect(process.env.NEXT_PUBLIC_APP_URL).toBeDefined();
  });
});
