"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AtSign, Loader2, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  FeedbackAlert,
  normalizeApiError,
  resolveApiFormFieldErrors,
  type AppError,
} from "@/features/feedback";
import {
  createWebRegistration,
} from "../api/email-verification-api";

interface SignUpFormProps {
  nextUrl?: string;
  onSuccess?: () => void;
}

export function SignUpForm({
  nextUrl = "/profile",
  onSuccess,
}: SignUpFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<AppError | string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    if (!agreeTerms) {
      setFormError(
        "Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setFieldErrors({
        confirmPassword: "Mật khẩu xác nhận không trùng khớp.",
      });
      return;
    }

    setLoading(true);
    try {
      const verification = await createWebRegistration({
        email,
        fullName,
        password,
        username: username || email.split("@")[0],
      });
      onSuccess?.();
      const params = new URLSearchParams({
        verificationId: verification.verificationId,
      });
      if (nextUrl !== "/profile") params.set("next", nextUrl);
      router.replace(`/verify-email?${params.toString()}`);
    } catch (error) {
      const normalized = normalizeApiError(error, "Không thể tạo tài khoản. Vui lòng thử lại.");
      setFieldErrors(resolveApiFormFieldErrors(error));
      setFormError(normalized);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-extrabold text-brand-heading sm:text-3xl">
          Tạo tài khoản
        </h2>
        <p className="text-xs text-brand-muted sm:text-sm">
          Đăng ký để bắt đầu tìm lại hoặc trao trả đồ thất lạc.
        </p>
      </div>

      <FeedbackAlert error={formError} />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          autoComplete="name"
          error={fieldErrors.fullName}
          icon={<User className="h-4 w-4" />}
          label="Họ và tên"
          maxLength={100}
          minLength={2}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Nhập họ và tên của bạn"
          required
          value={fullName}
        />
        <Input
          autoCapitalize="none"
          autoComplete="username"
          error={fieldErrors.username}
          icon={<AtSign className="h-4 w-4" />}
          label="Tên đăng nhập"
          maxLength={30}
          minLength={3}
          onChange={(event) => setUsername(event.target.value)}
          pattern="[a-zA-Z0-9._-]+"
          placeholder="Ví dụ: nguyenvanan"
          value={username}
        />
        <Input
          autoCapitalize="none"
          autoComplete="email"
          error={fieldErrors.email}
          icon={<Mail className="h-4 w-4" />}
          label="Email"
          maxLength={320}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Nhập email của bạn"
          required
          type="email"
          value={email}
        />
        <Input
          autoComplete="new-password"
          error={fieldErrors.password}
          hint="Sử dụng ít nhất 12 ký tự."
          icon={<Lock className="h-4 w-4" />}
          label="Mật khẩu"
          minLength={12}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Tạo mật khẩu"
          required
          type="password"
          value={password}
        />
        <Input
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          icon={<Lock className="h-4 w-4" />}
          label="Xác nhận mật khẩu"
          minLength={12}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Nhập lại mật khẩu"
          required
          type="password"
          value={confirmPassword}
        />

        <Checkbox
          checked={agreeTerms}
          label={
            <span>
              Tôi đồng ý với{" "}
              <a
                className="font-bold text-brand-plum hover:underline"
                href="#terms"
              >
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a
                className="font-bold text-brand-plum hover:underline"
                href="#privacy"
              >
                Chính sách bảo mật
              </a>
              .
            </span>
          }
          onChange={(event) => setAgreeTerms(event.target.checked)}
        />

        <Button
          className="mt-2"
          disabled={loading}
          fullWidth
          size="lg"
          type="submit"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tạo tài
              khoản...
            </>
          ) : (
            "Tạo tài khoản"
          )}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-brand-border" />
        <span className="absolute bg-white px-3 text-[11px] font-semibold uppercase text-brand-muted">
          hoặc
        </span>
      </div>

      <Button fullWidth size="md" type="button" variant="google">
        <svg aria-hidden="true" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
          />
        </svg>
        Tiếp tục với Google
      </Button>

      <div className="text-center text-xs text-brand-muted">
        Đã có tài khoản?{" "}
        <Link
          className="font-bold text-brand-plum hover:underline"
          href="/login"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
