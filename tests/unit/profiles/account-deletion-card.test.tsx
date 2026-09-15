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

    const confirmButton = screen.getByRole("button", { name: "Xác nhận xóa" });
    expect(confirmButton).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(confirmButton).toBeEnabled();

    await act(async () => {
      fireEvent.click(confirmButton);
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
