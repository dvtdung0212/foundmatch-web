import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmailVerificationForm } from "@/features/auth/components/email-verification-form";
import { SignUpForm } from "@/features/auth/components/signup-form";

const navigation = vi.hoisted(() => ({ replace: vi.fn(), refresh: vi.fn() }));
const api = vi.hoisted(() => ({
  createWebRegistration: vi.fn(),
  getWebEmailVerification: vi.fn(),
  resendWebRegistrationEmailOtp: vi.fn(),
  verifyWebRegistrationEmail: vi.fn(),
}));

vi.mock("next/navigation", () => ({ useRouter: () => navigation }));
vi.mock("@/features/auth/api/email-verification-api", () => ({
  ...api,
  EmailVerificationApiError: class extends Error {
    constructor(
      message: string,
      readonly code?: string,
      readonly field?: string,
      readonly details?: Record<string, unknown>,
    ) {
      super(message);
    }
  },
}));

describe("Web email verification", () => {
  beforeEach(() => vi.clearAllMocks());

  it("routes a successful registration with only its opaque verification id", async () => {
    api.createWebRegistration.mockResolvedValue({
      verificationId: "verification-id",
    });
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/họ và tên/i), {
      target: { value: "Nguyễn An" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "member@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^mật khẩu$/i), {
      target: { value: "strong-password" },
    });
    fireEvent.change(screen.getByLabelText(/xác nhận mật khẩu/i), {
      target: { value: "strong-password" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /tạo tài khoản/i }));

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith(
        "/verify-email?verificationId=verification-id",
      ),
    );
  });

  it("verifies a six-digit code and returns to login without auto-login", async () => {
    api.getWebEmailVerification.mockResolvedValue({
      attemptsRemaining: 5,
      codeExpiresAt: new Date(Date.now() + 300_000).toISOString(),
      lockedUntil: null,
      maskedEmail: "me***@example.com",
      resendAvailableAt: new Date(Date.now() - 1_000).toISOString(),
      sessionExpiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      status: "PENDING",
      verificationId: "verification-id",
    });
    api.verifyWebRegistrationEmail.mockResolvedValue({ verified: true });
    render(<EmailVerificationForm verificationId="verification-id" />);

    expect(await screen.findByText("me***@example.com")).toBeInTheDocument();
    fireEvent.change(
      screen.getByRole("textbox", { name: /mã xác minh/i }),
      {
      target: { value: "123456" },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: /xác minh email/i }));

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith("/login?emailVerified=1"),
    );
  });

  it("replaces an unavailable verification form with a registration action", async () => {
    const ApiError = (
      await import("@/features/auth/api/email-verification-api")
    ).EmailVerificationApiError;
    api.getWebEmailVerification.mockRejectedValue(
      new ApiError(
        "The email verification session was not found.",
        "OTP_VERIFICATION_NOT_FOUND",
      ),
    );

    render(<EmailVerificationForm verificationId="missing-verification" />);

    expect(
      await screen.findByText(/phiên xác minh không khả dụng/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /xác minh email/i }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /đăng ký lại/i }));
    expect(navigation.replace).toHaveBeenCalledWith("/signup");
  });
});
