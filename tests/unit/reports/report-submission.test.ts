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
  privateFacts: [{ kind: "verification_secret", value: "Có đồng xu kỷ niệm" }],
  attributes: [
    {
      assignmentId: "33333333-3333-4333-8333-333333333333",
      value: { kind: "TEXT", textValue: "genuine leather" },
    },
  ],
  files: [new File(["image"], "wallet.jpg", { type: "image/jpeg" })],
};

function createApi(): OwnerReportApi {
  return {
    getFormConfiguration: vi.fn(),
    createDraft: vi.fn().mockResolvedValue({
      id: "22222222-2222-4222-8222-222222222222",
      publicCode: "FM-ABC123",
      version: 1,
    }),
    replaceLocations: vi.fn().mockResolvedValue({ version: 2 }),
    replaceAttributes: vi.fn().mockResolvedValue({ version: 3 }),
    replacePrivateFacts: vi.fn().mockResolvedValue({ version: 4 }),
    uploadMedia: vi.fn().mockResolvedValue({ version: 5 }),
    submit: vi.fn().mockResolvedValue({
      id: "22222222-2222-4222-8222-222222222222",
      publicCode: "FM-ABC123",
      version: 6,
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
      3,
      input.privateFacts,
    );
    expect(api.replaceAttributes).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      2,
      input.attributes,
    );
    expect(api.uploadMedia).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      4,
      input.files[0],
    );
    expect(api.submit).toHaveBeenCalledWith(
      "22222222-2222-4222-8222-222222222222",
      5,
      "report-submit-key",
    );
    expect(result.version).toBe(6);
  });

  it("keeps a complete server draft without submitting", async () => {
    const api = createApi();

    const result = await persistReport(
      api,
      { ...input, files: [] },
      {
        idempotencyKey: "report-draft-key",
        submit: false,
      },
    );

    expect(api.uploadMedia).not.toHaveBeenCalled();
    expect(api.submit).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      id: "22222222-2222-4222-8222-222222222222",
      publicCode: "FM-ABC123",
      version: 4,
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
    expect(api.replaceAttributes).toHaveBeenCalledWith(
      expect.any(String),
      2,
      input.attributes,
    );
    expect(api.replaceLocations).toHaveBeenCalledWith(expect.any(String), 1, [
      input.location,
    ]);
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
