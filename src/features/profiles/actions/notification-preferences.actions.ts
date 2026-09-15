"use server";

import "server-only";
import { getServerApiClient } from "@/lib/api/server-client";

export type NotificationCategory =
  | "ACCOUNT_SECURITY"
  | "REPORT"
  | "MATCHING"
  | "CLAIM"
  | "HANDOVER"
  | "COMMUNITY_NEWS";

export interface NotificationPreferenceItem {
  category: NotificationCategory;
  name: string;
  description: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  isMandatory: boolean;
}

export interface NotificationPreferencesResult {
  success: boolean;
  items?: NotificationPreferenceItem[];
  error?: {
    code: string;
    message: string;
  };
}

export interface UpdatePreferenceInput {
  category: NotificationCategory;
  emailEnabled?: boolean;
  inAppEnabled?: boolean;
}

export async function getNotificationPreferencesAction(): Promise<NotificationPreferencesResult> {
  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await (apiClient as any).GET(
      "/api/v1/public/users/me/notification-preferences",
    );

    if (error || !data) {
      const errorObj = error as { code?: string; message?: string } | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "FETCH_PREFERENCES_FAILED",
          message:
            errorObj?.message ||
            "Không thể tải tùy chọn thông báo. Vui lòng thử lại sau.",
        },
      };
    }

    return {
      success: true,
      items: data.items,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: "UNEXPECTED_ERROR",
        message:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi không xác định khi tải tùy chọn thông báo.",
      },
    };
  }
}

export async function updateNotificationPreferenceAction(
  input: UpdatePreferenceInput,
): Promise<NotificationPreferencesResult> {
  try {
    const apiClient = await getServerApiClient();
    const { data, error } = await (apiClient as any).PATCH(
      "/api/v1/public/users/me/notification-preferences",
      {
        body: input,
      },
    );

    if (error || !data) {
      const errorObj = error as { code?: string; message?: string } | undefined;
      return {
        success: false,
        error: {
          code: errorObj?.code || "UPDATE_PREFERENCE_FAILED",
          message:
            errorObj?.message ||
            "Không thể cập nhật tùy chọn thông báo. Vui lòng thử lại.",
        },
      };
    }

    return {
      success: true,
      items: data.items,
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: "UNEXPECTED_ERROR",
        message:
          err instanceof Error
            ? err.message
            : "Đã xảy ra lỗi không xác định khi cập nhật tùy chọn thông báo.",
      },
    };
  }
}
