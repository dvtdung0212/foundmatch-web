import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MatchCandidatesTab } from "@/features/reports/components/detail/tabs/MatchCandidatesTab";

const dismiss = vi.fn();
const restore = vi.fn();
const toggleSaved = vi.fn();

vi.mock("@/features/matching/hooks/use-owner-match-candidates", () => ({
  useOwnerMatchCandidates: () => ({
    candidates: [candidate],
    dismiss,
    error: null,
    isLoading: false,
    isMutating: false,
    refetch: vi.fn(),
    restore,
    toggleSaved,
    total: 1,
  }),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const candidate = {
  components: [
    { code: "CATEGORY", maxScore: 25, score: 25 },
    { code: "DISTANCE", maxScore: 20, score: 16 },
  ],
  counterpart: {
    brand: "Pedro",
    category: { id: null, name: "Ví và giấy tờ" },
    color: "Nâu",
    eventEndedAt: null,
    eventStartedAt: "2026-09-01T09:00:00.000Z",
    publicAreaLabel: "Cầu Giấy, Hà Nội",
    publicCode: "FM-FOUND-1",
    title: "Ví da màu nâu",
    type: "FOUND",
  },
  id: "candidate-1",
  isDismissed: false,
  isSaved: false,
  score: 82,
  strength: "STRONG",
  updatedAt: "2026-09-02T10:00:00.000Z",
  version: 2,
};

describe("MatchCandidatesTab", () => {
  it("renders authoritative points and safe factors instead of mock percentages", () => {
    render(<MatchCandidatesTab report={{ id: "report-1" } as never} />);

    expect(screen.getAllByText("82 điểm")).toHaveLength(2);
    expect(screen.queryByText("82%")).not.toBeInTheDocument();
    expect(screen.getByText("Danh mục")).toBeInTheDocument();
    expect(screen.getByText("Khu vực gần nhau")).toBeInTheDocument();
    expect(screen.queryByText(/AI/i)).not.toBeInTheDocument();
  });

  it("opens a safe detail drawer and delegates save/dismiss commands", () => {
    render(<MatchCandidatesTab report={{ id: "report-1" } as never} />);

    fireEvent.click(screen.getByRole("button", { name: "Lưu để xem sau" }));
    expect(toggleSaved).toHaveBeenCalledWith(candidate);

    fireEvent.click(screen.getByRole("button", { name: "Không phù hợp" }));
    expect(dismiss).toHaveBeenCalledWith(candidate);

    fireEvent.click(
      screen.getByRole("button", { name: "Xem chi tiết kết quả" }),
    );
    expect(
      screen.getByRole("heading", { name: "Chi tiết kết quả phù hợp" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Đây là gợi ý, không phải bằng chứng sở hữu."),
    ).toBeInTheDocument();
  });
});
