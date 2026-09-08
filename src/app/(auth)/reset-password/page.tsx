import { PasswordRecoveryPage } from "@/features/auth/components/password-recovery-page";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { token?: string };
}) {
  return (
    <PasswordRecoveryPage>
      <ResetPasswordForm token={searchParams?.token ?? ""} />
    </PasswordRecoveryPage>
  );
}
