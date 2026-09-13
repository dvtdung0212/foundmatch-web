import Link from "next/link";

import { AccountReactivationForm } from "@/features/auth/components/account-reactivation-form";
import { PasswordRecoveryPage } from "@/features/auth/components/password-recovery-page";

interface ReactivateAccountPageProps {
  searchParams?: { verificationId?: string };
}

export default function ReactivateAccountPage({
  searchParams,
}: ReactivateAccountPageProps) {
  const verificationId = searchParams?.verificationId;
  return (
    <PasswordRecoveryPage>
      {verificationId ? (
        <AccountReactivationForm verificationId={verificationId} />
      ) : (
        <div className="space-y-3 text-center" role="alert">
          <h1 className="text-2xl font-extrabold text-brand-heading">Thiếu phiên khôi phục</h1>
          <p className="text-sm text-brand-muted">
            Hãy đăng nhập bằng email và mật khẩu để bắt đầu khôi phục tài khoản.
          </p>
          <Link className="font-bold text-brand-plum hover:underline" href="/login">
            Quay lại đăng nhập
          </Link>
        </div>
      )}
    </PasswordRecoveryPage>
  );
}
