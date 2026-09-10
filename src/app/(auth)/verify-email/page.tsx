import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";
import { PasswordRecoveryPage } from "@/features/auth/components/password-recovery-page";
import Link from "next/link";

interface VerifyEmailPageProps {
  searchParams?: {
    next?: string;
    notice?: string;
    verificationId?: string;
  };
}

export default function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const verificationId = searchParams?.verificationId;
  const initialNotice =
    searchParams?.notice === "verification_required"
      ? "Tài khoản của bạn cần xác minh email trước khi đăng nhập. Vui lòng kiểm tra hộp thư hoặc yêu cầu gửi lại mã OTP."
      : undefined;

  return (
    <PasswordRecoveryPage>
      {verificationId ? (
        <EmailVerificationForm
          initialNotice={initialNotice}
          nextUrl={searchParams?.next}
          verificationId={verificationId}
        />
      ) : (
        <div className="space-y-3 text-center" role="alert">
          <h1 className="text-2xl font-extrabold text-brand-heading">
            Thiếu phiên xác minh
          </h1>
          <p className="text-sm text-brand-muted">
            Liên kết này không chứa mã phiên hợp lệ. Hãy đăng ký lại.
          </p>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-plum px-5 text-sm font-semibold text-white hover:bg-brand-dark"
            href="/signup"
          >
            Đăng ký lại
          </Link>
        </div>
      )}
    </PasswordRecoveryPage>
  );
}
