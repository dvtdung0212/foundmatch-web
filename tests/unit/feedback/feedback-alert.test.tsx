import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeedbackAlert } from "@/features/feedback";
import type { AppError } from "@/features/feedback";

describe("FeedbackAlert", () => {
  it("renders collapsed when error is null", () => {
    const { container } = render(<FeedbackAlert error={null} />);
    expect(container.firstChild).toHaveClass("grid-rows-[0fr]");
  });

  it("renders plain string error without requestId", () => {
    render(<FeedbackAlert error="Lỗi thông thường" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Lỗi thông thường");
    expect(screen.queryByText(/Mã yêu cầu/)).toBeNull();
  });

  it("hides requestId by default for routine authentication errors", () => {
    const authError: AppError = {
      code: "WEB_LOGIN_INVALID",
      fieldErrors: {},
      kind: "authentication",
      message: "Email, tên đăng nhập hoặc mật khẩu không chính xác.",
      requestId: "auth-req-123",
      status: 401,
    };

    render(<FeedbackAlert error={authError} />);
    expect(
      screen.getByText("Email, tên đăng nhập hoặc mật khẩu không chính xác."),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Mã yêu cầu/)).toBeNull();
    expect(screen.queryByText(/auth-req-123/)).toBeNull();
  });

  it("hides requestId by default for routine validation errors", () => {
    const validationError: AppError = {
      code: "VALIDATION_FAILED",
      fieldErrors: {},
      kind: "validation",
      message: "Thông tin đã nhập chưa hợp lệ.",
      requestId: "val-req-456",
      status: 400,
    };

    render(<FeedbackAlert error={validationError} />);
    expect(screen.getByText("Thông tin đã nhập chưa hợp lệ.")).toBeInTheDocument();
    expect(screen.queryByText(/Mã yêu cầu/)).toBeNull();
  });

  it("displays requestId by default for critical system errors", () => {
    const systemError: AppError = {
      code: "INTERNAL_SERVER_ERROR",
      fieldErrors: {},
      kind: "system",
      message: "Hệ thống gặp sự cố. Vui lòng thử lại sau.",
      requestId: "sys-req-789",
      status: 500,
    };

    render(<FeedbackAlert error={systemError} />);
    expect(
      screen.getByText("Hệ thống gặp sự cố. Vui lòng thử lại sau."),
    ).toBeInTheDocument();
    expect(screen.getByText("Mã yêu cầu: sys-req-789")).toBeInTheDocument();
  });

  it("displays requestId when showRequestId is explicitly true", () => {
    const authError: AppError = {
      code: "WEB_LOGIN_INVALID",
      fieldErrors: {},
      kind: "authentication",
      message: "Email, tên đăng nhập hoặc mật khẩu không chính xác.",
      requestId: "tx-req-999",
      status: 401,
    };

    render(<FeedbackAlert error={authError} showRequestId />);
    expect(screen.getByText("Mã yêu cầu: tx-req-999")).toBeInTheDocument();
  });

  it("hides requestId when showRequestId is explicitly false", () => {
    const systemError: AppError = {
      code: "INTERNAL_SERVER_ERROR",
      fieldErrors: {},
      kind: "system",
      message: "Hệ thống gặp sự cố.",
      requestId: "sys-req-789",
      status: 500,
    };

    render(<FeedbackAlert error={systemError} showRequestId={false} />);
    expect(screen.queryByText(/Mã yêu cầu/)).toBeNull();
  });

  it("renders success variant with message and check icon", () => {
    render(<FeedbackAlert variant="success" message="Đổi email thành công!" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Đổi email thành công!");
    expect(screen.getByRole("alert")).toHaveClass("grid-rows-[1fr]");
  });

  it("renders close button when onClose is provided and triggers callback", async () => {
    let closed = false;
    render(
      <FeedbackAlert
        error="Có lỗi xảy ra"
        onClose={() => {
          closed = true;
        }}
      />,
    );

    const closeBtn = screen.getByTitle("Đóng thông báo");
    expect(closeBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(closeBtn);
    });

    // Verify collapse animation initiated
    expect(screen.getByRole("alert", { hidden: true })).toHaveClass("grid-rows-[0fr]");

    // Wait for the exit animation duration to verify callback
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });
    expect(closed).toBe(true);
  });

  it("auto closes after duration when onClose is provided", async () => {
    let closed = false;
    render(
      <FeedbackAlert
        error="Lỗi tự đóng"
        autoClose={100}
        onClose={() => {
          closed = true;
        }}
      />,
    );

    expect(screen.getByText("Lỗi tự đóng")).toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 450));
    });

    expect(closed).toBe(true);
  });

  it("pauses auto-close on hover and resumes on mouse leave", async () => {
    let closed = false;
    render(
      <FeedbackAlert
        error="Lỗi tạm dừng"
        autoClose={200}
        onClose={() => {
          closed = true;
        }}
      />,
    );

    const alert = screen.getByRole("alert");
    fireEvent.mouseEnter(alert);

    // Wait 250ms while hovered - should NOT close
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 250));
    });
    expect(closed).toBe(false);

    // Leave hover - should resume and close
    fireEvent.mouseLeave(alert);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 550));
    });
    expect(closed).toBe(true);
  });
});
