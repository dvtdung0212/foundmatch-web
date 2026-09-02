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
  reviewStatus:
    | "NOT_REQUIRED"
    | "PENDING_REVIEW"
    | "APPROVED"
    | "REJECTED"
    | "NEEDS_INFORMATION";
  openInformationRequest?: {
    id: string;
    message: string;
    createdAt: string;
    fields: Array<{
      attributeAssignmentId: string | null;
      fieldKey: string;
      fieldKind: string;
      fulfilled: boolean;
      label: string;
    }>;
  } | null;
  submittedAt?: unknown;
  title?: unknown;
  type: "LOST" | "FOUND";
  updatedAt: string;
  version: number;
  visibilityStatus: "PRIVATE" | "PUBLIC" | "HIDDEN";
  workflowStatus:
    | "DRAFT"
    | "SUBMITTED"
    | "ACTIVE"
    | "RESOLVED"
    | "CLOSED"
    | "WITHDRAWN"
    | "EXPIRED"
    | "ARCHIVED";
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
  eventDate: string;
  eventTimeRange: string;
  id: string;
  images: string[];
  isPublic: boolean;
  location: string;
  locationDetail?: string;
  openInformationRequest?: {
    id: string;
    message: string;
    createdAt: string;
    fields: Array<{
      kind: string;
      key: string;
      labelSnapshot: string;
      attributeAssignmentId?: string | null;
    }>;
  } | null;
  pendingMediaCount: number;
  potentialMatchesCount: number;
  reviewStatus: OwnerReportSource["reviewStatus"];
  secretVerificationAnswers?: string;
  statusText: string;
  time: string;
  title: string;
  type: "lost" | "found";
  typeText: string;
  verificationRequestsCount: number;
  version: number;
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

function formatDateTimeClean(date: Date): { dateStr: string; timeStr: string } {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return {
    dateStr: `${day}/${month}/${year}`,
    timeStr: `${hours}:${minutes}`,
  };
}

export function formatEventTime(
  startedAtStr?: string,
  endedAtStr?: string,
): {
  date: string;
  timeRange: string;
  formatted: string;
} {
  if (!startedAtStr) {
    return {
      date: "Chưa xác định",
      timeRange: "Chưa xác định",
      formatted: "Chưa có thời gian",
    };
  }

  const startDate = new Date(startedAtStr);
  const start = formatDateTimeClean(startDate);

  if (!endedAtStr) {
    return {
      date: start.dateStr,
      timeRange: start.timeStr,
      formatted: `${start.timeStr}, ${start.dateStr}`,
    };
  }

  const endDate = new Date(endedAtStr);
  const end = formatDateTimeClean(endDate);

  if (start.dateStr === end.dateStr) {
    const timeRange =
      start.timeStr === end.timeStr
        ? start.timeStr
        : `${start.timeStr} – ${end.timeStr}`;
    return {
      date: start.dateStr,
      timeRange,
      formatted: `${timeRange}, ${start.dateStr}`,
    };
  }

  return {
    date: `${start.dateStr} – ${end.dateStr}`,
    timeRange: `${start.timeStr} – ${end.timeStr}`,
    formatted: `${start.timeStr} ${start.dateStr} – ${end.timeStr} ${end.dateStr}`,
  };
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
    .filter(
      ({ processingStatus, url }) => processingStatus === "READY" && text(url),
    )
    .map(({ url }) => text(url) as string);

  const eventTimeInfo = formatEventTime(eventStartedAt, eventEndedAt);

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
    eventDate: eventTimeInfo.date,
    eventTimeRange: eventTimeInfo.timeRange,
    id: report.id,
    images: readyImages,
    isPublic:
      report.workflowStatus === "ACTIVE" &&
      report.visibilityStatus === "PUBLIC",
    location:
      text(report.publicAreaLabel) ??
      text(report.locations[0]?.publicAreaLabel) ??
      "Chưa có khu vực công khai",
    locationDetail: fact(privateFacts, "exact_location_context"),
    openInformationRequest: report.openInformationRequest
      ? {
          createdAt: report.openInformationRequest.createdAt,
          fields: report.openInformationRequest.fields.map((field) => ({
            attributeAssignmentId: field.attributeAssignmentId,
            key: field.fieldKey,
            kind: field.fieldKind,
            labelSnapshot: field.label,
          })),
          id: report.openInformationRequest.id,
          message: report.openInformationRequest.message,
        }
      : null,
    pendingMediaCount: report.media.filter(
      ({ processingStatus }) => processingStatus === "PENDING",
    ).length,
    potentialMatchesCount: 0,
    reviewStatus: report.reviewStatus,
    secretVerificationAnswers: fact(privateFacts, "verification_secret"),
    statusText: statusText(report),
    time: eventTimeInfo.formatted,
    title: text(report.title) ?? "Báo cáo chưa đặt tên",
    type: report.type.toLowerCase() as "lost" | "found",
    typeText: report.type === "LOST" ? "Tôi bị mất đồ" : "Tôi nhặt được đồ",
    verificationRequestsCount: 0,
    version: report.version,
    workflowStatus: report.workflowStatus,
  };
}
