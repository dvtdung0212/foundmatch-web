import { describe, expect, it, vi } from "vitest";

import {
  persistReport,
  reportFileKey,
  type OwnerReportApi,
  type ReportSubmissionInput,
} from "@/features/reports/api/report-submission";

const input: ReportSubmissionInput = {
  type: "LOST",
  title: "Ví da màu đen",
  categoryId: "11111111-1111-4111-8111-111111111111",
  categoryName: "Ví và túi",
  brand: "Pedro",
  color: "Đen",
  description: "Ví gập đôi",
  eventStartedAt: "2026-08-20T07:00:00.000Z",
  eventEndedAt: "2026-08-20T09:00:00.000Z",
  publicAreaLabel: "Phường Bến Thành, TP.HCM",
  location: {
    precision: "AREA_ONLY",
    publicAreaLabel: "Phường Bến Thành, TP.HCM",
    purpose: "LOST",
    visibility: "APPROXIMATE",
  },
  privateFacts: [
    { kind: "verification_secret", value: "Có đồng xu kỷ niệm" },
  ],
  files: [new File(["image"], "wallet.jpg", { type: "image/jpeg" })],
};

function createApi(): OwnerReportApi {
  return {
    createDraft: vi.fn().mockResolvedValue({
      id: "22222222-2222-4222-8222-222222222222",
      publicCode: "FM-ABC123",
      version: 1,
    }),
    replaceLocations: vi.fn().mockResolvedValue({ version: 2 }),
    replacePrivateFacts: vi.fn().mockResolvedValue({ version: 3 }),
    uploadMedia: vi.fn().mockResolvedValue({ version: 4 }),
    submit: vi.fn().mockResolvedValue({
      id: "22222222-2222-4222-8222-222222222222",
      publicCode: "FM-ABC123",
      version: 5,
      workflowStatus: "ACTIVE",
    }),
  };
}

describe("persistReport", () => {
  it("chains the authoritative version through locations, private facts, media and submit", async () => {
    const api = createApi();

    const result = await persistReport(api, input, {
      idempotencyKey: "report-create-key",
      submit: true,
      submitIdempotencyKey: "report-submit-key",
    });

    expect(api.createDraft).toHaveBeenCalledWith(
      expect.objectContaining({
        categoryId: input.categoryId,
        type: "LOST",
      }),
      "report-create-key",
    );
    expect(api.replaceLocations).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      1,
      [input.location],
    );
    expect(api.replacePrivateFacts).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      2,
      input.privateFacts,
    );
    expect(api.uploadMedia).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      3,
      input.files[0],
    );
    expect(api.submit).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      4,
      "report-submit-key",
    );
    expect(result.version).toBe(5);
  });

  it("keeps a complete server draft without submitting", async () => {
    const api = createApi();

    const result = await persistReport(api, { ...input, files: [] }, {
      idempotencyKey: "report-draft-key",
      submit: false,
    });

    expect(api.uploadMedia).not.toHaveBeenCalled();
    expect(api.submit).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      id: "22222222-2222-4222-8222-222222222222",
      publicCode: "FM-ABC123",
      version: 3,
    });
  });

  it("does not send empty private facts", async () => {
    const api = createApi();

    await persistReport(
      api,
      { ...input, privateFacts: [], files: [] },
      { idempotencyKey: "report-no-private-key", submit: false },
    );

    expect(api.replacePrivateFacts).not.toHaveBeenCalled();
    expect(api.replaceLocations).toHaveBeenCalledWith(
      expect.any(String),
      1,
      [input.location],
    );
  });

  it("skips media already acknowledged during a retry", async () => {
    const api = createApi();
    const uploadedFileKeys = new Set([reportFileKey(input.files[0])]);

    await persistReport(api, input, {
      idempotencyKey: "stable-create-key",
      submit: true,
      submitIdempotencyKey: "stable-submit-key",
      uploadedFileKeys,
    });

    expect(api.uploadMedia).not.toHaveBeenCalled();
  });
});
