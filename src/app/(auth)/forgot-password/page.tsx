import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { PasswordRecoveryPage } from "@/features/auth/components/password-recovery-page";

export default function ForgotPasswordPage() {
  return (
    <PasswordRecoveryPage>
      <ForgotPasswordForm />
    </PasswordRecoveryPage>
  );
}
