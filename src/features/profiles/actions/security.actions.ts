"use server";

import "server-only";
import { getServerApiClient } from "@/lib/api/server-client";
import {
  changePasswordSchema,
  requestEmailChangeSchema,
  verifyEmailChangeSchema,
  type ChangePasswordInput,
} from "@/features/auth/schemas/auth.schema";
import type { AuthActionResult } from "@/types/auth.types";

export async function changePasswordAction(
  input: ChangePasswordInput,
): Promise<AuthActionResult> {
  try {
    const validation = changePasswordSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            validation.error.errors[0]?.message ||
            "Dữ liệu mật khẩu không hợp lệ.",
        },
      };
    }

    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.POST(
      "/api/v1/public/web-auth/change-password",
      {
        body: {
          currentPassword: validation.data.currentPassword,
          newPassword: validation.data.newPassword,
          revokeOtherSessions: validation.data.revokeOtherSessions,
        },
      },
    );

    if (error || !data) {
      const errorObj = error as { code?: string; message?: string } | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "CHANGE_PASSWORD_FAILED",
          message:
            errorObj?.message ||
            "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.",
        },
      };
    }

    return {
      success: true,
      message: data.message || "Đổi mật khẩu thành công!",
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: err instanceof Error ? err.message : "Đã xảy ra lỗi máy chủ.",
      },
    };
  }
}

export interface WebSessionItem {
  id: string;
  deviceName: string;
  clientName: string;
  location: string | null;
  createdAt: string;
  lastSeenAt: string;
  isCurrent: boolean;
  deviceType: "laptop" | "phone" | "desktop";
}

export async function getWebSessionsAction(): Promise<{
  success: boolean;
  sessions: WebSessionItem[];
  error?: string;
}> {
  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.GET(
      "/api/v1/public/web-auth/sessions",
    );

    if (error || !data) {
      return {
        success: false,
        sessions: [],
        error:
          (error as { message?: string })?.message ||
          "Không thể tải danh sách phiên đăng nhập.",
      };
    }

    return {
      success: true,
      sessions: data.sessions as WebSessionItem[],
    };
  } catch {
    return {
      success: false,
      sessions: [],
      error: "Không thể kết nối đến máy chủ.",
    };
  }
}

export async function revokeWebSessionAction(
  sessionId: string,
): Promise<AuthActionResult> {
  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.DELETE(
      "/api/v1/public/web-auth/sessions/{sessionId}",
      {
        params: {
          path: { sessionId },
        },
      },
    );

    if (error || !data) {
      const errorObj = error as
        | { code?: string; message?: string }
        | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "REVOKE_SESSION_FAILED",
          message: errorObj?.message || "Đăng xuất thiết bị thất bại.",
        },
      };
    }

    return {
      success: true,
      message: data.message || "Đã đăng xuất thiết bị thành công.",
    };
  } catch {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Không thể kết nối đến hệ thống.",
      },
    };
  }
}

export async function revokeOtherWebSessionsAction(): Promise<AuthActionResult> {
  try {
    const apiClient = (await getServerApiClient()) as unknown as {
      DELETE: (url: string, init?: unknown) => Promise<{
        data?: { success?: boolean; message?: string };
        error?: { code?: string; message?: string };
      }>;
    };
    const { data, error } = await apiClient.DELETE(
      "/api/v1/public/web-auth/sessions",
    );

    if (error || !data) {
      const errorObj = error as
        | { code?: string; message?: string }
        | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "REVOKE_SESSIONS_FAILED",
          message: errorObj?.message || "Đăng xuất các thiết bị khác thất bại.",
        },
      };
    }

    return {
      success: true,
      message: data.message || "Đã đăng xuất tất cả các thiết bị khác thành công.",
    };
  } catch {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Không thể kết nối đến hệ thống.",
      },
    };
  }
}

export interface RequestEmailChangeResult {
  success: boolean;
  data?: {
    verificationId: string;
    expiresAt: string;
    resendAvailableAt: string;
    newEmail: string;
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface VerifyEmailChangeResult {
  success: boolean;
  email?: string;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface ResendEmailChangeResult {
  success: boolean;
  data?: {
    verificationId: string;
    expiresAt: string;
    resendAvailableAt: string;
    message: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

function extractActionError(err: unknown, fallback: string): { message: string; code: string } {
  const errorObj = err as { data?: { code?: string; message?: string }; message?: string };
  const message =
    errorObj?.data?.message ||
    (err instanceof Error ? err.message : null) ||
    fallback;
  const code = errorObj?.data?.code || "SERVER_ERROR";
  return { message, code };
}

export async function requestEmailChangeAction(input: {
  currentPassword: string;
  newEmail: string;
}): Promise<RequestEmailChangeResult> {
  try {
    const validation = requestEmailChangeSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validation.error.issues[0]?.message || "Dữ liệu nhập vào không hợp lệ.",
        },
      };
    }

    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.POST(
      "/api/v1/public/web-auth/email-change/request",
      {
        body: {
          currentPassword: validation.data.currentPassword,
          newEmail: validation.data.newEmail,
        },
      },
    );

    if (error || !data) {
      const errorObj = error as { code?: string; message?: string } | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "REQUEST_FAILED",
          message:
            errorObj?.message ||
            "Không thể gửi yêu cầu đổi email. Vui lòng kiểm tra lại mật khẩu.",
        },
      };
    }

    return {
      success: true,
      data: data as RequestEmailChangeResult["data"],
    };
  } catch (err) {
    const { message, code } = extractActionError(err, "Không thể kết nối đến máy chủ.");
    return {
      success: false,
      error: {
        code,
        message,
      },
    };
  }
}

export async function verifyEmailChangeAction(input: {
  verificationId: string;
  code: string;
}): Promise<VerifyEmailChangeResult> {
  try {
    const validation = verifyEmailChangeSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validation.error.issues[0]?.message || "Mã xác thực phải gồm đúng 6 chữ số.",
        },
      };
    }

    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.POST(
      "/api/v1/public/web-auth/email-change/verify",
      {
        body: {
          code: validation.data.code,
          verificationId: validation.data.verificationId,
        },
      },
    );

    if (error || !data) {
      const errorObj = error as { code?: string; message?: string } | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "VERIFY_FAILED",
          message:
            errorObj?.message ||
            "Mã xác thực không chính xác hoặc đã hết hạn.",
        },
      };
    }

    return {
      success: true,
      email: data.email,
      message: data.message || "Đổi email thành công.",
    };
  } catch (err) {
    const { message, code } = extractActionError(err, "Không thể kết nối đến máy chủ.");
    return {
      success: false,
      error: {
        code,
        message,
      },
    };
  }
}

export async function resendEmailChangeOtpAction(
  verificationId: string,
): Promise<ResendEmailChangeResult> {
  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.POST(
      "/api/v1/public/web-auth/email-change/resend",
      {
        body: { verificationId },
      },
    );

    if (error || !data) {
      const errorObj = error as { code?: string; message?: string } | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "RESEND_FAILED",
          message: errorObj?.message || "Không thể gửi lại mã xác thực.",
        },
      };
    }

    return {
      success: true,
      data: data as ResendEmailChangeResult["data"],
    };
  } catch (err) {
    const { message, code } = extractActionError(err, "Không thể kết nối đến máy chủ.");
    return {
      success: false,
      error: {
        code,
        message,
      },
    };
  }
}

export async function cancelEmailChangeAction(
  verificationId: string,
): Promise<AuthActionResult> {
  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await apiClient.POST(
      "/api/v1/public/web-auth/email-change/cancel",
      {
        body: { verificationId },
      },
    );

    if (error || !data) {
      const errorObj = error as { code?: string; message?: string } | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "CANCEL_FAILED",
          message: errorObj?.message || "Không thể hủy yêu cầu đổi email.",
        },
      };
    }

    return {
      success: true,
      message: data.message || "Yêu cầu đổi email đã được hủy.",
    };
  } catch (err) {
    const { message, code } = extractActionError(err, "Không thể kết nối đến máy chủ.");
    return {
      success: false,
      error: {
        code,
        message,
      },
    };
  }
}
