import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeedbackAlert } from "@/features/feedback";
import type { AppError } from "@/features/feedback";

describe("FeedbackAlert", () => {
  it("renders nothing when error is null", () => {
    const { container } = render(<FeedbackAlert error={null} />);
    expect(container.firstChild).toBeNull();
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
});
