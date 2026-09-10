"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetWebPassword } from "../api/session-api";
import { AuthOperationSuccess } from "./auth-operation-success";

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (password.length < 12) {
      setError("Mật khẩu phải có ít nhất 12 ký tự.");
      return;
    }
    if (password !== confirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await resetWebPassword(token, password);
      setCompleted(true);
    } catch {
      setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <AuthOperationSuccess
        actionLabel="Đăng nhập lại"
        description="Mật khẩu đã được cập nhật và mọi phiên đăng nhập cũ đã được thu hồi để bảo vệ tài khoản."
        destination="/login"
        title="Đổi mật khẩu thành công"
      />
    );
  }

  if (token.length < 32) {
    return (
      <div className="space-y-5 text-center" role="alert">
        <KeyRound className="mx-auto h-12 w-12 text-brand-lost" />
        <h1 className="text-2xl font-extrabold text-brand-heading">
          Link không hợp lệ
        </h1>
        <p className="text-sm text-brand-muted">
          Hãy yêu cầu một link đặt lại mật khẩu mới.
        </p>
        <Link
          className="font-bold text-brand-plum hover:underline"
          href="/forgot-password"
        >
          Gửi yêu cầu mới
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-brand-heading">
          Đặt mật khẩu mới
        </h1>
        <p className="text-sm text-brand-muted">
          Mật khẩu mới cần có ít nhất 12 ký tự.
        </p>
      </div>
      {error && (
        <div
          className="rounded-xl border border-brand-lostBorder bg-brand-lostBg p-3 text-sm font-semibold text-brand-lost"
          role="alert"
        >
          {error}
        </div>
      )}
      <Input
        autoComplete="new-password"
        label="Mật khẩu mới"
        minLength={12}
        onChange={(event) => setPassword(event.target.value)}
        required
        type="password"
        value={password}
      />
      <Input
        autoComplete="new-password"
        label="Xác nhận mật khẩu"
        minLength={12}
        onChange={(event) => setConfirmation(event.target.value)}
        required
        type="password"
        value={confirmation}
      />
      <Button fullWidth loading={loading} size="lg" type="submit">
        Đặt lại mật khẩu
      </Button>
    </form>
  );
}
