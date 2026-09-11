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
              email: ["email must be an email"],
              "profile.fullName": ["fullName should not be empty"],
            },
          },
          message: "Validation failed.",
        },
        status: 400,
      },
      { "profile.fullName": "fullName" },
    );

    expect(errors).toEqual({
      email: "Email không đúng định dạng.",
      fullName: "Họ và tên không được để trống.",
    });
  });

  it("never exposes an untranslated backend message", () => {
    const error = normalizeApiError({
      data: {
        code: "A_NEW_CONFLICT_CODE",
        message:
          "duplicate key value violates unique constraint users_email_key",
        requestId: "request-id",
      },
      status: 409,
    });

    expect(error.message).toBe(
      "Dữ liệu đã thay đổi hoặc xung đột. Vui lòng tải lại và thử lại.",
    );
    expect(error.message).not.toContain("unique constraint");
    expect(error.requestId).toBe("request-id");
  });

  it("uses audience-specific Vietnamese copy for a known business error", () => {
    const error = normalizeApiError({
      data: {
        code: "ITEM_DECLARATION_SELF_MODERATION_FORBIDDEN",
        message: "Staff cannot moderate their own declaration.",
      },
      status: 403,
    });

    expect(error.message).toBe("Bạn không thể tự kiểm duyệt báo cáo của mình.");
  });

  it("translates WEB_LOGIN_INVALID to invalid credentials message", () => {
    const error = normalizeApiError({
      data: {
        code: "WEB_LOGIN_INVALID",
        message: "The identifier or password is incorrect.",
        requestId: "req-123",
      },
      status: 401,
    });

    expect(error.message).toBe("Email, tên đăng nhập hoặc mật khẩu không chính xác.");
    expect(error.requestId).toBe("req-123");
  });

  it("wraps unknown transport errors in the shared error type", () => {
    const error = toApiRequestError(new TypeError("fetch failed"));

    expect(error.name).toBe("ApiRequestError");
    expect(error.code).toBe("NETWORK_ERROR");
  });

  it("uses the same error adapter for every API feature", async () => {
    await expect(
      callApi(async () => ({ data: undefined }), {
        emptyMessage: "Không có dữ liệu.",
        fallback: "Không thể tải.",
      }),
    ).rejects.toMatchObject({
      code: "EMPTY_API_RESPONSE",
      message: "Không có dữ liệu.",
      name: "ApiRequestError",
    });
  });
});
