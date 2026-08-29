"use client";

import { useState, useEffect, useCallback } from "react";
import type { NotificationItem } from "../types";
import {
  fetchUserNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/notifications-api";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
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
  }, []);

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
    loadNotifications();

    // Poll every 30 seconds for background refresh
    const interval = setInterval(() => {
      fetchUnreadCount().then((count) => setUnreadCount(count)).catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, [loadNotifications]);

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
