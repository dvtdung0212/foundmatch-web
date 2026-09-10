import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LoginForm } from "@/features/auth/components/login-form";

const replace = vi.fn();
const refresh = vi.fn();
const loginWeb = vi.fn();
const loginWebDemo = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/features/auth/api/session-api", () => ({
  getWebSessionPolicy: vi.fn().mockResolvedValue({
    rememberLoginEnabled: true,
  }),
  loginWeb: (...args: unknown[]) => loginWeb(...args),
  loginWebDemo: (...args: unknown[]) => loginWebDemo(...args),
}));

describe("LoginForm immediate navigation", () => {
  beforeEach(() => {
    replace.mockReset();
    refresh.mockReset();
    loginWeb.mockReset();
    loginWebDemo.mockReset();
  });

  it("redirects as soon as regular login succeeds without showing success feedback", async () => {
    loginWeb.mockResolvedValue({ rememberLogin: false });
    render(<LoginForm />);

    fireEvent.change(
      screen.getByPlaceholderText("Nhập email hoặc username của bạn"),
      { target: { value: "member@example.com" } },
    );
    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
      await Promise.resolve();
    });

    expect(replace).toHaveBeenCalledWith("/");
    expect(refresh).toHaveBeenCalledOnce();
    expect(screen.queryByText("Đăng nhập thành công!")).not.toBeInTheDocument();
  });

  it("redirects as soon as demo login succeeds without showing success feedback", async () => {
    loginWebDemo.mockResolvedValue({ rememberLogin: false });
    render(<LoginForm />);

    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: /Nguyen Van Finder/i }),
      );
      await Promise.resolve();
    });

    expect(loginWebDemo).toHaveBeenCalledWith("finder@example.com");
    expect(replace).toHaveBeenCalledWith("/");
    expect(refresh).toHaveBeenCalledOnce();
    expect(
      screen.queryByText("Đăng nhập tài khoản Demo thành công!"),
    ).not.toBeInTheDocument();
  });
});
