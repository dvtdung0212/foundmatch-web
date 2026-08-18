import { Metadata } from "next";
import { Suspense } from "react";
import { ReportSuccessCard } from "@/features/reports/components/create/ReportSuccessCard";

export const metadata: Metadata = {
  title: "Tạo báo cáo thành công | FoundMatch",
  description: "Báo cáo của bạn đã được tiếp nhận và xử lý trên hệ thống.",
};

export default function CreateReportSuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-brand-muted text-sm">Đang tải...</div>}>
      <ReportSuccessCard />
    </Suspense>
  );
}
