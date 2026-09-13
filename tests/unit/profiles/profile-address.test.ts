import { describe, expect, it } from "vitest";
import {
  parseAddress,
  formatAddress,
} from "@/features/profiles/utils/address.utils";

describe("Profile Address Parser and Formatter", () => {
  describe("parseAddress", () => {
    it("returns empty fields for null or undefined or empty address", () => {
      expect(parseAddress(null)).toEqual({
        city: "",
        ward: "",
        streetAddress: "",
      });
      expect(parseAddress(undefined)).toEqual({
        city: "",
        ward: "",
        streetAddress: "",
      });
      expect(parseAddress("")).toEqual({
        city: "",
        ward: "",
        streetAddress: "",
      });
    });

    it("parses 1-part address as city", () => {
      expect(parseAddress("TP. Hồ Chí Minh")).toEqual({
        city: "TP. Hồ Chí Minh",
        ward: "",
        streetAddress: "",
      });
    });

    it("parses 2-part address as ward and city", () => {
      expect(parseAddress("Phường Bến Nghé, TP. Hồ Chí Minh")).toEqual({
        city: "TP. Hồ Chí Minh",
        ward: "Phường Bến Nghé",
        streetAddress: "",
      });
    });

    it("parses 3-part address into streetAddress, ward, and city", () => {
      expect(
        parseAddress("123 Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh"),
      ).toEqual({
        city: "TP. Hồ Chí Minh",
        ward: "Phường Bến Nghé",
        streetAddress: "123 Lê Lợi",
      });
    });

    it("handles complex multi-part addresses with extra commas into streetAddress", () => {
      expect(
        parseAddress(
          "Tầng 5, Tòa nhà Bitexco, Số 2 Hải Triều, Phường Bến Nghé, TP. Hồ Chí Minh",
        ),
      ).toEqual({
        city: "TP. Hồ Chí Minh",
        ward: "Phường Bến Nghé",
        streetAddress: "Tầng 5, Tòa nhà Bitexco, Số 2 Hải Triều",
      });
    });
  });

  describe("formatAddress", () => {
    it("formats all 3 parts with commas and trimming", () => {
      expect(
        formatAddress(" TP. Hồ Chí Minh ", " Phường Bến Nghé ", " 123 Lê Lợi "),
      ).toBe("123 Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh");
    });

    it("handles missing streetAddress gracefully", () => {
      expect(formatAddress("Hà Nội", "Phường Dịch Vọng Hậu", "")).toBe(
        "Phường Dịch Vọng Hậu, Hà Nội",
      );
    });

    it("handles only city", () => {
      expect(formatAddress("Đà Nẵng", "", "")).toBe("Đà Nẵng");
    });

    it("returns empty string if all inputs are blank", () => {
      expect(formatAddress("  ", "", "  ")).toBe("");
    });
  });
});
