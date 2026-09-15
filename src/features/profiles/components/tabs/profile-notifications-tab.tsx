"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Bell,
  Mail,
  Shield,
  FileText,
  Sparkles,
  CheckSquare,
  ArrowRightLeft,
  Megaphone,
  Loader2,
  Check,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FeedbackAlert } from "@/features/feedback";
import { Button } from "@/components/ui/button";
import {
  getNotificationPreferencesAction,
  updateNotificationPreferenceAction,
  type NotificationCategory,
  type NotificationPreferenceItem,
} from "../../actions/notification-preferences.actions";

function getCategoryIcon(category: NotificationCategory) {
  switch (category) {
    case "ACCOUNT_SECURITY":
      return {
        icon: Shield,
        colorClass: "bg-[#FFF4F1] text-brand-plum",
      };
    case "REPORT":
      return {
        icon: FileText,
        colorClass: "bg-[#F3F9F1] text-brand-found",
      };
    case "MATCHING":
      return {
        icon: Sparkles,
        colorClass: "bg-amber-50 text-amber-600",
      };
    case "CLAIM":
      return {
        icon: CheckSquare,
        colorClass: "bg-blue-50 text-blue-600",
      };
    case "HANDOVER":
      return {
        icon: ArrowRightLeft,
        colorClass: "bg-emerald-50 text-emerald-600",
      };
    case "COMMUNITY_NEWS":
      return {
        icon: Megaphone,
        colorClass: "bg-purple-50 text-purple-600",
      };
    default:
      return {
        icon: Bell,
        colorClass: "bg-slate-50 text-slate-600",
      };
  }
}

export function ProfileNotificationsTab() {
  const [items, setItems] = useState<NotificationPreferenceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getNotificationPreferencesAction();
      if (res.success && res.items) {
        setItems(res.items);
      } else {
        setError(
          res.error?.message ||
          "Không thể tải tùy chọn thông báo. Vui lòng tải lại trang.",
        );
      }
    } catch {
      setError("Đã xảy ra sự cố khi tải cài đặt thông báo.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const handleToggle = async (
    category: NotificationCategory,
    channel: "emailEnabled" | "inAppEnabled",
    newValue: boolean,
  ) => {
    const key = `${category}-${channel}`;
    if (updatingKey === key) return;

    // Snapshot current state for optimistic rollback
    const previousItems = [...items];

    // Optimistically update
    setItems((prev) =>
      prev.map((item) =>
        item.category === category
          ? { ...item, [channel]: newValue }
          : item,
      ),
    );

    setUpdatingKey(key);
    setError(null);

    try {
      const payload = {
        category,
        [channel]: newValue,
      };

      const res = await updateNotificationPreferenceAction(payload);
      if (res.success && res.items) {
        setItems(res.items);
        setSaveSuccessNotice("Đã lưu thay đổi");
        setTimeout(() => setSaveSuccessNotice(null), 2500);
      } else {
        // Rollback
        setItems(previousItems);
        setError(
          res.error?.message ||
          "Không thể cập nhật tùy chọn thông báo. Đã hoàn tác thay đổi.",
        );
      }
    } catch {
      setItems(previousItems);
      setError("Lỗi kết nối khi lưu tùy chọn thông báo.");
    } finally {
      setUpdatingKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-12 border border-brand-border shadow-sm flex flex-col items-center justify-center text-center min-h-[360px]">
        <Loader2 className="h-8 w-8 text-brand-plum animate-spin mb-3" />
        <p className="text-sm font-semibold text-brand-muted">
          Đang tải tùy chọn thông báo của bạn...
        </p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="bg-white rounded-[32px] p-10 border border-brand-border shadow-sm flex flex-col items-center justify-center text-center min-h-[320px] space-y-4">
        <FeedbackAlert
          variant="error"
          message={error}
          onClose={() => setError(null)}
          className="max-w-lg w-full"
        />
        <Button
          onClick={fetchPreferences}
          variant="outline"
          className="gap-2 rounded-xl"
        >
          <RotateCcw className="h-4 w-4" />
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border shadow-sm space-y-6">
      {/* Header with Title and Auto-save status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-brand-soft text-brand-plum flex items-center justify-center shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-brand-heading">
              Cài đặt Thông báo
            </h3>
            <p className="text-[13px] font-semibold text-brand-muted mt-0.5">
              Quản lý các thông báo bạn nhận qua Email và chuông thông báo trên hệ thống.
            </p>
          </div>
        </div>

        {/* Live Save Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold shrink-0">
          {updatingKey ? (
            <div className="flex items-center gap-1.5 text-brand-muted bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-plum" />
              <span>Đang lưu...</span>
            </div>
          ) : saveSuccessNotice ? (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-in fade-in duration-200">
              <Check className="h-3.5 w-3.5 text-emerald-600" />
              <span>{saveSuccessNotice}</span>
            </div>
          ) : (
            <span className="text-brand-muted text-[11px] bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              Tự động lưu
            </span>
          )}
        </div>
      </div>

      {/* Feedback Alert for error notifications */}
      <FeedbackAlert
        variant="error"
        message={error}
        onClose={() => setError(null)}
      />

      {/* Channel Header Columns (Desktop/Tablet) */}
      <div className="hidden sm:flex items-center justify-between border-b border-brand-border pb-3 text-xs font-bold text-brand-muted uppercase tracking-wider">
        <span>Danh mục thông báo</span>
        <div className="flex items-center gap-12 pr-4">
          <span className="inline-flex items-center gap-1.5 w-20 justify-center">
            <Mail className="h-3.5 w-3.5" />
            Email
          </span>
          <span className="inline-flex items-center gap-1.5 w-24 justify-center">
            <Bell className="h-3.5 w-3.5" />
            Web
          </span>
        </div>
      </div>

      {/* Row Matrix List */}
      <div className="divide-y divide-brand-border">
        {items.map((item) => {
          const { icon: CategoryIcon, colorClass } = getCategoryIcon(item.category);
          const isEmailUpdating = updatingKey === `${item.category}-emailEnabled`;
          const isInAppUpdating = updatingKey === `${item.category}-inAppEnabled`;

          return (
            <div
              key={item.category}
              className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 rounded-2xl px-2 transition-colors"
            >
              {/* Left Column: Icon + Category Info */}
              <div className="flex items-start gap-3.5 max-w-xl">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}
                >
                  <CategoryIcon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-brand-heading">
                      {item.name}
                    </h4>
                    {item.isMandatory && (
                      <Badge variant="warning" className="text-[10px] py-0 px-2">
                        Bắt buộc
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right Column: 2 Switch Controls */}
              <div className="flex items-center justify-end gap-10 sm:gap-12 pl-12 sm:pl-0 pr-2">
                {/* Email Switch */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] font-semibold text-brand-muted sm:hidden">
                    Email
                  </span>
                  <div className="flex items-center justify-center w-20">
                    <Switch
                      checked={item.emailEnabled}
                      disabled={item.isMandatory || isEmailUpdating}
                      aria-label={`Bật/tắt thông báo email cho ${item.name}`}
                      onCheckedChange={(checked) =>
                        handleToggle(item.category, "emailEnabled", checked)
                      }
                    />
                  </div>
                </div>

                {/* In-App / Web Switch */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[11px] font-semibold text-brand-muted sm:hidden">
                    Web
                  </span>
                  <div className="flex items-center justify-center w-24">
                    <Switch
                      checked={item.inAppEnabled}
                      disabled={item.isMandatory || isInAppUpdating}
                      aria-label={`Bật/tắt thông báo trên web cho ${item.name}`}
                      onCheckedChange={(checked) =>
                        handleToggle(item.category, "inAppEnabled", checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
