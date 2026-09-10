import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseZodForm } from "@/features/feedback";

describe("parseZodForm", () => {
  it("returns field-addressable Vietnamese Zod errors", () => {
    const result = parseZodForm(
      z.object({ email: z.string().email("Email không hợp lệ") }),
      { email: "not-an-email" },
    );

    expect(result).toEqual({
      data: null,
      fieldErrors: { email: "Email không hợp lệ" },
    });
  });
});
