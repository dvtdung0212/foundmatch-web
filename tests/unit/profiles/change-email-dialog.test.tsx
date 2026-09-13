import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("server-only", () => ({}));

const requestEmailChangeMock = vi.fn();
const verifyEmailChangeMock = vi.fn();
const resendEmailChangeOtpMock = vi.fn();
const cancelEmailChangeMock = vi.fn();

vi.mock("@/features/profiles/actions/security.actions", () => ({
  requestEmailChangeAction: (...args: any[]) => requestEmailChangeMock(...args),
  verifyEmailChangeAction: (...args: any[]) => verifyEmailChangeMock(...args),
  resendEmailChangeOtpAction: (...args: any[]) => resendEmailChangeOtpMock(...args),
  cancelEmailChangeAction: (...args: any[]) => cancelEmailChangeMock(...args),
}));

import { ChangeEmailDialog } from "@/features/profiles/components/tabs/change-email-dialog";
import {
  requestEmailChangeSchema,
  verifyEmailChangeSchema,
} from "@/features/auth/schemas/auth.schema";

describe("ChangeEmailDialog", () => {
  const onOpenChangeMock = vi.fn();
  const onEmailChangedMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Step 1: Request Email Change", () => {
    it("renders Step 1 with current password and new email fields", () => {
      render(
        <ChangeEmailDialog
          open={true}
          onOpenChange={onOpenChangeMock}
          currentEmail="old@example.com"
          onEmailChanged={onEmailChangedMock}
        />
      );

      expect(screen.getByText("Thay đổi email đăng nhập")).toBeDefined();
      expect(screen.getByPlaceholderText("Nhập mật khẩu của tài khoản...")).toBeDefined();
      expect(screen.getByPlaceholderText("vidu@example.com")).toBeDefined();
      const nextBtn = screen.getByRole("button", { name: "Tiếp tục gửi mã" });
      expect((nextBtn as HTMLButtonElement).disabled).toBe(true);
    });

    it("prevents submitting if new email matches current email", async () => {
      render(
        <ChangeEmailDialog
          open={true}
          onOpenChange={onOpenChangeMock}
          currentEmail="old@example.com"
          onEmailChanged={onEmailChangedMock}
        />
      );

      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu của tài khoản...");
      const emailInput = screen.getByPlaceholderText("vidu@example.com");

      fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
      fireEvent.change(emailInput, { target: { value: "old@example.com" } });

      const nextBtn = screen.getByRole("button", { name: "Tiếp tục gửi mã" });
      expect((nextBtn as HTMLButtonElement).disabled).toBe(true);

      await waitFor(() => {
        expect(
          screen.getByText("Địa chỉ email mới không được trùng với email hiện tại.")
        ).toBeDefined();
        expect(requestEmailChangeMock).not.toHaveBeenCalled();
      });
    });

    it("submits Step 1 and navigates to Step 2 on success", async () => {
      requestEmailChangeMock.mockResolvedValue({
        success: true,
        data: {
          verificationId: "verif-12345",
          expiresAt: new Date(Date.now() + 600000).toISOString(),
          maskedEmail: "n***@new.com",
        },
      });

      render(
        <ChangeEmailDialog
          open={true}
          onOpenChange={onOpenChangeMock}
          currentEmail="old@example.com"
          onEmailChanged={onEmailChangedMock}
        />
      );

      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu của tài khoản...");
      const emailInput = screen.getByPlaceholderText("vidu@example.com");

      fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
      fireEvent.change(emailInput, { target: { value: "new@example.com" } });

      const nextBtn = screen.getByRole("button", { name: "Tiếp tục gửi mã" });
      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(requestEmailChangeMock).toHaveBeenCalledWith({
          currentPassword: "ValidPassword123!",
          newEmail: "new@example.com",
        });
        // Step 2 title & content
        expect(screen.getByText("Xác thực mã OTP")).toBeDefined();
        expect(screen.getByText("new@example.com")).toBeDefined();
      });
    });

    it("displays error message if Step 1 request fails", async () => {
      requestEmailChangeMock.mockResolvedValue({
        success: false,
        error: { message: "Mật khẩu hiện tại không chính xác." },
      });

      render(
        <ChangeEmailDialog
          open={true}
          onOpenChange={onOpenChangeMock}
          currentEmail="old@example.com"
          onEmailChanged={onEmailChangedMock}
        />
      );

      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu của tài khoản...");
      const emailInput = screen.getByPlaceholderText("vidu@example.com");

      fireEvent.change(passwordInput, { target: { value: "WrongPassword" } });
      fireEvent.change(emailInput, { target: { value: "new@example.com" } });

      const nextBtn = screen.getByRole("button", { name: "Tiếp tục gửi mã" });
      fireEvent.click(nextBtn);

      await waitFor(() => {
        expect(screen.getByText("Mật khẩu hiện tại không chính xác.")).toBeDefined();
      });
    });
  });

  describe("Step 2: Verify OTP and Complete", () => {
    const setupStep2 = async () => {
      requestEmailChangeMock.mockResolvedValue({
        success: true,
        data: {
          verificationId: "verif-12345",
          expiresAt: new Date(Date.now() + 600000).toISOString(),
          maskedEmail: "n***@new.com",
        },
      });

      render(
        <ChangeEmailDialog
          open={true}
          onOpenChange={onOpenChangeMock}
          currentEmail="old@example.com"
          onEmailChanged={onEmailChangedMock}
        />
      );

      fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của tài khoản..."), {
        target: { value: "ValidPassword123!" },
      });
      fireEvent.change(screen.getByPlaceholderText("vidu@example.com"), {
        target: { value: "new@example.com" },
      });

      fireEvent.click(screen.getByRole("button", { name: "Tiếp tục gửi mã" }));

      await waitFor(() => {
        expect(screen.getByText("Xác thực mã OTP")).toBeDefined();
      });
    };

    it("verifies OTP and triggers onEmailChanged on success", async () => {
      await setupStep2();

      verifyEmailChangeMock.mockResolvedValue({
        success: true,
        email: "new@example.com",
        message: "Email đã được thay đổi thành công.",
      });

      // Enter OTP: 6 pin inputs
      const otpInputs = screen.getAllByRole("textbox");
      expect(otpInputs.length).toBe(6);

      // Enter digits into each input
      const digits = ["1", "2", "3", "4", "5", "6"];
      digits.forEach((d, idx) => {
        fireEvent.change(otpInputs[idx], { target: { value: d } });
      });

      const verifyBtn = screen.getByRole("button", { name: "Xác nhận đổi email" });
      expect((verifyBtn as HTMLButtonElement).disabled).toBe(false);

      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(verifyEmailChangeMock).toHaveBeenCalledWith({
          verificationId: "verif-12345",
          code: "123456",
        });
        expect(onEmailChangedMock).toHaveBeenCalledWith("new@example.com");
      });
    });

    it("displays error when OTP verification fails", async () => {
      await setupStep2();

      verifyEmailChangeMock.mockResolvedValue({
        success: false,
        error: { message: "Mã OTP không chính xác hoặc đã hết hạn." },
      });

      const otpInputs = screen.getAllByRole("textbox");
      const digits = ["9", "9", "9", "9", "9", "9"];
      digits.forEach((d, idx) => {
        fireEvent.change(otpInputs[idx], { target: { value: d } });
      });

      const verifyBtn = screen.getByRole("button", { name: "Xác nhận đổi email" });
      fireEvent.click(verifyBtn);

      await waitFor(() => {
        expect(screen.getByText("Mã OTP không chính xác hoặc đã hết hạn.")).toBeDefined();
      });
    });

    it("allows navigating back to Step 1", async () => {
      await setupStep2();

      const backBtn = screen.getByRole("button", { name: "Quay lại" });
      fireEvent.click(backBtn);

      await waitFor(() => {
        expect(screen.getByText("Thay đổi email đăng nhập")).toBeDefined();
        expect(screen.getByPlaceholderText("vidu@example.com")).toBeDefined();
      });
    });

    it("displays inline field error when invalid email format is entered and clears on change", async () => {
      render(
        <ChangeEmailDialog
          open={true}
          onOpenChange={onOpenChangeMock}
          currentEmail="old@example.com"
          onEmailChanged={onEmailChangedMock}
        />
      );

      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu của tài khoản...");
      const emailInput = screen.getByPlaceholderText("vidu@example.com");

      fireEvent.change(passwordInput, { target: { value: "ValidPassword123!" } });
      fireEvent.change(emailInput, { target: { value: "not-an-email" } });

      const nextBtn = screen.getByRole("button", { name: "Tiếp tục gửi mã" });
      expect((nextBtn as HTMLButtonElement).disabled).toBe(true);

      await waitFor(() => {
        expect(screen.getByText("Địa chỉ email không đúng định dạng.")).toBeDefined();
        expect(emailInput.classList.contains("border-red-500")).toBe(true);
        expect(requestEmailChangeMock).not.toHaveBeenCalled();
      });

      // When user starts typing valid email, error clears
      fireEvent.change(emailInput, { target: { value: "valid@domain.com" } });
      await waitFor(() => {
        expect(emailInput.classList.contains("border-red-500")).toBe(false);
      });
    });

    it("validates email live while typing without waiting for submit", async () => {
      render(
        <ChangeEmailDialog
          open={true}
          onOpenChange={onOpenChangeMock}
          currentEmail="old@example.com"
          onEmailChanged={onEmailChangedMock}
        />
      );

      const emailInput = screen.getByPlaceholderText("vidu@example.com");

      // Typing invalid email immediately displays error without submitting
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });

      await waitFor(() => {
        expect(screen.getByText("Địa chỉ email không đúng định dạng.")).toBeDefined();
        expect(emailInput.classList.contains("border-red-500")).toBe(true);
      });

      // Typing same email as current email immediately displays duplicate error
      fireEvent.change(emailInput, { target: { value: "old@example.com" } });

      await waitFor(() => {
        expect(
          screen.getByText("Địa chỉ email mới không được trùng với email hiện tại.")
        ).toBeDefined();
        expect(emailInput.classList.contains("border-red-500")).toBe(true);
      });

      // Typing valid email immediately clears the error
      fireEvent.change(emailInput, { target: { value: "brandnew@example.com" } });

      await waitFor(() => {
        expect(emailInput.classList.contains("border-red-500")).toBe(false);
      });
    });
  });

  describe("Validation Schemas", () => {
    it("validates requestEmailChangeSchema accurately", () => {
      // Empty password
      const res1 = requestEmailChangeSchema.safeParse({
        currentPassword: "",
        newEmail: "new@example.com",
      });
      expect(res1.success).toBe(false);

      // Invalid email
      const res2 = requestEmailChangeSchema.safeParse({
        currentPassword: "Password123!",
        newEmail: "invalid-email",
      });
      expect(res2.success).toBe(false);

      // Duplicate email
      const res3 = requestEmailChangeSchema.safeParse({
        currentPassword: "Password123!",
        newEmail: "User@example.com",
        currentEmail: "user@example.com",
      });
      expect(res3.success).toBe(false);

      // Valid
      const res4 = requestEmailChangeSchema.safeParse({
        currentPassword: "Password123!",
        newEmail: "different@example.com",
        currentEmail: "user@example.com",
      });
      expect(res4.success).toBe(true);
    });

    it("validates verifyEmailChangeSchema accurately", () => {
      // Missing or short OTP
      const res1 = verifyEmailChangeSchema.safeParse({
        verificationId: "verif-123",
        code: "123",
      });
      expect(res1.success).toBe(false);

      // Letters in OTP
      const res2 = verifyEmailChangeSchema.safeParse({
        verificationId: "verif-123",
        code: "12345a",
      });
      expect(res2.success).toBe(false);

      // Valid 6-digit OTP
      const res3 = verifyEmailChangeSchema.safeParse({
        verificationId: "verif-123",
        code: "123456",
      });
      expect(res3.success).toBe(true);
    });
  });
});
