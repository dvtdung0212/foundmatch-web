"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Laptop,
  Smartphone,
  Monitor,
  LogOut,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  getWebSessionsAction,
  revokeWebSessionAction,
  revokeOtherWebSessionsAction,
  type WebSessionItem,
} from "../../actions/security.actions";
import { FeedbackAlert } from "@/features/feedback";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface DeviceSession {
  id: string;
  name: string;
  browser?: string;
  lastActive?: string;
  location: string | null;
  isCurrent: boolean;
  type: "laptop" | "phone" | "desktop";
}

function formatSessionDate(dateVal?: string | Date): string {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DeviceSessionsCard() {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToRevoke, setSessionToRevoke] = useState<DeviceSession | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [isRevokeAllOpen, setIsRevokeAllOpen] = useState(false);
  const [revokingAll, setRevokingAll] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    const res = await getWebSessionsAction();
    setIsLoading(false);

    if (res.success && res.sessions && res.sessions.length > 0) {
      const mapped: DeviceSession[] = res.sessions.map((s: WebSessionItem) => {
        let name = s.deviceName;
        let type = s.deviceType;
        let browser = s.clientName;

        if (!name || name === "Thiết bị Web") {
          name = "Phiên trình duyệt trước đây";
        }

        return {
          id: s.id,
          name,
          browser,
          lastActive: formatSessionDate(s.lastSeenAt || s.createdAt),
          location: s.location,
          isCurrent: s.isCurrent,
          type,
        };
      });
      mapped.sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0));
      setSessions(mapped);
    } else {
      setSessions([]);
      if (!res.success) {
        setFeedback({
          type: "error",
          message: res.error || "Không thể tải danh sách phiên đăng nhập.",
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchSessions();

    const handleFocus = () => {
      fetchSessions();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchSessions]);

  const handleConfirmRevoke = async () => {
    if (!sessionToRevoke) return;
    setRevoking(true);
    setFeedback(null);

    const res = await revokeWebSessionAction(sessionToRevoke.id);
    setRevoking(false);

    if (res.success) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionToRevoke.id));
      setFeedback({
        type: "success",
        message: res.message || "Đã đăng xuất thiết bị thành công.",
      });
      setSessionToRevoke(null);
    } else {
      setFeedback({
        type: "error",
        message: res.error?.message || "Đăng xuất thiết bị thất bại.",
      });
    }
  };

  const handleConfirmRevokeAll = async () => {
    setRevokingAll(true);
    setFeedback(null);

    const res = await revokeOtherWebSessionsAction();
    setRevokingAll(false);

    if (res.success) {
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setFeedback({
        type: "success",
        message: res.message || "Đã đăng xuất tất cả các thiết bị khác thành công.",
      });
      setIsRevokeAllOpen(false);
    } else {
      setFeedback({
        type: "error",
        message: res.error?.message || "Đăng xuất các thiết bị khác thất bại.",
      });
    }
  };

  return (
    <div className="bg-white rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 border border-brand-border shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Thiết bị đã đăng nhập ({sessions.length})
        </h3>
        <button
          type="button"
          onClick={() => fetchSessions()}
          disabled={isLoading}
          title="Làm mới danh sách phiên"
          aria-label="Làm mới danh sách phiên"
          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-plum hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin text-brand-plum" : ""}`}
          />
        </button>
      </div>

      <FeedbackAlert
        variant={feedback?.type}
        message={feedback?.message}
        onClose={() => setFeedback(null)}
      />

      <div className="space-y-6" role="list" aria-label="Danh sách thiết bị đã đăng nhập" aria-busy={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-brand-muted" role="status">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Đang tải phiên đăng nhập...
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-brand-muted" role="status">
            Không có phiên đăng nhập nào để hiển thị.
          </p>
        ) : sessions.map((session) => (
          <div
            key={session.id}
            role="listitem"
            className="flex items-center justify-between gap-4 group"
          >
            {/* Left: Device Icon & Info */}
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="shrink-0 flex items-center justify-center text-slate-700">
                {session.type === "phone" ? (
                  <Smartphone className="h-[22px] w-[22px] stroke-[1.75]" />
                ) : session.type === "desktop" ? (
                  <Monitor className="h-[22px] w-[22px] stroke-[1.75]" />
                ) : (
                  <Laptop className="h-[22px] w-[22px] stroke-[1.75]" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] sm:text-[15px] font-bold text-slate-900 tracking-tight truncate">
                  {session.name}
                </div>
                <div className="text-[12px] sm:text-[13px] text-slate-500 font-medium truncate mt-0.5">
                  {session.browser} · {session.location || "Không xác định"} · {session.lastActive}
                </div>
              </div>
            </div>

            {/* Right: Current Badge or Browser & Last active & Revoke */}
            <div className="shrink-0 text-right flex items-center gap-3">
              {session.isCurrent ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-[#EAF7ED] text-[#2E7D32]">
                  Thiết bị hiện tại
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setFeedback(null);
                      setSessionToRevoke(session);
                    }}
                    title="Đăng xuất thiết bị này"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-lost hover:bg-red-50 transition-colors"
                    aria-label={`Đăng xuất khỏi ${session.name}`}
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {sessions.filter((s) => !s.isCurrent).length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setFeedback(null);
              setIsRevokeAllOpen(true);
            }}
            className="text-[13px] font-bold text-brand-lost hover:text-red-700 transition-colors flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất tất cả thiết bị khác ({sessions.filter((s) => !s.isCurrent).length})
          </button>
        </div>
      )}

      {/* Confirmation Modal to revoke ALL other sessions */}
      <Dialog
        open={isRevokeAllOpen}
        onOpenChange={(open) => {
          if (!open && !revokingAll) setIsRevokeAllOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-brand-heading">
              Đăng xuất tất cả thiết bị khác?
            </DialogTitle>
            <DialogDescription className="text-sm text-brand-muted leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi tất cả các thiết bị và phiên làm việc khác? Chỉ duy nhất thiết bị hiện tại này được giữ lại.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={revokingAll}
              onClick={() => setIsRevokeAllOpen(false)}
              className="rounded-xl px-4 font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={revokingAll}
              onClick={handleConfirmRevokeAll}
              className="rounded-xl px-4 font-bold bg-brand-lost text-white hover:bg-red-700"
            >
              {revokingAll ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                "Đăng xuất tất cả"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal to revoke session */}
      <Dialog
        open={sessionToRevoke !== null}
        onOpenChange={(open) => {
          if (!open && !revoking) setSessionToRevoke(null);
        }}
      >
        <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-brand-heading">
              Đăng xuất khỏi thiết bị?
            </DialogTitle>
            <DialogDescription className="text-sm text-brand-muted leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất phiên hoạt động trên thiết bị{" "}
              <strong className="text-brand-heading">
                {sessionToRevoke?.name}
              </strong>{" "}
              {sessionToRevoke?.location
                ? ` tại ${sessionToRevoke.location}`
                : ""}
              . Thiết bị này sẽ bị ngắt kết nối và cần đăng nhập lại.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={revoking}
              onClick={() => setSessionToRevoke(null)}
              className="rounded-xl px-4 font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={revoking}
              onClick={handleConfirmRevoke}
              className="rounded-xl px-4 font-bold bg-brand-lost text-white hover:bg-red-700"
            >
              {revoking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang đăng xuất...
                </>
              ) : (
                "Đăng xuất"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
