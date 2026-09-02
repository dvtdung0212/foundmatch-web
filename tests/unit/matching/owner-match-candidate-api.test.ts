import { describe, expect, it, vi } from "vitest";

import { createOwnerMatchCandidateApi } from "@/features/matching/api/owner-match-candidate-api";

describe("createOwnerMatchCandidateApi", () => {
  it("uses generated owner candidate paths and pagination", async () => {
    const page = { items: [], page: 2, pageSize: 10, total: 0 };
    const client = { GET: vi.fn().mockResolvedValue({ data: page }) };
    const api = createOwnerMatchCandidateApi(client as never);

    await expect(api.list("declaration-1", 2, 10)).resolves.toEqual(page);
    expect(client.GET.mock.calls).toEqual([
      [
        "/api/v1/public/item-declarations/{id}/matches",
        {
          params: {
            path: { id: "declaration-1" },
            query: { page: 2, pageSize: 10 },
          },
        },
      ],
    ]);
  });

  it.each(["save", "unsave", "dismiss", "restore"] as const)(
    "sends %s with an idempotency key",
    async (action) => {
      const candidate = { id: "candidate-1" };
      const client = { POST: vi.fn().mockResolvedValue({ data: candidate }) };
      const api = createOwnerMatchCandidateApi(client as never);

      await expect(
        api[action]("candidate-1", "request-key-123"),
      ).resolves.toEqual(candidate);
      expect(client.POST.mock.calls).toEqual([
        [
          `/api/v1/public/match-candidates/{id}/${action}`,
          {
            params: {
              header: { "Idempotency-Key": "request-key-123" },
              path: { id: "candidate-1" },
            },
          },
        ],
      ]);
    },
  );

  it("preserves stable backend errors for conflict handling", async () => {
    const client = {
      POST: vi.fn().mockRejectedValue(
        Object.assign(new Error("Candidate changed."), {
          data: {
            code: "MATCH_CANDIDATE_VERSION_CONFLICT",
            message: "Candidate changed.",
            requestId: "request-1",
          },
          status: 409,
        }),
      ),
    };
    const api = createOwnerMatchCandidateApi(client as never);

    await expect(
      api.dismiss("candidate-1", "request-key-123"),
    ).rejects.toMatchObject({
      code: "MATCH_CANDIDATE_VERSION_CONFLICT",
      requestId: "request-1",
      status: 409,
    });
  });
});
