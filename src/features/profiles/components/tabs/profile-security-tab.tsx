"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Laptop,
  Check,
  ShieldAlert,
  Info,
  X,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { FeedbackAlert } from "@/features/feedback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { changePasswordAction } from "../../actions/security.actions";
import { DeviceSessionsCard } from "./device-sessions-card";
import { ChangeEmailDialog } from "./change-email-dialog";
import { AccountDeletionCard } from "./account-deletion-card";

interface ProfileSecurityTabProps {
  email?: string;
}

export function ProfileSecurityTab({
  email = "",
}: ProfileSecurityTabProps = {}) {
  const [currentEmail, setCurrentEmail] = useState(email);
  const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (email) {
      setCurrentEmail(email);
    }
  }, [email]);

  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (message?.type === "success") {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Tiêu chuẩn mật khẩu
  const hasMinLength = newPassword.length >= 12;
  const isDifferent = Boolean(
    newPassword && currentPassword && newPassword !== currentPassword,
  );
  const isMatching = Boolean(
    newPassword && confirmPassword && newPassword === confirmPassword,
  );
  const isFormValid = Boolean(
    currentPassword && hasMinLength && isDifferent && isMatching,
  );

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setMessage(null);
    setIsConfirmOpen(true);
  };

  const handleExecuteChangePassword = async () => {
    setLoading(true);
    setMessage(null);

    const result = await changePasswordAction({
      currentPassword,
      newPassword,
      confirmPassword,
      revokeOtherSessions,
    });

    setLoading(false);
    setIsConfirmOpen(false);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Đổi mật khẩu thành công!",
      });
      // Reset form sạch sẽ
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage({
        type: "error",
        text:
          result.error?.message ||
          "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Form Đổi mật khẩu & Thiết bị đăng nhập (col-span-8) */}
      <div className="lg:col-span-8 space-y-6">
        <form
          onSubmit={handleOpenConfirm}
          noValidate
          className="bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border shadow-sm space-y-6"
        >
          {/* Header with Title and Submit Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FFF4F1] text-brand-plum flex items-center justify-center shrink-0">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-heading">
                  Đổi mật khẩu
                </h3>
                <p className="text-[13px] font-semibold text-brand-muted mt-0.5">
                  Cập nhật mật khẩu định kỳ giúp bảo vệ tài khoản của bạn tốt
                  hơn.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="px-6 py-2.5 rounded-xl font-bold bg-brand-plum text-white hover:bg-brand-dark transition-all disabled:opacity-40 shrink-0 self-end sm:self-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </div>

          {/* Smooth Message Alert */}
          <FeedbackAlert
            variant={message?.type}
            message={message?.text}
            onClose={() => setMessage(null)}
            className="mt-4"
          />

          {/* Form Fields: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">
            {/* Cột 1: 3 Input Mật khẩu */}
            <div className="md:col-span-7 space-y-4">
              <Input
                label="Mật khẩu hiện tại"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu đang sử dụng"
                required
              />

              <Input
                label="Mật khẩu mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 12 ký tự"
                required
              />

              <Input
                label="Nhập lại mật khẩu mới"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
                required
              />
            </div>

            {/* Cột 2: Tiêu chuẩn bảo mật mật khẩu */}
            <div className="md:col-span-5 h-full">
              <div className="p-5 rounded-2xl bg-brand-cream/40 border border-brand-border/60 space-y-4 h-full flex flex-col justify-between">
                <div>
                  <div className="font-bold text-brand-heading text-xs sm:text-sm flex items-center gap-1.5 mb-3">
                    <Info className="h-4 w-4 text-brand-plum shrink-0" />
                    <span>Tiêu chuẩn bảo mật mật khẩu:</span>
                  </div>

                  <div className="space-y-3 text-xs font-medium">
                    <div
                      className={`flex items-center gap-2.5 transition-colors ${
                        hasMinLength
                          ? "text-[#2E7D32] font-semibold"
                          : "text-brand-muted"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          hasMinLength
                            ? "bg-[#EAF7ED] text-[#2E7D32]"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>Tối thiểu 12 ký tự</span>
                    </div>

                    <div
                      className={`flex items-center gap-2.5 transition-colors ${
                        isDifferent
                          ? "text-[#2E7D32] font-semibold"
                          : "text-brand-muted"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isDifferent
                            ? "bg-[#EAF7ED] text-[#2E7D32]"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>Khác mật khẩu cũ</span>
                    </div>

                    <div
                      className={`flex items-center gap-2.5 transition-colors ${
                        isMatching
                          ? "text-[#2E7D32] font-semibold"
                          : "text-brand-muted"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isMatching
                            ? "bg-[#EAF7ED] text-[#2E7D32]"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>Mật khẩu trùng khớp</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-brand-muted/80 leading-relaxed pt-3 border-t border-brand-border/40">
                  Mật khẩu mạnh bảo vệ an toàn cho tài khoản và các dữ liệu của
                  bạn trên FoundMatch.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Card: Email đăng nhập */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#FFF4F1] text-brand-plum flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-brand-heading">
                  Email đăng nhập
                </h3>
                <p className="text-[13px] font-semibold text-brand-muted mt-0.5">
                  Địa chỉ email chính dùng để đăng nhập và nhận các thông báo
                  bảo mật quan trọng.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChangeEmailOpen(true)}
              className="px-5 py-2.5 rounded-xl font-bold border-brand-border text-brand-heading hover:bg-brand-cream/40 transition-all shrink-0 self-start sm:self-auto"
            >
              Thay đổi email
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-brand-cream/40 border border-brand-border/60">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm font-bold text-brand-heading truncate">
                {currentEmail || "Chưa thiết lập"}
              </span>
              {currentEmail && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF7ED] text-[#2E7D32] shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Đã xác minh
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card: Thiết bị đã đăng nhập */}
        <DeviceSessionsCard />

        <AccountDeletionCard />
      </div>

      {/* Right Column: Bảo mật & Khuyến nghị (col-span-4) */}
      <div className="lg:col-span-4 bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#FFF4F1] text-brand-plum flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-extrabold text-brand-heading">
              Trung tâm Bảo mật
            </h4>
            <p className="text-[12px] font-semibold text-brand-muted">
              Nguyên tắc bảo vệ tài khoản
            </p>
          </div>
        </div>

        <div className="h-px bg-brand-border w-full" />

        {/* Security item 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-heading">
            <ShieldAlert className="h-4 w-4 text-brand-plum shrink-0" />
            <span className="text-[13px] font-bold">
              Bảo vệ mật khẩu cá nhân
            </span>
          </div>
          <p className="text-[12px] leading-relaxed text-brand-muted font-medium pl-6">
            Không sử dụng lại mật khẩu từ các website hoặc ứng dụng khác. Không
            chia sẻ thông tin đăng nhập với bất kỳ ai, kể cả nhân viên hỗ trợ
            FoundMatch.
          </p>
        </div>

        {/* Security item 2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-heading">
            <Laptop className="h-4 w-4 text-brand-found shrink-0" />
            <span className="text-[13px] font-bold">
              Đăng xuất khỏi thiết bị lạ
            </span>
          </div>
          <p className="text-[12px] leading-relaxed text-brand-muted font-medium pl-6">
            Mỗi khi đổi mật khẩu, bạn có thể chọn đăng xuất khỏi tất cả các
            thiết bị khác để đảm bảo không còn ai đang truy cập trái phép.
          </p>
        </div>

        {/* Security item 3 */}
        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-brand-border/60 text-[11px] text-brand-muted font-semibold leading-relaxed">
          FoundMatch áp dụng cơ chế xác thực phiên hai lớp (Cookie session cô
          lập), tự động xoay mã token (Token rotation) để chống đánh cắp phiên
          làm việc.
        </div>
      </div>

      {/* Confirmation Dialog khi đổi mật khẩu */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent maxWidth="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận đổi mật khẩu</DialogTitle>
            <DialogDescription>
              Mật khẩu đăng nhập của bạn sẽ được cập nhật ngay lập tức.
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <div className="p-3.5 rounded-xl bg-brand-cream/50 border border-brand-border/60">
              <Checkbox
                id="revoke-other-sessions"
                checked={revokeOtherSessions}
                onChange={(e) => setRevokeOtherSessions(e.target.checked)}
                label={
                  <span className="text-xs font-bold text-brand-heading">
                    Đăng xuất khỏi tất cả các thiết bị khác sau khi đổi mật khẩu
                  </span>
                }
              />
              <p className="text-[11px] text-brand-muted font-medium mt-1.5 pl-7">
                Khuyến nghị bật để đảm bảo an toàn nếu bạn nghi ngờ tài khoản bị
                lộ mật khẩu cũ.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setIsConfirmOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={handleExecuteChangePassword}
              className="bg-brand-plum text-white hover:bg-brand-dark"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang đổi mật khẩu...
                </>
              ) : (
                "Xác nhận đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Thay đổi Email qua OTP */}
      <ChangeEmailDialog
        open={isChangeEmailOpen}
        onOpenChange={setIsChangeEmailOpen}
        currentEmail={currentEmail}
        onEmailChanged={(newEmail) => {
          setCurrentEmail(newEmail);
          setMessage({
            type: "success",
            text: "Đổi email thành công! Các phiên đăng nhập trên thiết bị khác đã được thu hồi an toàn.",
          });
        }}
      />
    </div>
  );
}
