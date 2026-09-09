"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import {
  EmailVerificationApiError,
  getWebEmailVerification,
  resendWebRegistrationEmailOtp,
  type EmailVerification,
  verifyWebRegistrationEmail,
} from "../api/email-verification-api";

interface EmailVerificationFormProps {
  nextUrl?: string;
  verificationId: string;
}

export function EmailVerificationForm({
  nextUrl,
  verificationId,
}: EmailVerificationFormProps) {
  const router = useRouter();
  const [verification, setVerification] = useState<EmailVerification | null>(
    null,
  );
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const loginUrl = useMemo(() => {
    const params = new URLSearchParams({ emailVerified: "1" });
    if (nextUrl?.startsWith("/") && !nextUrl.startsWith("//")) {
      params.set("next", nextUrl);
    }
    return `/login?${params.toString()}`;
  }, [nextUrl]);

  useEffect(() => {
    let active = true;
    void getWebEmailVerification(verificationId)
      .then((result) => {
        if (!active) return;
        setVerification(result);
        if (result.status === "VERIFIED") router.replace(loginUrl);
      })
      .catch((cause) => {
        if (active) setError(toMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [loginUrl, router, verificationId]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const resendSeconds = verification
    ? Math.max(
        0,
        Math.ceil(
          ((verification.resendAvailableAt
            ? new Date(verification.resendAvailableAt).getTime()
            : now) -
            now) /
            1_000,
        ),
      )
    : 0;
  const locked =
    verification?.status === "LOCKED" &&
    typeof verification.lockedUntil === "string" &&
    new Date(verification.lockedUntil).getTime() > now;
  const expired = verification?.status === "REGISTRATION_EXPIRED";

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError("Mã xác minh phải gồm đúng 6 chữ số.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setNotice(null);
    try {
      await verifyWebRegistrationEmail(verificationId, code);
      router.replace(loginUrl);
    } catch (cause) {
      setError(toMessage(cause));
      await refreshState();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    setNotice(null);
    try {
      const result = await resendWebRegistrationEmailOtp(verificationId);
      setVerification(result);
      setCode("");
      setNotice("Mã xác minh mới đã được gửi.");
    } catch (cause) {
      setError(toMessage(cause));
      await refreshState();
    } finally {
      setResending(false);
    }
  }

  async function refreshState() {
    try {
      setVerification(await getWebEmailVerification(verificationId));
    } catch {
      // Preserve the actionable error from the verify or resend request.
    }
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center gap-2 py-12 text-sm text-brand-muted"
        role="status"
      >
        <Loader2 className="h-5 w-5 animate-spin" /> Đang tải phiên xác minh...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-plum">
          <MailCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-extrabold text-brand-heading">
            Xác minh email
          </h1>
          <p className="text-sm leading-6 text-brand-muted">
            Nhập mã 6 chữ số đã gửi đến{" "}
            <strong className="font-bold text-brand-heading">
              {verification?.maskedEmail ?? "email của bạn"}
            </strong>
            . Không chia sẻ mã này với bất kỳ ai.
          </p>
        </div>
      </div>

      {notice && (
        <div
          className="flex gap-2 rounded-xl border border-brand-foundBorder bg-brand-foundBg p-3.5 text-xs font-semibold text-brand-found"
          role="status"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" /> {notice}
        </div>
      )}
      {error && (
        <div
          className="flex gap-2 rounded-xl border border-brand-lostBorder bg-brand-lostBg p-3.5 text-xs font-semibold text-brand-lost"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {!verification ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-brand-muted">
            Phiên xác minh không khả dụng. Hãy đăng ký lại để nhận mã mới.
          </p>
          <Button
            fullWidth
            onClick={() => router.replace("/signup")}
            type="button"
          >
            Đăng ký lại
          </Button>
        </div>
      ) : expired ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-brand-muted">
            Phiên đăng ký đã hết hạn. Hãy đăng ký lại để nhận mã mới.
          </p>
          <Button
            fullWidth
            onClick={() => router.replace("/signup")}
            type="button"
          >
            Đăng ký lại
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleVerify}>
          <OtpInput
            autoFocus
            disabled={locked || submitting}
            error={error ?? undefined}
            label="Mã xác minh"
            length={6}
            onChange={(newCode) => setCode(newCode)}
            value={code}
          />
          <p className="text-xs text-brand-muted" id="otp-help">
            {locked
              ? `Bạn đã nhập sai quá số lần cho phép. Có thể thử lại sau ${formatTime(verification?.lockedUntil)}.`
              : `Còn ${verification?.attemptsRemaining ?? 0} lần nhập.`}
          </p>
          <Button
            disabled={locked || submitting}
            fullWidth
            loading={submitting}
            size="lg"
            type="submit"
          >
            Xác minh email
          </Button>
          <Button
            disabled={locked || resendSeconds > 0 || resending}
            fullWidth
            loading={resending}
            onClick={handleResend}
            type="button"
            variant="outline"
          >
            {resendSeconds > 0 ? `Gửi lại sau ${resendSeconds}s` : "Gửi lại mã"}
          </Button>
        </form>
      )}

      <div className="text-center">
        <Link
          className="text-sm font-bold text-brand-plum hover:underline"
          href="/login"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}

function toMessage(error: unknown): string {
  if (!(error instanceof EmailVerificationApiError)) {
    return "Không thể xử lý xác minh email. Vui lòng thử lại.";
  }
  const messages: Record<string, string> = {
    OTP_ALREADY_VERIFIED: "Email đã được xác minh.",
    OTP_CODE_EXPIRED: "Mã đã hết hạn. Hãy yêu cầu gửi lại mã mới.",
    OTP_CODE_INVALID: `Mã xác minh không đúng. Còn ${String(error.details?.attemptsRemaining ?? 0)} lần nhập.`,
    OTP_RESEND_COOLDOWN:
      "Bạn vừa yêu cầu gửi mã. Vui lòng chờ trước khi gửi lại.",
    OTP_SEND_LIMIT_EXCEEDED:
      "Bạn đã yêu cầu quá nhiều mã. Vui lòng thử lại sau.",
    OTP_VERIFICATION_EXPIRED: "Phiên đăng ký đã hết hạn.",
    OTP_VERIFICATION_LOCKED:
      "Xác minh đang bị khóa tạm thời do nhập sai quá nhiều lần.",
    OTP_VERIFICATION_NOT_FOUND: "Không tìm thấy phiên xác minh email.",
  };
  return error.code ? (messages[error.code] ?? error.message) : error.message;
}

function formatTime(value?: string | null): string {
  if (!value) return "6 giờ";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
