import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("server-only", () => ({}));

const changePasswordMock = vi.fn();
const getWebSessionsMock = vi.fn();
const revokeWebSessionMock = vi.fn();

vi.mock("@/features/profiles/actions/security.actions", () => ({
  changePasswordAction: (...args: any[]) => changePasswordMock(...args),
  getWebSessionsAction: () => getWebSessionsMock(),
  revokeWebSessionAction: (id: string) => revokeWebSessionMock(id),
}));

import { ProfileSecurityTab } from "@/features/profiles/components/tabs/profile-security-tab";
import { changePasswordSchema } from "@/features/auth/schemas/auth.schema";

describe("ProfileSecurityTab and changePasswordSchema", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getWebSessionsMock.mockResolvedValue({ success: false, sessions: [] });
  });

  describe("changePasswordSchema validation", () => {
    it("rejects when current password is empty", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "",
        newPassword: "NewSecurePassword123!",
        confirmPassword: "NewSecurePassword123!",
      });
      expect(result.success).toBe(false);
    });

    it("rejects when new password is under 12 characters", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "OldPassword123!",
        newPassword: "Short123!",
        confirmPassword: "Short123!",
      });
      expect(result.success).toBe(false);
    });

    it("rejects when new password equals current password", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "SamePassword123!",
        newPassword: "SamePassword123!",
        confirmPassword: "SamePassword123!",
      });
      expect(result.success).toBe(false);
    });

    it("rejects when confirm password does not match", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "OldPassword123!",
        newPassword: "NewSecurePassword123!",
        confirmPassword: "DifferentPassword123!",
      });
      expect(result.success).toBe(false);
    });

    it("accepts valid password change input with default revokeOtherSessions=true", () => {
      const result = changePasswordSchema.safeParse({
        currentPassword: "OldPassword123!",
        newPassword: "NewSecurePassword123!",
        confirmPassword: "NewSecurePassword123!",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.revokeOtherSessions).toBe(true);
      }
    });
  });

  describe("ProfileSecurityTab UI", () => {
    it("renders form fields, checklist, and device section", async () => {
      render(<ProfileSecurityTab />);

      expect(
        screen.getByRole("heading", { name: "Đổi mật khẩu" }),
      ).toBeDefined();
      expect(screen.getByPlaceholderText("Nhập mật khẩu đang sử dụng")).toBeDefined();
      expect(screen.getByPlaceholderText("Tối thiểu 12 ký tự")).toBeDefined();
      expect(screen.getByPlaceholderText("Xác nhận mật khẩu mới")).toBeDefined();
      expect(screen.getByText("Tối thiểu 12 ký tự")).toBeDefined();
      expect(screen.getByText(/Thiết bị đã đăng nhập/i)).toBeDefined();
      await waitFor(() => {
        expect(
          screen.getByText("Không có phiên đăng nhập nào để hiển thị."),
        ).toBeDefined();
      });
    });

    it("disables submit button when criteria are not met", async () => {
      render(<ProfileSecurityTab />);

      const submitBtn = screen.getByRole("button", { name: "Đổi mật khẩu" });
      expect((submitBtn as HTMLButtonElement).disabled).toBe(true);
      await waitFor(() => {
        expect(
          screen.getByText("Không có phiên đăng nhập nào để hiển thị."),
        ).toBeDefined();
      });
    });

    it("renders Email đăng nhập section with user email and verified badge", async () => {
      render(<ProfileSecurityTab email="test@example.com" />);

      expect(screen.getByRole("heading", { name: "Email đăng nhập" })).toBeDefined();
      expect(screen.getByText("test@example.com")).toBeDefined();
      expect(screen.getByText("Đã xác minh")).toBeDefined();
      expect(screen.getByRole("button", { name: "Thay đổi email" })).toBeDefined();
    });

    it("enables submit button, opens confirmation dialog, and completes password change", async () => {
      changePasswordMock.mockResolvedValue({
        success: true,
        message: "Đổi mật khẩu thành công!",
      });

      render(<ProfileSecurityTab />);

      const currentInput = screen.getByPlaceholderText("Nhập mật khẩu đang sử dụng");
      const newInput = screen.getByPlaceholderText("Tối thiểu 12 ký tự");
      const confirmInput = screen.getByPlaceholderText("Xác nhận mật khẩu mới");

      fireEvent.change(currentInput, { target: { value: "OldPassword123!" } });
      fireEvent.change(newInput, { target: { value: "NewSecurePassword123!" } });
      fireEvent.change(confirmInput, { target: { value: "NewSecurePassword123!" } });

      const submitBtn = screen.getByRole("button", { name: "Đổi mật khẩu" });
      expect((submitBtn as HTMLButtonElement).disabled).toBe(false);

      fireEvent.click(submitBtn);

      // Confirmation dialog should open
      await waitFor(() => {
        expect(screen.getByText("Xác nhận đổi mật khẩu")).toBeDefined();
      });

      const revokeCheckbox = screen.getByRole("checkbox");
      expect((revokeCheckbox as HTMLInputElement).checked).toBe(true);

      const confirmBtn = screen.getByRole("button", { name: "Xác nhận đổi" });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(changePasswordMock).toHaveBeenCalledWith({
          currentPassword: "OldPassword123!",
          newPassword: "NewSecurePassword123!",
          confirmPassword: "NewSecurePassword123!",
          revokeOtherSessions: true,
        });
        expect(screen.getByText("Đổi mật khẩu thành công!")).toBeDefined();
      });

      // Inputs should be reset
      expect((currentInput as HTMLInputElement).value).toBe("");
      expect((newInput as HTMLInputElement).value).toBe("");
      expect((confirmInput as HTMLInputElement).value).toBe("");
    });
  });
});
