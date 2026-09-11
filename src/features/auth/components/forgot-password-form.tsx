"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, AtSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useZodFormValidation } from "@/features/feedback";
import { passwordRecoverySchema } from "../schemas/auth.schema";
import { requestWebPasswordRecovery } from "../api/session-api";

const ACCEPTED_MESSAGE =
  "Nếu tài khoản tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email đã xác minh.";

export function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const validation = useZodFormValidation(passwordRecoverySchema);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const values = validation.validate({ identifier });
    if (!values) return;
    setLoading(true);
    try {
      await requestWebPasswordRecovery(values.identifier);
    } finally {
      setSubmitted(true);
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="space-y-6 text-center" role="status">
        <CheckCircle2 className="mx-auto h-12 w-12 text-brand-found" />
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-brand-heading">
            Kiểm tra hộp thư của bạn
          </h1>
          <p className="text-sm leading-6 text-brand-muted">
            {ACCEPTED_MESSAGE}
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-plum hover:underline"
          href="/login"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form noValidate className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-brand-heading">
          Quên mật khẩu?
        </h1>
        <p className="text-sm leading-6 text-brand-muted">
          Nhập email hoặc username. Vì lý do bảo mật, chúng tôi không xác nhận
          tài khoản có tồn tại hay không.
        </p>
      </div>
      <Input
        autoComplete="username"
        icon={
          identifier.includes("@") ? (
            <Mail className="h-4 w-4 animate-in fade-in zoom-in-75 duration-200" />
          ) : (
            <AtSign className="h-4 w-4 animate-in fade-in zoom-in-75 duration-200" />
          )
        }
        label="Email hoặc Username"
        maxLength={320}
        minLength={3}
        onChange={(event) => {
          setIdentifier(event.target.value);
          validation.clearFieldError("identifier");
        }}
        error={validation.fieldErrors.identifier}
        placeholder="Nhập email hoặc username"
        required
        value={identifier}
      />
      <Button fullWidth loading={loading} size="lg" type="submit">
        Gửi hướng dẫn
      </Button>
      <div className="text-center">
        <Link
          className="text-sm font-bold text-brand-plum hover:underline"
          href="/login"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </form>
  );
}
