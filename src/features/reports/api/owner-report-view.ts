type OwnerReportSource = {
  category?: { id?: unknown; name?: unknown };
  createdAt: string;
  description?: unknown;
  eventEndedAt?: unknown;
  eventStartedAt?: unknown;
  id: string;
  locations: Array<{
    id?: string;
    precision?: string;
    publicAreaLabel?: unknown;
    purpose?: string;
    visibility?: string;
  }>;
  media: Array<{
    id: string;
    processingStatus: "PENDING" | "READY" | "REJECTED" | "FAILED";
    url?: unknown;
  }>;
  publicAreaLabel?: unknown;
  publicCode: string;
  publishedAt?: unknown;
  reviewStatus: "NOT_REQUIRED" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt?: unknown;
  title?: unknown;
  type: "LOST" | "FOUND";
  updatedAt: string;
  version: number;
  visibilityStatus: "PRIVATE" | "PUBLIC" | "HIDDEN";
  workflowStatus: "DRAFT" | "SUBMITTED" | "ACTIVE" | "RESOLVED" | "CLOSED" | "WITHDRAWN" | "EXPIRED" | "ARCHIVED";
};

type PrivateFactsSource = {
  facts: Array<{ kind: string; value: string }>;
};

export type OwnerReportView = {
  activities: Array<{
    description: string;
    id: string;
    time: string;
    title: string;
  }>;
  category: string;
  code: string;
  description: string;
  distinctiveFeatures?: string;
  id: string;
  images: string[];
  isPublic: boolean;
  location: string;
  locationDetail?: string;
  pendingMediaCount: number;
  potentialMatchesCount: number;
  secretVerificationAnswers?: string;
  statusText: string;
  time: string;
  title: string;
  type: "lost" | "found";
  typeText: string;
  verificationRequestsCount: number;
  workflowStatus: OwnerReportSource["workflowStatus"];
};

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

function statusText(report: OwnerReportSource): string {
  if (report.reviewStatus === "PENDING_REVIEW") return "Đang chờ duyệt";
  if (report.reviewStatus === "REJECTED") return "Cần chỉnh sửa";

  const labels: Record<OwnerReportSource["workflowStatus"], string> = {
    ACTIVE: "Đang hoạt động",
    ARCHIVED: "Đã lưu trữ",
    CLOSED: "Đã đóng",
    DRAFT: "Bản nháp",
    EXPIRED: "Đã hết hạn",
    RESOLVED: "Đã tìm thấy chủ sở hữu",
    SUBMITTED: "Đã gửi",
    WITHDRAWN: "Đã rút lại",
  };
  return labels[report.workflowStatus];
}

function fact(source: PrivateFactsSource, kind: string): string | undefined {
  return source.facts.find((item) => item.kind === kind)?.value;
}

export function mapOwnerReportView(
  report: OwnerReportSource,
  privateFacts: PrivateFactsSource,
): OwnerReportView {
  const eventStartedAt = text(report.eventStartedAt);
  const eventEndedAt = text(report.eventEndedAt);
  const readyImages = report.media
    .filter(({ processingStatus, url }) => processingStatus === "READY" && text(url))
    .map(({ url }) => text(url) as string);

  return {
    activities: [
      {
        description: "Bản ghi báo cáo được tạo trong hệ thống.",
        id: `created-${report.id}`,
        time: formatDate(report.createdAt),
        title: "Đã tạo báo cáo",
      },
    ],
    category: text(report.category?.name) ?? "Chưa chọn danh mục",
    code: report.publicCode,
    description: text(report.description) ?? "Chưa có mô tả.",
    distinctiveFeatures: fact(privateFacts, "distinctive_feature"),
    id: report.id,
    images: readyImages,
    isPublic:
      report.workflowStatus === "ACTIVE" && report.visibilityStatus === "PUBLIC",
    location:
      text(report.publicAreaLabel) ??
      text(report.locations[0]?.publicAreaLabel) ??
      "Chưa có khu vực công khai",
    locationDetail: fact(privateFacts, "exact_location_context"),
    pendingMediaCount: report.media.filter(({ processingStatus }) => processingStatus === "PENDING").length,
    potentialMatchesCount: 0,
    secretVerificationAnswers: fact(privateFacts, "verification_secret"),
    statusText: statusText(report),
    time: eventStartedAt
      ? `${formatDate(eventStartedAt)}${eventEndedAt ? ` – ${formatDate(eventEndedAt)}` : ""}`
      : "Chưa có thời gian",
    title: text(report.title) ?? "Báo cáo chưa đặt tên",
    type: report.type.toLowerCase() as "lost" | "found",
    typeText: report.type === "LOST" ? "Tôi bị mất đồ" : "Tôi nhặt được đồ",
    verificationRequestsCount: 0,
    workflowStatus: report.workflowStatus,
  };
}
