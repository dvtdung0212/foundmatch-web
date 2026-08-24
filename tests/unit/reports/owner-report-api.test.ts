import { describe, expect, it, vi } from "vitest";

import { createOwnerReportApi } from "@/features/reports/api/owner-report-api";

describe("createOwnerReportApi", () => {
  it("uses generated operation paths and required idempotency headers", async () => {
    const client = {
      POST: vi
        .fn()
        .mockResolvedValueOnce({
          data: { id: "report-id", publicCode: "FM-1", version: 1 },
        })
        .mockResolvedValueOnce({
          data: {
            id: "report-id",
            publicCode: "FM-1",
            version: 2,
            workflowStatus: "ACTIVE",
          },
        }),
      PUT: vi.fn(),
    };
    const api = createOwnerReportApi(client as never);

    await api.createDraft(
      {
        categoryId: "11111111-1111-4111-8111-111111111111",
        categoryName: "Ví",
        description: "Ví màu đen",
        eventStartedAt: "2026-08-20T07:00:00.000Z",
        publicAreaLabel: "Bến Thành",
        title: "Ví đen",
        type: "LOST",
      },
      "create-key",
    );
    await api.submit("report-id", 1, "submit-key");

    expect(client.POST).toHaveBeenNthCalledWith(
      1,
      "/api/v1/public/item-declarations",
      expect.objectContaining({
        params: { header: { "Idempotency-Key": "create-key" } },
      }),
    );
    expect(client.POST).toHaveBeenNthCalledWith(
      2,
      "/api/v1/public/item-declarations/{id}/submit",
      expect.objectContaining({
        body: { expectedVersion: 1 },
        params: {
          header: { "Idempotency-Key": "submit-key" },
          path: { id: "report-id" },
        },
      }),
    );
  });

  it("serializes media as multipart form data", async () => {
    const client = {
      POST: vi.fn().mockResolvedValue({ data: { version: 2 } }),
      PUT: vi.fn(),
    };
    const api = createOwnerReportApi(client as never);
    const file = new File(["image"], "wallet.jpg", { type: "image/jpeg" });

    await api.uploadMedia("report-id", 1, file);

    const options = client.POST.mock.calls[0]?.[1];
    expect(client.POST.mock.calls[0]?.[0]).toBe(
      "/api/v1/public/item-declarations/{id}/media",
    );
    expect(options.body).toBeInstanceOf(FormData);
    expect(options.body.get("expectedVersion")).toBe("1");
    expect(options.body.get("file")).toBe(file);
    expect(options.bodySerializer(options.body)).toBe(options.body);
  });

  it("preserves the backend error code and field details", async () => {
    const error = Object.assign(new Error("The declaration changed."), {
      data: {
        code: "ITEM_DECLARATION_VERSION_CONFLICT",
        details: { field: "expectedVersion" },
        message: "The declaration changed.",
        requestId: "request-1",
      },
      status: 409,
    });
    const client = {
      POST: vi.fn().mockRejectedValue(error),
      PUT: vi.fn(),
    };
    const api = createOwnerReportApi(client as never);

    await expect(
      api.submit("report-id", 1, "submit-key"),
    ).rejects.toMatchObject({
      code: "ITEM_DECLARATION_VERSION_CONFLICT",
      field: "expectedVersion",
      requestId: "request-1",
      status: 409,
    });
  });

  it("loads form configuration and replaces normalized answers", async () => {
    const client = {
      GET: vi.fn().mockResolvedValue({
        data: {
          attributes: [],
          category: {
            id: "category-id",
            inputMode: "STANDARD",
            name: "Wallet",
          },
          reportType: "LOST",
        },
      }),
      POST: vi.fn(),
      PUT: vi.fn().mockResolvedValue({ data: { version: 2 } }),
    };
    const api = createOwnerReportApi(client as never);
    const answers = [
      {
        assignmentId: "33333333-3333-4333-8333-333333333333",
        value: { kind: "TEXT" as const, textValue: "genuine leather" },
      },
    ];

    await api.getFormConfiguration("category-id", "LOST");
    await api.replaceAttributes("report-id", 1, answers);

    expect(client.GET).toHaveBeenCalledWith(
      "/api/v1/public/categories/{id}/report-form",
      {
        params: { path: { id: "category-id" }, query: { reportType: "LOST" } },
      },
    );
    expect(client.PUT).toHaveBeenCalledWith(
      "/api/v1/public/item-declarations/{id}/attributes",
      {
        body: { expectedVersion: 1, answers },
        params: { path: { id: "report-id" } },
      },
    );
  });
});
