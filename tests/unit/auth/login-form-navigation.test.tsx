import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "@/features/auth/components/login-form";

const replace = vi.fn();
const refresh = vi.fn();
const loginWeb = vi.fn();
const getWebSessionPolicy = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh }),
}));

vi.mock("@/features/auth/api/session-api", () => ({
  getWebSessionPolicy: (...args: unknown[]) => getWebSessionPolicy(...args),
  loginWeb: (...args: unknown[]) => loginWeb(...args),
  loginWebDemo: vi.fn(),
}));

describe("LoginForm navigation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replace.mockReset();
    refresh.mockReset();
    loginWeb.mockReset();
    getWebSessionPolicy.mockReset();
    getWebSessionPolicy.mockResolvedValue({
      rememberLoginEnabled: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("replaces the login route with home and refreshes server auth state", async () => {
    loginWeb.mockResolvedValue({ rememberLogin: false });

    render(<LoginForm />);

    fireEvent.change(
      screen.getByPlaceholderText("Nhập email hoặc username của bạn"),
      {
        target: { value: "member@example.com" },
      },
    );
    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "password123" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
      await Promise.resolve();
    });

    expect(loginWeb).toHaveBeenCalledWith({
      identifier: "member@example.com",
      password: "password123",
      rememberLogin: false,
    });

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(replace).toHaveBeenCalledWith("/");
    expect(refresh).toHaveBeenCalledOnce();
  });

  it("redirects to verify-email when account requires email verification", async () => {
    loginWeb.mockRejectedValue({
      data: {
        code: "EMAIL_VERIFICATION_REQUIRED",
        details: {
          maskedEmail: "d***1@gmail.com",
          verificationId: "test-verif-123",
        },
        message: "Tài khoản chưa được xác minh email.",
      },
    });

    render(<LoginForm nextUrl="/reports/new" />);

    fireEvent.change(
      screen.getByPlaceholderText("Nhập email hoặc username của bạn"),
      {
        target: { value: "dung02122001@gmail.com" },
      },
    );
    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu của bạn"), {
      target: { value: "password123" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Đăng nhập" }));
      await Promise.resolve();
    });

    expect(replace).toHaveBeenCalledWith(
      "/verify-email?verificationId=test-verif-123&notice=verification_required&next=%2Freports%2Fnew",
    );
  });

  it("redirects to OTP recovery without creating a session when deletion is pending", async () => {
    loginWeb.mockRejectedValue({
      data: {
        code: "ACCOUNT_REACTIVATION_REQUIRED",
        details: { verificationId: "1c12830f-4219-4f08-a7fd-fdd6e5c4f837" },
        message: "Account reactivation is required.",
      },
    });

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

    expect(replace).toHaveBeenCalledWith(
      "/reactivate-account?verificationId=1c12830f-4219-4f08-a7fd-fdd6e5c4f837",
    );
    expect(refresh).not.toHaveBeenCalled();
  });

  it("rejects an external post-login destination", async () => {
    loginWeb.mockResolvedValue({ rememberLogin: false });
    render(<LoginForm nextUrl="https://attacker.example/collect" />);

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
  });

  it("switches identifier icon from AtSign to Mail when typing an email with @", () => {
    const { container } = render(<LoginForm />);
    const input = screen.getByPlaceholderText(
      "Nhập email hoặc username của bạn",
    );

    // Initially without @: shows at-sign icon
    expect(container.querySelector(".lucide-at-sign")).toBeInTheDocument();
    expect(container.querySelector(".lucide-mail")).not.toBeInTheDocument();

    // Type a username without @: remains at-sign icon
    act(() => {
      fireEvent.change(input, { target: { value: "johndoe" } });
    });
    expect(container.querySelector(".lucide-at-sign")).toBeInTheDocument();
    expect(container.querySelector(".lucide-mail")).not.toBeInTheDocument();

    // Type an email with @: switches to mail icon
    act(() => {
      fireEvent.change(input, { target: { value: "johndoe@gmail.com" } });
    });
    expect(container.querySelector(".lucide-mail")).toBeInTheDocument();
    expect(container.querySelector(".lucide-at-sign")).not.toBeInTheDocument();

    // Clear back to username without @: switches back to at-sign icon
    act(() => {
      fireEvent.change(input, { target: { value: "johndoe" } });
    });
    expect(container.querySelector(".lucide-at-sign")).toBeInTheDocument();
    expect(container.querySelector(".lucide-mail")).not.toBeInTheDocument();
  });
});
