import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/features/auth/components/login-form";

const replace = vi.fn();
const refresh = vi.fn();
const signInWithPasswordAction = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/features/auth/actions/auth.actions", () => ({
  signInWithPasswordAction: (...args: unknown[]) =>
    signInWithPasswordAction(...args),
  signInWithDemoAccount: vi.fn(),
}));

describe("LoginForm navigation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replace.mockReset();
    refresh.mockReset();
    signInWithPasswordAction.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("replaces the login route with home and refreshes server auth state", async () => {
    signInWithPasswordAction.mockResolvedValue({
      success: true,
      message: "Đăng nhập thành công!",
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Nhập email hoặc username của bạn"), {
      target: { value: "member@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "password123" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
      await Promise.resolve();
    });

    expect(signInWithPasswordAction).toHaveBeenCalled();

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(replace).toHaveBeenCalledWith("/");
    expect(refresh).toHaveBeenCalledOnce();
  });
});
