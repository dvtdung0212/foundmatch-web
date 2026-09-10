import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuthOperationSuccess } from "@/features/auth/components/auth-operation-success";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));

describe("AuthOperationSuccess", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replace.mockReset();
  });

  afterEach(() => vi.useRealTimers());

  it("counts down for three seconds before navigating", async () => {
    render(
      <AuthOperationSuccess
        actionLabel="Tiếp tục đăng nhập"
        description="Email đã được xác minh."
        destination="/login"
        title="Xác minh email thành công"
      />,
    );

    expect(screen.getByText(/tự động chuyển sau 3 giây/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();

    await act(async () => vi.advanceTimersByTime(2_000));
    expect(screen.getByText(/tự động chuyển sau 1 giây/i)).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();

    await act(async () => vi.advanceTimersByTime(1_000));
    expect(replace).toHaveBeenCalledWith("/login");
  });

  it("allows immediate navigation and prevents the timer from navigating twice", async () => {
    render(
      <AuthOperationSuccess
        actionLabel="Đăng nhập lại"
        description="Mật khẩu đã được cập nhật."
        destination="/login"
        title="Đổi mật khẩu thành công"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Đăng nhập lại" }));
    await act(async () => vi.advanceTimersByTime(3_000));

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith("/login");
  });
});
