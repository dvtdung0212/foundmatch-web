import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

const api = vi.hoisted(() => ({
  requestWebPasswordRecovery: vi.fn(),
  resetWebPassword: vi.fn(),
}));
const navigation = vi.hoisted(() => ({ replace: vi.fn() }));

vi.mock("@/features/auth/api/session-api", () => api);
vi.mock("next/navigation", () => ({ useRouter: () => navigation }));

describe("Web password recovery", () => {
  it("accepts an email or username and renders the generic response", async () => {
    api.requestWebPasswordRecovery.mockResolvedValue({ accepted: true });
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText(/email hoặc username/i), {
      target: { value: "member-name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /đặt lại mật khẩu/i }));

    await waitFor(() =>
      expect(api.requestWebPasswordRecovery).toHaveBeenCalledWith(
        "member-name",
      ),
    );
    expect(screen.getByText(/nếu tài khoản tồn tại/i)).toBeInTheDocument();
  });

  it("requires matching passwords before consuming the token", async () => {
    render(
      <ResetPasswordForm token="recovery-token-with-at-least-thirty-two-characters" />,
    );

    fireEvent.change(screen.getByLabelText(/^mật khẩu mới$/i), {
      target: { value: "a-secure-password" },
    });
    fireEvent.change(screen.getByLabelText(/xác nhận mật khẩu/i), {
      target: { value: "different-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /đặt lại mật khẩu/i }));

    expect(await screen.findByText(/không khớp/i)).toBeInTheDocument();
    expect(api.resetWebPassword).not.toHaveBeenCalled();
  });

  it("replaces the password form with success feedback after reset", async () => {
    api.resetWebPassword.mockResolvedValue({ reset: true });
    render(
      <ResetPasswordForm token="recovery-token-with-at-least-thirty-two-characters" />,
    );

    fireEvent.change(screen.getByLabelText(/^mật khẩu mới$/i), {
      target: { value: "a-secure-password" },
    });
    fireEvent.change(screen.getByLabelText(/xác nhận mật khẩu/i), {
      target: { value: "a-secure-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /đặt lại mật khẩu/i }));

    expect(
      await screen.findByRole("heading", { name: /đổi mật khẩu thành công/i }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/^mật khẩu mới$/i)).not.toBeInTheDocument();
    expect(screen.getByText(/tự động chuyển sau 3 giây/i)).toBeInTheDocument();
  });
});
