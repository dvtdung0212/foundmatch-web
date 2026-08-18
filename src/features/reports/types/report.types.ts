export type ReportType = "lost" | "found";

export type ReportStatus =
  | "pending_approval"
  | "active"
  | "matching"
  | "verifying"
  | "in_custody"
  | "handover_scheduled"
  | "completed"
  | "closed"
  | "hidden";

export interface ReportFormData {
  type: ReportType;
  category: string;
  title: string;
  brand?: string;
  material?: string;
  color: string;
  size?: string;
  style?: string;
  genderTarget?: string;
  condition?: string;
  description: string;
  
  // Time & Location
  date: string;
  timeSlot: string;
  locationName: string;
  locationArea: string;
  locationDetail?: string;
  
  // Media
  images: string[];
  
  // Security & Verification (Lost only)
  distinctiveFeatures?: string;
  secretVerificationAnswers?: string;
  
  // Custody & Privacy (Found only)
  custodyType?: "self_hold" | "holding_point";
  holdingPointId?: string;
  holdingPointName?: string;
  privacySetting?: "partial" | "minimal" | "full";
}

export interface ReportDetailData extends ReportFormData {
  id: string;
  code: string;
  status: ReportStatus;
  statusText: string;
  createdAt: string;
  reporterName: string;
  reporterAvatar?: string;
  potentialMatchesCount: number;
  verificationRequestsCount: number;
  timeline: {
    title: string;
    description: string;
    time: string;
    type: "info" | "success" | "warning";
  }[];
}
