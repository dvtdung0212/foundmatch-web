import { describe, expect, it } from "vitest";

import { buildReportSubmission } from "@/features/reports/api/report-form-mapper";

describe("buildReportSubmission", () => {
  it("separates public details from private verification and exact location context", () => {
    const result = buildReportSubmission({
      attributes: [
        {
          assignmentId: "33333333-3333-4333-8333-333333333333",
          value: { kind: "TEXT", textValue: "Da thật" },
        },
      ],
      brand: "Pedro",
      categoryId: "11111111-1111-4111-8111-111111111111",
      categoryName: "Ví",
      color: "Đen",
      date: "2026-08-20",
      description: "Ví gập đôi màu đen.",
      distinctiveFeatures: "Có chữ M.D ở mép trong",
      files: [],
      locationArea: "Phường Bến Thành, TP.HCM",
      locationDetail: "Bàn sát quầy thanh toán",
      locationName: "Trung tâm thương mại",
      secretVerificationAnswers: "Có đồng xu kỷ niệm",
      timeSlot: "14:00 - 16:00",
      title: "Ví da màu đen",
      type: "LOST",
    });

    expect(result.description).toBe("Ví gập đôi màu đen.");
    expect(result.attributes).toHaveLength(1);
    expect(result.description).not.toContain("Bàn sát quầy");
    expect(result.description).not.toContain("đồng xu");
    expect(result.privateFacts).toEqual([
      { kind: "distinctive_feature", value: "Có chữ M.D ở mép trong" },
      { kind: "verification_secret", value: "Có đồng xu kỷ niệm" },
      { kind: "exact_location_context", value: "Bàn sát quầy thanh toán" },
    ]);
    expect(result.location).toMatchObject({
      precision: "AREA_ONLY",
      publicAreaLabel: "Phường Bến Thành, TP.HCM",
      purpose: "LOST",
      visibility: "APPROXIMATE",
    });
    expect(result.eventStartedAt).toBe("2026-08-20T07:00:00.000Z");
    expect(result.eventEndedAt).toBe("2026-08-20T09:00:00.000Z");
  });

  it("maps a found report and omits blank optional facts", () => {
    const result = buildReportSubmission({
      attributes: [],
      categoryId: "11111111-1111-4111-8111-111111111111",
      categoryName: "Điện thoại",
      date: "2026-08-20",
      description: "Điện thoại màu bạc.",
      files: [],
      locationArea: "Phường Sài Gòn, TP.HCM",
      locationName: "Công viên",
      timeSlot: "Không rõ",
      title: "Điện thoại",
      type: "FOUND",
    });

    expect(result.privateFacts).toEqual([]);
    expect(result.location.purpose).toBe("FOUND");
    expect(result.eventStartedAt).toBe("2026-08-19T17:00:00.000Z");
    expect(result.eventEndedAt).toBeUndefined();
  });
});
