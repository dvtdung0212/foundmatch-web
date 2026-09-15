"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  FileEdit,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Clock,
  ExternalLink,
  Inbox,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "../hooks/use-notifications";
import type { NotificationItem } from "../types";

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Vừa xong";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  } catch {
    return dateString;
  }
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "ITEM_DECLARATION_INFORMATION_REQUESTED":
      return (
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
          <FileEdit className="w-4 h-4" />
        </div>
      );
    case "MATCH_CANDIDATE_FOUND":
    case "MATCH_CANDIDATE":
      return (
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
      );
    case "CLAIM_APPROVED":
    case "CLAIM_ACCEPTED":
      return (
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
      );
    case "ITEM_DECLARATION_REJECTED":
      return (
        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
          <AlertCircle className="w-4 h-4" />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4" />
        </div>
      );
  }
}

export interface NotificationBellProps {
  enabled?: boolean;
}

export function NotificationBell({ enabled = true }: NotificationBellProps = {}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications({ enabled });

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.isRead) {
      await markAsRead(item.id);
    }
    setIsOpen(false);

    if (item.data?.path) {
      router.push(item.data.path);
    } else if (item.data?.declarationId) {
      router.push(`/reports/${item.data.declarationId}`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Thông báo"
          className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-brand-muted hover:text-brand-plum hover:border-[#FFC7BA] transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 bg-[#DC2626] text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center shadow-xs animate-in zoom-in-50">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 shadow-2xl rounded-2xl border border-slate-200 overflow-hidden bg-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-brand-plum/10 text-brand-plum">
                {unreadCount} mới
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-plum hover:underline cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Đọc tất cả</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
          {isLoading && notifications.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400 space-y-2">
              <div className="w-6 h-6 border-2 border-brand-plum border-t-transparent rounded-full animate-spin mx-auto" />
              <p>Đang tải thông báo...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                Chưa có thông báo nào
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
                Khi có cập nhật về báo cáo hoặc kết quả tìm kiếm, bạn sẽ nhận được thông báo tại đây.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 hover:bg-slate-50/80 transition-colors cursor-pointer flex gap-3 items-start relative ${
                  !item.isRead ? "bg-[#FFF9F6]/60" : ""
                }`}
              >
                {getNotificationIcon(item.type)}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs ${!item.isRead ? "font-bold text-slate-900" : "font-semibold text-slate-700"}`}>
                      {item.title}
                    </p>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-brand-plum shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 text-center">
          <Link
            href="/reports"
            onClick={() => setIsOpen(false)}
            className="text-xs font-semibold text-slate-600 hover:text-brand-plum inline-flex items-center gap-1 transition-colors"
          >
            <span>Quản lý báo cáo của tôi</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
