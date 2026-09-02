import type { OwnerMatchCandidate } from "../api/owner-match-candidate-api";

type FactorCode = OwnerMatchCandidate["components"][number]["code"];

const FACTOR_LABELS: Record<FactorCode, string> = {
  BRAND: "Thương hiệu",
  CATEGORY: "Danh mục",
  COLOR: "Màu sắc",
  DISTANCE: "Khu vực gần nhau",
  PUBLIC_ATTRIBUTES: "Thuộc tính công khai",
  PUBLIC_TEXT: "Mô tả công khai",
  TIME: "Thời gian",
};

export function factorLabel(code: FactorCode): string {
  return FACTOR_LABELS[code];
}

export function strengthLabel(
  strength: OwnerMatchCandidate["strength"],
): string {
  return strength === "STRONG" ? "Rất phù hợp" : "Phù hợp";
}

export function reportTypeLabel(type: "FOUND" | "LOST"): string {
  return type === "FOUND" ? "Báo cáo đồ nhặt" : "Báo cáo đồ mất";
}

export function formatCandidateTime(
  start: string,
  end?: string | null,
): string {
  const formatter = new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const startText = formatter.format(new Date(start));
  return end ? `${startText} – ${formatter.format(new Date(end))}` : startText;
}
