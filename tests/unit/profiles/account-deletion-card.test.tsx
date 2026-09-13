import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountDeletionCard } from "@/features/profiles/components/tabs/account-deletion-card";

const requestWebAccountDeletion = vi.fn();

vi.mock("@/features/auth/api/account-lifecycle-api", () => ({
  requestWebAccountDeletion: (...args: unknown[]) =>
    requestWebAccountDeletion(...args),
}));

vi.mock("@/features/auth/components/auth-operation-success", () => ({
  AuthOperationSuccess: ({ title }: { title: string }) => <div>{title}</div>,
}));

describe("AccountDeletionCard", () => {
  beforeEach(() => {
    requestWebAccountDeletion.mockReset();
  });

  it("requires explicit confirmation and current password before requesting deletion", async () => {
    requestWebAccountDeletion.mockResolvedValue({ gracePeriodDays: 30 });
    render(<AccountDeletionCard />);

    fireEvent.click(
      screen.getByRole("button", { name: "Yêu cầu xóa tài khoản" }),
    );
    fireEvent.change(screen.getByLabelText("Mật khẩu hiện tại"), {
      target: { value: "password123" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Xác nhận xóa" }));
      await Promise.resolve();
    });

    expect(requestWebAccountDeletion).not.toHaveBeenCalled();
    expect(
      screen.getByText("Bạn cần xác nhận đã hiểu hậu quả trước khi tiếp tục."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Xác nhận xóa" }));
      await Promise.resolve();
    });

    expect(requestWebAccountDeletion).toHaveBeenCalledWith("password123");
    expect(
      screen.getByText("Đã tiếp nhận yêu cầu xóa tài khoản"),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Mật khẩu hiện tại"),
    ).not.toBeInTheDocument();
  });
});
