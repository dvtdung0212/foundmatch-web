"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpPinInput } from "@/components/ui/otp-pin-input";
import {
  requestEmailChangeAction,
  verifyEmailChangeAction,
  resendEmailChangeOtpAction,
} from "../../actions/security.actions";
import {
  requestEmailChangeSchema,
  verifyEmailChangeSchema,
} from "@/features/auth/schemas/auth.schema";
import { FeedbackAlert, useZodFormValidation } from "@/features/feedback";
import { Mail, KeyRound, AlertCircle, CheckCircle2, ArrowLeft, RefreshCw, X } from "lucide-react";

interface ChangeEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEmail: string;
  onEmailChanged: (newEmail: string) => void;
}

export function ChangeEmailDialog({
  open,
  onOpenChange,
  currentEmail,
  onEmailChanged,
}: ChangeEmailDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const validation = useZodFormValidation(requestEmailChangeSchema);
  const { setFieldErrors } = validation;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1 Validation Check
  const isStep1Valid = Boolean(
    currentPassword.trim().length > 0 &&
      newEmail.trim().length > 0 &&
      !validation.fieldErrors.currentPassword &&
      !validation.fieldErrors.newEmail &&
      requestEmailChangeSchema.safeParse({
        currentPassword,
        newEmail: newEmail.trim(),
        currentEmail,
      }).success,
  );

  // Step 2 OTP state
  const [verificationId, setVerificationId] = useState("");
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset state on open/close
  useEffect(() => {
    if (open) {
      setStep(1);
      setCurrentPassword("");
      setNewEmail("");
      setFieldErrors({});
      setError(null);
      setVerificationId("");
      setOtp("");
      setResendCountdown(60);
      setIsSubmitting(false);
      setIsVerifying(false);
      setIsResending(false);
      setSuccess(null);
    }
  }, [open, setFieldErrors]);

  // Resend countdown timer
  useEffect(() => {
    if (step !== 2 || resendCountdown <= 0) return;

    const timer = setInterval(() => {
      setResendCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  // Step 1: Request Email Change
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = newEmail.trim();
    const values = validation.validate({
      currentPassword,
      newEmail: trimmedEmail,
      currentEmail,
    });

    if (!values) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await requestEmailChangeAction({
        currentPassword: values.currentPassword,
        newEmail: values.newEmail,
      });

      if (!result.success || !result.data) {
        const errMsg = result.error?.message || "Không thể gửi yêu cầu đổi email.";
        if (
          errMsg.toLowerCase().includes("mật khẩu") ||
          result.error?.code === "INVALID_PASSWORD" ||
          result.error?.code === "PASSWORD_MISMATCH"
        ) {
          validation.setFieldErrors({ currentPassword: errMsg });
          setError(null);
        } else if (
          errMsg.toLowerCase().includes("email") ||
          result.error?.code === "EMAIL_ALREADY_EXISTS" ||
          result.error?.code === "INVALID_EMAIL"
        ) {
          validation.setFieldErrors({ newEmail: errMsg });
          setError(null);
        } else {
          setError(errMsg);
          validation.setFieldErrors({});
        }
        setIsSubmitting(false);
        return;
      }

      setVerificationId(result.data.verificationId);
      setStep(2);
      setOtp("");
      setResendCountdown(60);
      setError(null);
      validation.setFieldErrors({});
    } catch {
      setError("Đã xảy ra lỗi khi kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = verifyEmailChangeSchema.safeParse({
      verificationId,
      code: otp,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Vui lòng nhập đầy đủ 6 chữ số mã xác thực.");
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyEmailChangeAction({
        code: otp,
        verificationId,
      });

      if (!result.success || !result.email) {
        setError(result.error?.message || "Mã xác thực không chính xác hoặc đã hết hạn.");
        setIsVerifying(false);
        return;
      }

      setSuccess("Đổi email thành công! Đang cập nhật...");
      onEmailChanged(result.email);

      setTimeout(() => {
        onOpenChange(false);
      }, 1500);
    } catch {
      setError("Đã xảy ra lỗi khi xác thực mã OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResending) return;

    setIsResending(true);
    setError(null);
    try {
      const result = await resendEmailChangeOtpAction(verificationId);
      if (!result.success) {
        setError(result.error?.message || "Không thể gửi lại mã xác thực.");
        setIsResending(false);
        return;
      }

      setResendCountdown(60);
      setOtp("");
    } catch {
      setError("Không thể kết nối đến máy chủ để gửi lại mã.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-plum/10 text-brand-plum">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-brand-heading">
                {step === 1 ? "Thay đổi email đăng nhập" : "Xác thực mã OTP"}
              </DialogTitle>
              <DialogDescription className="text-xs text-brand-muted">
                {step === 1
                  ? "Nhập mật khẩu hiện tại và email mới bạn muốn liên kết"
                  : `Nhập mã 6 chữ số được gửi tới ${newEmail}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Error & Success Feedback Alerts with smooth entrance and exit animations */}
        <FeedbackAlert
          error={error}
          onClose={() => setError(null)}
          className="mt-2"
        />
        <FeedbackAlert
          variant="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mt-2"
        />

        {step === 1 ? (
          <form method="POST" onSubmit={handleRequestSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-heading uppercase tracking-wider mb-1.5">
                Email hiện tại
              </label>
              <div className="rounded-xl border border-slate-200 bg-slate-100/80 px-4 py-3 text-sm text-slate-500 font-medium">
                {currentEmail}
              </div>
            </div>

            <div>
              <Input
                label="Mật khẩu hiện tại"
                type="password"
                placeholder="Nhập mật khẩu của tài khoản..."
                icon={<KeyRound className="h-4 w-4" />}
                value={currentPassword}
                error={validation.fieldErrors.currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError(null);
                  validation.clearFieldError("currentPassword");
                }}
                disabled={isSubmitting}
                required
              />
            </div>

            <div>
              <Input
                label="Địa chỉ email mới"
                type="email"
                placeholder="vidu@example.com"
                icon={<Mail className="h-4 w-4" />}
                value={newEmail}
                error={validation.fieldErrors.newEmail}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewEmail(val);
                  setError(null);
                  if (val.trim() === "") {
                    validation.clearFieldError("newEmail");
                  } else {
                    validation.validateField("newEmail", {
                      currentPassword,
                      newEmail: val.trim(),
                      currentEmail,
                    });
                  }
                }}
                onBlur={() => {
                  if (newEmail.trim() !== "") {
                    validation.validateField("newEmail", {
                      currentPassword,
                      newEmail: newEmail.trim(),
                      currentEmail,
                    });
                  }
                }}
                disabled={isSubmitting}
                required
              />
            </div>

            <DialogFooter className="mt-6 flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={!isStep1Valid || isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang gửi mã...
                  </span>
                ) : (
                  "Tiếp tục gửi mã"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form method="POST" onSubmit={handleVerifySubmit} noValidate className="space-y-5">
            <div className="rounded-xl bg-brand-cream/40 border border-brand-border/60 p-4 text-center">
              <p className="text-xs text-brand-muted mb-1">
                Mã xác thực đã được gửi đến địa chỉ email
              </p>
              <p className="text-sm font-bold text-brand-heading">{newEmail}</p>
            </div>

            <div className="py-2">
              <OtpPinInput
                value={otp}
                onChange={setOtp}
                disabled={isVerifying || Boolean(success)}
                error={Boolean(error)}
              />
            </div>

            <div className="flex items-center justify-center">
              {resendCountdown > 0 ? (
                <span className="text-xs text-brand-muted">
                  Gửi lại mã sau <strong className="font-bold text-brand-heading">{resendCountdown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-plum hover:underline cursor-pointer disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Đang gửi lại...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      Gửi lại mã OTP
                    </>
                  )}
                </button>
              )}
            </div>

            <DialogFooter className="mt-6 flex items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep(1);
                  setError(null);
                }}
                disabled={isVerifying || Boolean(success)}
                className="gap-1.5 text-xs text-brand-heading border-brand-border hover:bg-brand-cream/80"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Quay lại
              </Button>

              <Button
                type="submit"
                disabled={otp.length !== 6 || isVerifying || Boolean(success)}
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang xác thực...
                  </span>
                ) : (
                  "Xác nhận đổi email"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
