"use client";

import { useState, useEffect, useCallback } from "react";
import type { NotificationItem } from "../types";
import {
  fetchUserNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notifications-api";

export interface UseNotificationsOptions {
  enabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { enabled = true } = options;
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!enabled) return;
    try {
      setIsLoading(true);
      setError(null);
      const [listResult, unread] = await Promise.all([
        fetchUserNotifications({ limit: 20 }),
        fetchUnreadCount(),
      ]);
      setNotifications(listResult.items);
      setUnreadCount(unread);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Không thể tải thông báo");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await markNotificationAsRead(id);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    loadNotifications();

    // Connect to Server-Sent Events (SSE) for realtime updates
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return;
    }

    const eventSource = new EventSource("/api/v1/public/notifications/stream", {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "INIT") {
          if (typeof data.unreadCount === "number") {
            setUnreadCount(data.unreadCount);
          }
        } else if (data.type === "NOTIFICATION_RECEIVED") {
          if (typeof data.unreadCount === "number") {
            setUnreadCount(data.unreadCount);
          } else {
            setUnreadCount((prev) => prev + 1);
          }
          if (data.notification) {
            setNotifications((prev) => [
              data.notification,
              ...prev.filter((n) => n.id !== data.notification.id),
            ]);
          }
        } else if (data.type === "NOTIFICATION_READ") {
          if (typeof data.unreadCount === "number") {
            setUnreadCount(data.unreadCount);
          }
        }
      } catch (err) {
        console.error("Failed to parse SSE notification:", err);
      }
    };

    eventSource.onerror = () => {
      // Close connection on error (e.g. 401 unauthenticated or server restart) to prevent spamming
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [enabled, loadNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh: loadNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
  };
}
