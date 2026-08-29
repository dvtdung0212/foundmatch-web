import { createClient as createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { NotificationListResult } from "../types";

async function getAccessToken(): Promise<string | null> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function fetchUserNotifications(params?: {
  limit?: number;
  offset?: number;
  unreadOnly?: boolean;
}): Promise<NotificationListResult> {
  const token = await getAccessToken();
  if (!token) {
    return { items: [], total: 0, unreadCount: 0 };
  }

  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  if (params?.unreadOnly) query.set("unreadOnly", "true");

  const res = await fetch(`${apiBaseUrl}/api/v1/public/notifications?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status}`);
  }

  return res.json();
}

export async function fetchUnreadCount(): Promise<number> {
  const token = await getAccessToken();
  if (!token) return 0;

  const res = await fetch(`${apiBaseUrl}/api/v1/public/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) return 0;
  const data = await res.json();
  return data.unreadCount ?? 0;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;

  await fetch(`${apiBaseUrl}/api/v1/public/notifications/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const token = await getAccessToken();
  if (!token) return;

  await fetch(`${apiBaseUrl}/api/v1/public/notifications/read-all`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
