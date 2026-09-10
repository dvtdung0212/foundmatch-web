import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";

import { appFeedback } from "@/features/feedback";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

describe("web appFeedback", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows a translated error and its safe request reference", () => {
    appFeedback.error({
      code: "INTERNAL_SERVER_ERROR",
      message: "Unexpected.",
      requestId: "request-id",
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Hệ thống gặp sự cố. Vui lòng thử lại sau.",
      { description: "Mã yêu cầu: request-id" },
    );
  });
});
