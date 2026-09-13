import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { parseZodForm, useZodFormValidation } from "@/features/feedback";

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
describe("useZodFormValidation", () => {
  const schema = z.object({
    name: z.string().min(1, "Vui lòng nhập họ tên"),
    email: z.string().email("Email không hợp lệ"),
  });

  it("validates a specific field live with validateField without affecting other fields", () => {
    const { result } = renderHook(() => useZodFormValidation(schema));

    // Initially no errors
    expect(result.current.fieldErrors).toEqual({});

    // Validate email field live with invalid value
    act(() => {
      const err = result.current.validateField("email", { name: "", email: "bad-email" });
      expect(err).toBe("Email không hợp lệ");
    });

    // Only email has error, name is untouched even though name is also empty
    expect(result.current.fieldErrors).toEqual({
      email: "Email không hợp lệ",
    });

    // When email becomes valid, validateField clears the error
    act(() => {
      const err = result.current.validateField("email", { name: "", email: "good@example.com" });
      expect(err).toBeNull();
    });

    expect(result.current.fieldErrors).toEqual({});
  });

  it("validates the entire form with validate", () => {
    const { result } = renderHook(() => useZodFormValidation(schema));

    act(() => {
      const data = result.current.validate({ name: "", email: "invalid" });
      expect(data).toBeNull();
    });

    expect(result.current.fieldErrors).toEqual({
      name: "Vui lòng nhập họ tên",
      email: "Email không hợp lệ",
    });
  });
});
