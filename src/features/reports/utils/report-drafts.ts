import type { OwnerItemDeclarationDto } from "../components/my-reports/types";

export interface SavedReportDraft {
  type: "LOST" | "FOUND";
  title?: string;
  category?: string;
  description?: string;
  date?: string;
  timeSlot?: string;
  locationName?: string;
  locationArea?: string;
  locationDetail?: string;
  images?: string[];
  attributeAnswers?: unknown[];
  updatedAt: string;
  currentStep?: number;
  [key: string]: unknown;
}

const LOST_DRAFT_KEY = "foundmatch_lost_draft";
const FOUND_DRAFT_KEY = "foundmatch_found_draft";

export function saveReportDraft(
  type: "LOST" | "FOUND",
  data: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  try {
    const key = type === "LOST" ? LOST_DRAFT_KEY : FOUND_DRAFT_KEY;
    const draftPayload: SavedReportDraft = {
      ...data,
      type,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(draftPayload));
  } catch (err) {
    console.error("Failed to save report draft to localStorage:", err);
  }
}

export function getReportDraft(type: "LOST" | "FOUND"): SavedReportDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const key = type === "LOST" ? LOST_DRAFT_KEY : FOUND_DRAFT_KEY;
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as SavedReportDraft;
  } catch (err) {
    console.error("Failed to read report draft from localStorage:", err);
    return null;
  }
}

export function deleteReportDraft(typeOrId: "LOST" | "FOUND" | string): void {
  if (typeof window === "undefined") return;
  try {
    if (typeOrId === "LOST" || typeOrId === "draft_lost") {
      localStorage.removeItem(LOST_DRAFT_KEY);
    } else if (typeOrId === "FOUND" || typeOrId === "draft_found") {
      localStorage.removeItem(FOUND_DRAFT_KEY);
    } else {
      localStorage.removeItem(typeOrId);
    }
  } catch (err) {
    console.error("Failed to delete report draft from localStorage:", err);
  }
}

export function getAllReportDrafts(): OwnerItemDeclarationDto[] {
  if (typeof window === "undefined") return [];
  const drafts: OwnerItemDeclarationDto[] = [];

  const lostDraft = getReportDraft("LOST");
  if (lostDraft) {
    drafts.push({
      id: "draft_lost",
      code: "BẢN NHÁP",
      title: lostDraft.title || "Bản nháp báo cáo mất đồ",
      category: lostDraft.category || "",
      type: "LOST",
      workflowStatus: "DRAFT",
      version: 1,
      createdAt: lostDraft.updatedAt || new Date().toISOString(),
      updatedAt: lostDraft.updatedAt || new Date().toISOString(),
      publicAreaLabel: lostDraft.locationName || lostDraft.locationArea || "Chưa chọn vị trí",
      media: (lostDraft.images || []).map((url) => ({
        id: "draft_media",
        url,
        caption: null,
        displayOrder: 0,
      })),
      isDraft: true,
      editUrl: "/reports/create/lost",
    } as unknown as OwnerItemDeclarationDto);
  }

  const foundDraft = getReportDraft("FOUND");
  if (foundDraft) {
    drafts.push({
      id: "draft_found",
      code: "BẢN NHÁP",
      title: foundDraft.title || "Bản nháp báo cáo nhặt được",
      category: foundDraft.category || "",
      type: "FOUND",
      workflowStatus: "DRAFT",
      version: 1,
      createdAt: foundDraft.updatedAt || new Date().toISOString(),
      updatedAt: foundDraft.updatedAt || new Date().toISOString(),
      publicAreaLabel: foundDraft.locationName || foundDraft.locationArea || "Chưa chọn vị trí",
      media: (foundDraft.images || []).map((url) => ({
        id: "draft_media",
        url,
        caption: null,
        displayOrder: 0,
      })),
      isDraft: true,
      editUrl: "/reports/create/found",
    } as unknown as OwnerItemDeclarationDto);
  }

  return drafts;
}
