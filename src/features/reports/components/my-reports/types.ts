export interface OwnerItemDeclarationDto {
  id: string;
  publicCode: string;
  type: "LOST" | "FOUND" | string;
  title?: string | null;
  description?: string | null;
  color?: string | null;
  brand?: string | null;
  publicAreaLabel?: string | null;
  workflowStatus: "DRAFT" | "SUBMITTED" | "ACTIVE" | "RESOLVED" | "CLOSED" | "WITHDRAWN" | "EXPIRED" | "ARCHIVED" | string;
  visibilityStatus: "PRIVATE" | "PUBLIC" | "HIDDEN" | string;
  reviewStatus: "NOT_REQUIRED" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | string;
  version: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date | null;
  submittedAt?: string | Date | null;
  eventStartedAt?: string | Date | null;
  eventEndedAt?: string | Date | null;
  category?: {
    id?: string | null;
    name?: string | null;
  } | null;
  media?: Array<{
    id: string;
    processingStatus: string;
    url?: string | null;
  }>;
  isDraft?: boolean;
  editUrl?: string;
}

export interface OwnerItemDeclarationPageDto {
  items: OwnerItemDeclarationDto[];
  page: number;
  pageSize: number;
  total: number;
}
