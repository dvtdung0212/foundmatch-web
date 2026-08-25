import { describe, expect, it, vi } from "vitest";

import ReportDetailPage from "@/app/reports/[id]/page";

const mocks = vi.hoisted(() => ({
  getServerApiClient: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: mocks.notFound,
  redirect: mocks.redirect,
}));
vi.mock("@/lib/api/server-client", () => ({
  getServerApiClient: mocks.getServerApiClient,
}));
vi.mock("@/features/reports/components/detail/ReportDetailView", () => ({
  ReportDetailView: () => null,
}));

describe("ReportDetailPage route parameters", () => {
  it("returns not found before calling the API for a non-UUID route", async () => {
    await expect(ReportDetailPage({ params: { id: "lost" } })).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );

    expect(mocks.notFound).toHaveBeenCalledOnce();
    expect(mocks.getServerApiClient).not.toHaveBeenCalled();
  });
});
