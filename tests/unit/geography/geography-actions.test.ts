import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getPublicProvinces,
  getPublicWards,
} from "@/features/geography/actions/geography.actions";
import { getServerApiClient } from "@/lib/api/server-client";

vi.mock("@/lib/api/server-client", () => ({
  getServerApiClient: vi.fn(),
}));

describe("Geography Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPublicProvinces", () => {
    it("returns provinces from backend API when available", async () => {
      const mockGet = vi.fn().mockResolvedValue({
        data: {
          data: [
            { id: "geo-1", code: "01", name: "Hà Nội", geographyTypeCode: "CITY" },
            { id: "geo-2", code: "79", name: "TP. Hồ Chí Minh", geographyTypeCode: "CITY" },
          ],
          total: 2,
        },
        error: null,
      });

      vi.mocked(getServerApiClient).mockResolvedValue({
        GET: mockGet,
      } as any);

      const result = await getPublicProvinces();

      expect(mockGet).toHaveBeenCalledWith(
        "/api/v1/public/geography/geographies",
        expect.objectContaining({
          params: expect.objectContaining({
            query: expect.objectContaining({
              countryCode: "VN",
              typeCodes: ["CITY", "PROVINCE"],
            }),
          }),
        }),
      );
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Hà Nội");
      expect(result[1].name).toBe("TP. Hồ Chí Minh");
    });

    it("falls back to default Vietnam provinces when API returns empty or errors", async () => {
      vi.mocked(getServerApiClient).mockResolvedValue({
        GET: vi.fn().mockResolvedValue({
          data: null,
          error: { message: "Backend error" },
        }),
      } as any);

      const result = await getPublicProvinces();

      expect(result.length).toBeGreaterThan(10);
      expect(result.some((p) => p.name === "Hà Nội")).toBe(true);
      expect(result.some((p) => p.name === "TP. Hồ Chí Minh")).toBe(true);
      expect(result.some((p) => p.name === "Đà Nẵng")).toBe(true);
    });
  });

  describe("getPublicWards", () => {
    it("returns empty array immediately if parentId is empty", async () => {
      const result = await getPublicWards("");
      expect(result).toEqual([]);
      expect(getServerApiClient).not.toHaveBeenCalled();
    });

    it("fetches wards by parentId from backend API", async () => {
      const mockGet = vi.fn().mockResolvedValue({
        data: {
          data: [
            { id: "ward-1", code: "00001", name: "Phường Phúc Xá", geographyTypeCode: "WARD", parentId: "geo-1" },
            { id: "ward-2", code: "00004", name: "Phường Trúc Bạch", geographyTypeCode: "WARD", parentId: "geo-1" },
          ],
          total: 2,
        },
        error: null,
      });

      vi.mocked(getServerApiClient).mockResolvedValue({
        GET: mockGet,
      } as any);

      const result = await getPublicWards("geo-1");

      expect(mockGet).toHaveBeenCalledWith(
        "/api/v1/public/geography/geographies",
        expect.objectContaining({
          params: expect.objectContaining({
            query: expect.objectContaining({
              parentId: "geo-1",
            }),
          }),
        }),
      );
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Phường Phúc Xá");
      expect(result[1].name).toBe("Phường Trúc Bạch");
    });

    it("returns empty array on API error", async () => {
      vi.mocked(getServerApiClient).mockResolvedValue({
        GET: vi.fn().mockRejectedValue(new Error("Network failure")),
      } as any);

      const result = await getPublicWards("geo-1");
      expect(result).toEqual([]);
    });
  });
});
