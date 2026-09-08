import { getApiClient } from "@/lib/api/client";
import type { NotificationListResult } from "../types";

export async function fetchUserNotifications(params?: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}): Promise<NotificationListResult> {
  const { data } = await getApiClient().GET("/api/v1/public/notifications", {
    params: { query: params },
  });
  return data ?? { items: [], total: 0, unreadCount: 0 };
}

export async function fetchUnreadCount(): Promise<number> {
  try {
    const { data } = await getApiClient().GET(
      "/api/v1/public/notifications/unread-count",
    );
    return data?.unreadCount ?? 0;
  } catch {
    return 0;
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await getApiClient().PATCH("/api/v1/public/notifications/{id}/read", {
    params: { path: { id } },
  });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await getApiClient().POST("/api/v1/public/notifications/read-all");
}
