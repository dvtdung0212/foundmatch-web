"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/ui/otp-input";
import {
  FeedbackAlert,
  normalizeApiError,
  useZodFormValidation,
} from "@/features/feedback";
import { accountReactivationSchema } from "../schemas/auth.schema";
import {
  getWebAccountReactivation,
  resendWebAccountReactivation,
  verifyWebAccountReactivation,
} from "../api/account-lifecycle-api";
import { AuthOperationSuccess } from "./auth-operation-success";

type ReactivationContext = Awaited<
  ReturnType<typeof getWebAccountReactivation>
>;

export function AccountReactivationForm({
  verificationId,
}: {
  verificationId: string;
}) {
  const [context, setContext] = useState<ReactivationContext | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const validation = useZodFormValidation(accountReactivationSchema);

  useEffect(() => {
    let active = true;
    void getWebAccountReactivation(verificationId)
      .then((value) => {
        if (active) setContext(value);
      })
      .catch((cause) => {
        if (active) setError(normalizeApiError(cause).message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [verificationId]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const resendSeconds = useMemo(() => {
    if (!context) return 0;
    return Math.max(
      0,
      Math.ceil((new Date(context.resendAvailableAt).getTime() - now) / 1_000),
    );
  }, [context, now]);

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    const values = validation.validate({ code, verificationId });
    if (!values) return;
    setSubmitting(true);
    setError(null);
    try {
      await verifyWebAccountReactivation(values);
      setCompleted(true);
    } catch (cause) {
      setError(normalizeApiError(cause).message);
      await refreshContext();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(null);
    setNotice(null);
    try {
      setContext(await resendWebAccountReactivation(verificationId));
      setCode("");
      setNotice("Mã khôi phục mới đã được gửi.");
    } catch (cause) {
      setError(normalizeApiError(cause).message);
    } finally {
      setResending(false);
    }
  }

  async function refreshContext() {
    try {
      setContext(await getWebAccountReactivation(verificationId));
    } catch {
      // Preserve the actionable error returned by verify.
    }
  }

  if (loading) {
    return (
      <div
        className="flex items-center justify-center gap-2 py-12 text-sm text-brand-muted"
        role="status"
      >
        <Loader2 className="h-5 w-5 animate-spin" /> Đang tải phiên khôi phục...
      </div>
    );
  }

  if (completed) {
    return (
      <AuthOperationSuccess
        actionLabel="Đăng nhập lại"
        description="Yêu cầu xóa đã được hủy và tài khoản đã hoạt động trở lại. Vì lý do bảo mật, bạn cần đăng nhập lại."
        destination="/login?accountReactivated=1"
        title="Khôi phục tài khoản thành công"
      />
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-3 text-center mb-5">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-plum">
          <RotateCcw className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-extrabold text-brand-heading">
            Khôi phục tài khoản
          </h1>
          <p className="text-sm leading-6 text-brand-muted">
            Tài khoản đang chờ xóa. Nhập mã OTP đã gửi đến{" "}
            <strong className="font-bold text-brand-heading">
              {context?.maskedEmail ?? "email của bạn"}
            </strong>{" "}
            để hủy yêu cầu xóa.
          </p>
        </div>
      </div>

      <FeedbackAlert
        variant="success"
        message={notice}
        onClose={() => setNotice(null)}
        className="mb-5"
      />
      <FeedbackAlert
        error={validation.fieldErrors.code ?? error}
        onClose={() => setError(null)}
        className="mb-5"
      />

      {context ? (
        <form noValidate className="space-y-4" onSubmit={handleVerify}>
          <OtpInput
            autoFocus
            disabled={submitting}
            error={validation.fieldErrors.code ?? error ?? undefined}
            hideErrorMessage
            label="Mã khôi phục"
            length={6}
            onChange={(value) => {
              setCode(value);
              validation.clearFieldError("code");
              if (error) setError(null);
            }}
            value={code}
          />
          <Button
            disabled={submitting}
            fullWidth
            loading={submitting}
            size="lg"
            type="submit"
          >
            Xác nhận khôi phục
          </Button>
          <Button
            disabled={resendSeconds > 0 || resending}
            fullWidth
            loading={resending}
            onClick={handleResend}
            type="button"
            variant="outline"
          >
            {resendSeconds > 0 ? `Gửi lại sau ${resendSeconds}s` : "Gửi lại mã"}
          </Button>
        </form>
      ) : (
        <p className="text-center text-sm text-brand-muted" role="alert">
          Phiên khôi phục không còn khả dụng. Vui lòng liên hệ hỗ trợ nếu bạn
          cần trợ giúp.
        </p>
      )}

      <div className="mt-5 text-center">
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
