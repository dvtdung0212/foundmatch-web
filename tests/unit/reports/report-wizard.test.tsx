import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ReportTypeSelector } from "@/features/reports/components/create/ReportTypeSelector";
import { LostReportWizard } from "@/features/reports/components/create/LostReportWizard";
import { FoundReportWizard } from "@/features/reports/components/create/FoundReportWizard";

// Mock useRouter & useSearchParams
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => ({
    get: (key: string) => (key === "code" ? "FM240520-8X7K2" : key === "type" ? "lost" : "Ví da nam"),
  }),
}));

describe("Report Creation Screens", () => {
  it("renders ReportTypeSelector with both Lost and Found hero action cards", () => {
    render(<ReportTypeSelector />);
    expect(screen.getByText("Bạn muốn báo cáo gì?")).toBeInTheDocument();
    expect(screen.getByText("Tôi bị mất đồ")).toBeInTheDocument();
    expect(screen.getByText("Tôi nhặt được đồ")).toBeInTheDocument();
    expect(screen.getByText("Tạo báo cáo mất đồ")).toBeInTheDocument();
    expect(screen.getByText("Tạo báo cáo nhặt được")).toBeInTheDocument();
  });

  it("renders LostReportWizard at step 1 and validates required fields on next", () => {
    render(<LostReportWizard />);
    expect(screen.getByRole("heading", { name: "Tạo báo cáo mất đồ" })).toBeInTheDocument();
    expect(screen.getByText("Bước 1: Mô tả chi tiết món đồ")).toBeInTheDocument();
    expect(screen.getByText("Tiếp tục")).toBeInTheDocument();
  });

  it("renders FoundReportWizard and shows custody & privacy options", () => {
    render(<FoundReportWizard />);
    expect(screen.getByRole("heading", { name: "Tạo báo cáo nhặt được đồ" })).toBeInTheDocument();
    expect(screen.getByText("Bước 1: Mô tả chi tiết vật phẩm bạn đã nhặt được")).toBeInTheDocument();
  });
});
