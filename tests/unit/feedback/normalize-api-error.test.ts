import { describe, expect, it } from "vitest";

import {
  callApi,
  normalizeApiError,
  resolveApiFormFieldErrors,
  toApiRequestError,
} from "@/features/feedback";

describe("web feedback error normalization", () => {
  it("translates a structured API error and preserves its request reference", () => {
    const error = normalizeApiError({
      data: {
        code: "EMAIL_ALREADY_EXISTS",
        details: { field: "email" },
        message: "Email exists.",
        requestId: "request-id",
      },
      status: 409,
    });

    expect(error).toMatchObject({
      code: "EMAIL_ALREADY_EXISTS",
      fieldErrors: { email: ["Email này đã được sử dụng."] },
      kind: "conflict",
      message: "Email này đã được sử dụng.",
      requestId: "request-id",
      status: 409,
    });
  });

  it("maps nested backend validation fields to form fields", () => {
    const errors = resolveApiFormFieldErrors(
      {
        data: {
          code: "VALIDATION_FAILED",
          details: {
            fieldErrors: {
              "profile.fullName": ["must not be empty"],
              username: ["must be longer"],
            },
          },
          message: "Validation failed.",
        },
        status: 400,
      },
      { "profile.fullName": "fullName" },
    );

    expect(errors).toEqual({
      fullName: "Dữ liệu chưa hợp lệ.",
      username: "Dữ liệu chưa hợp lệ.",
    });
  });

  it("wraps unknown transport errors in the shared error type", () => {
    const error = toApiRequestError(new TypeError("fetch failed"));

    expect(error.name).toBe("ApiRequestError");
    expect(error.code).toBe("NETWORK_ERROR");
  });

  it("uses the same error adapter for every API feature", async () => {
    await expect(
      callApi(
        async () => ({ data: undefined }),
        { emptyMessage: "Không có dữ liệu.", fallback: "Không thể tải." },
      ),
    ).rejects.toMatchObject({
      code: "EMPTY_API_RESPONSE",
      message: "Không có dữ liệu.",
      name: "ApiRequestError",
    });
  });
});
