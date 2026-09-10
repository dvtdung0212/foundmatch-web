"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  getWebSessionPolicy,
  loginWeb,
  loginWebDemo,
} from "../api/session-api";
import { DEMO_PERSONAS } from "@/types/auth.types";
import {
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface LoginFormProps {
  nextUrl?: string;
  onSuccess?: () => void;
}

function resolveLoginDestination(nextUrl?: string): string {
  if (!nextUrl || nextUrl === "/profile") return "/";

  try {
    const baseUrl = "https://foundmatch.local";
    const candidate = new URL(nextUrl, baseUrl);
    if (candidate.origin !== baseUrl) return "/";
    return `${candidate.pathname}${candidate.search}${candidate.hash}`;
  } catch {
    return "/";
  }
}

export function LoginForm({ nextUrl, onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [rememberLoginEnabled, setRememberLoginEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const completeLogin = () => {
    if (onSuccess) onSuccess();
    router.replace(resolveLoginDestination(nextUrl));
    router.refresh();
  };

  useEffect(() => {
    void getWebSessionPolicy()
      .then((policy) =>
        setRememberLoginEnabled(policy?.rememberLoginEnabled === true),
      )
      .catch(() => setRememberLoginEnabled(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await loginWeb({
        identifier,
        password,
        rememberLogin: rememberLoginEnabled && rememberMe,
      });
      completeLogin();
    } catch (error) {
      const candidate = error as {
        data?: {
          code?: string;
          details?: {
            maskedEmail?: string;
            verificationId?: string;
          };
          message?: string;
        };
        message?: string;
      };

      const verificationId = candidate.data?.details?.verificationId;
      if (
        candidate.data?.code === "EMAIL_VERIFICATION_REQUIRED" &&
        verificationId
      ) {
        const params = new URLSearchParams({
          verificationId,
          notice: "verification_required",
        });
        if (nextUrl && nextUrl !== "/profile") {
          params.set("next", nextUrl);
        }
        router.replace(`/verify-email?${params.toString()}`);
        return;
      }

      setMessage({
        type: "error",
        text:
          candidate.data?.message ??
          candidate.message ??
          "Email, tên đăng nhập hoặc mật khẩu không chính xác.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (personaEmail: string) => {
    setDemoLoading(personaEmail);
    setMessage(null);

    try {
      await loginWebDemo(personaEmail);
      completeLogin();
    } catch (error) {
      const candidate = error as {
        data?: { message?: string };
        message?: string;
      };
      setMessage({
        type: "error",
        text:
          candidate.data?.message ??
          candidate.message ??
          "Không thể đăng nhập tài khoản Demo.",
      });
    } finally {
      setDemoLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-heading">
          Đăng nhập
        </h2>
        <p className="text-xs sm:text-sm text-brand-muted">
          Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
        </p>
      </div>

      {message && (
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-semibold border ${
            message.type === "success"
              ? "bg-brand-foundBg border-[#C4E1BE] text-brand-found"
              : "bg-brand-lostBg border-[#FFC7BA] text-brand-lost"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email hoặc Username"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Nhập email hoặc username của bạn"
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu của bạn"
          icon={<Lock className="h-4 w-4" />}
          required
        />

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between pt-1">
          {rememberLoginEnabled ? (
            <Checkbox
              label="Ghi nhớ đăng nhập"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          ) : (
            <span />
          )}
          <Link
            href="/forgot-password"
            className="text-xs font-bold text-brand-plum hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={loading}
          className="mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Đang đăng
              nhập...
            </>
          ) : (
            "Đăng nhập"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-brand-border w-full" />
        <span className="bg-white px-3 text-[11px] font-semibold text-brand-muted uppercase absolute">
          hoặc
        </span>
      </div>

      {/* Google Auth Button */}
      <Button variant="google" size="md" fullWidth type="button">
        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Tiếp tục với Google
      </Button>

      {/* Demo Personas Switcher */}
      <div className="pt-3 border-t border-brand-border space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-muted block">
          Đăng nhập nhanh Demo Personas
        </span>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_PERSONAS.map((persona) => (
            <button
              key={persona.email}
              type="button"
              disabled={!!demoLoading}
              onClick={() => handleDemoLogin(persona.email)}
              className="flex flex-col items-start p-2 rounded-xl border border-brand-border bg-brand-cream/60 hover:bg-brand-cream text-left transition-all text-xs"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-brand-heading truncate">
                  {persona.name}
                </span>
                {demoLoading === persona.email && (
                  <Loader2 className="h-3 w-3 animate-spin text-brand-plum" />
                )}
              </div>
              <span className="text-[10px] text-brand-muted uppercase font-semibold">
                {persona.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Signup link */}
      <div className="text-center text-xs text-brand-muted pt-2">
        Chưa có tài khoản?{" "}
        <Link
          href="/signup"
          className="font-bold text-brand-plum hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>

      {/* Security badge at bottom */}
      <div className="mt-6 flex items-center gap-3 p-3.5 rounded-2xl bg-brand-cream border border-brand-border text-xs text-brand-muted">
        <div className="p-2 rounded-xl bg-white text-brand-plum border border-brand-border shrink-0">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <p className="leading-tight text-[11px]">
          Thông tin của bạn được bảo vệ an toàn với mã hóa SSL và không chia sẻ
          với bên thứ ba.
        </p>
      </div>
    </div>
  );
}
