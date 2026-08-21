import { describe, expect, it } from "vitest";

import { mapOwnerReportView } from "@/features/reports/api/owner-report-view";

describe("mapOwnerReportView", () => {
  it("maps owner-only data without inventing matches or activity", () => {
    const view = mapOwnerReportView(
      {
        category: { id: "category-id", name: "Ví" },
        createdAt: "2026-08-20T07:00:00.000Z",
        description: "Ví màu đen",
        eventStartedAt: "2026-08-20T06:00:00.000Z",
        id: "report-id",
        locations: [
          {
            id: "location-id",
            precision: "AREA_ONLY",
            publicAreaLabel: "Phường Bến Thành",
            purpose: "LOST",
            visibility: "APPROXIMATE",
          },
        ],
        media: [
          { id: "pending", processingStatus: "PENDING", url: null },
          { id: "ready", processingStatus: "READY", url: "https://cdn/image.webp" },
        ],
        publicAreaLabel: "Phường Bến Thành",
        publicCode: "FM-1",
        reviewStatus: "NOT_REQUIRED",
        title: "Ví đen",
        type: "LOST",
        updatedAt: "2026-08-20T07:01:00.000Z",
        version: 4,
        visibilityStatus: "PUBLIC",
        workflowStatus: "ACTIVE",
      },
      {
        facts: [
          { kind: "verification_secret", value: "Có đồng xu" },
          { kind: "exact_location_context", value: "Bàn sát cửa" },
        ],
      },
    );

    expect(view.statusText).toBe("Đang hoạt động");
    expect(view.images).toEqual(["https://cdn/image.webp"]);
    expect(view.pendingMediaCount).toBe(1);
    expect(view.secretVerificationAnswers).toBe("Có đồng xu");
    expect(view.locationDetail).toBe("Bàn sát cửa");
    expect(view.activities).toHaveLength(1);
    expect(view.potentialMatchesCount).toBe(0);
  });

  it("does not describe a pending review as active", () => {
    const view = mapOwnerReportView(
      {
        category: { id: "category-id", name: "Điện thoại" },
        createdAt: "2026-08-20T07:00:00.000Z",
        id: "report-id",
        locations: [],
        media: [],
        publicCode: "FM-2",
        reviewStatus: "PENDING_REVIEW",
        type: "FOUND",
        updatedAt: "2026-08-20T07:01:00.000Z",
        version: 2,
        visibilityStatus: "PRIVATE",
        workflowStatus: "SUBMITTED",
      },
      { facts: [] },
    );

    expect(view.statusText).toBe("Đang chờ duyệt");
    expect(view.isPublic).toBe(false);
  });
});
