import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

const api = vi.hoisted(() => ({
  requestWebPasswordRecovery: vi.fn(),
  resetWebPassword: vi.fn(),
}));

vi.mock("@/features/auth/api/session-api", () => api);

describe("Web password recovery", () => {
  it("accepts an email or username and renders the generic response", async () => {
    api.requestWebPasswordRecovery.mockResolvedValue({ accepted: true });
    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByLabelText(/email hoặc username/i), {
      target: { value: "member-name" },
    });
    fireEvent.click(screen.getByRole("button", { name: /gửi hướng dẫn/i }));

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
});
