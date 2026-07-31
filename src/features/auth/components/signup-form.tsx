"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { signUpWithPassword } from "../actions/auth.actions";
import {
  User,
  Mail,
  AtSign,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface SignUpFormProps {
  onSuccess?: () => void;
  nextUrl?: string;
}

export function SignUpForm({
  onSuccess,
  nextUrl = "/profile",
}: SignUpFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      setMessage({
        type: "error",
        text: "Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await signUpWithPassword({
      email,
      username: username || email.split("@")[0],
      fullName,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      setMessage({
        type: "success",
        text:
          result.message || "Tạo tài khoản thành công! Đang chuyển hướng...",
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        router.push(nextUrl);
      }, 600);
    } else {
      setMessage({
        type: "error",
        text:
          result.error?.message ||
          "Tạo tài khoản thất bại. Vui lòng kiểm tra lại thông tin.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A1B17]">
          Tạo tài khoản
        </h2>
        <p className="text-xs sm:text-sm text-[#7A6E67]">
          Đăng ký nhanh chóng để bắt đầu tìm lại hoặc trả lại những món đồ thất
          lạc.
        </p>
      </div>

      {message && (
        <div
          className={`flex items-start gap-2.5 p-3.5 rounded-xl text-xs font-semibold border ${
            message.type === "success"
              ? "bg-[#F3F9F1] border-[#C4E1BE] text-[#37783C]"
              : "bg-[#FFF4F1] border-[#FFC7BA] text-[#BF403F]"
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
          label="Họ và tên"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Nhập họ và tên của bạn"
          icon={<User className="h-4 w-4" />}
          required
        />

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          icon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tạo mật khẩu"
          hint="Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ, số và ký tự đặc biệt."
          icon={<Lock className="h-4 w-4" />}
          required
        />

        <Input
          label="Xác nhận mật khẩu"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Nhập lại mật khẩu"
          icon={<Lock className="h-4 w-4" />}
          required
        />

        {/* Agree terms */}
        <div className="pt-1">
          <Checkbox
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            label={
              <span>
                Tôi đồng ý với{" "}
                <a
                  href="#terms"
                  className="font-bold text-[#5B0E2D] hover:underline"
                >
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a
                  href="#privacy"
                  className="font-bold text-[#5B0E2D] hover:underline"
                >
                  Chính sách bảo mật
                </a>{" "}
                của FoundMatch.
              </span>
            }
          />
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
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Đang tạo tài
              khoản...
            </>
          ) : (
            "Tạo tài khoản"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-[#EFE8DF] w-full" />
        <span className="bg-white px-3 text-[11px] font-semibold text-[#7A6E67] uppercase absolute">
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

      {/* Login link */}
      <div className="text-center text-xs text-[#7A6E67] pt-2">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="font-bold text-[#5B0E2D] hover:underline"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
