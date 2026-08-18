import { Metadata } from "next";
import { ReportTypeSelector } from "@/features/reports/components/create/ReportTypeSelector";

export const metadata: Metadata = {
  title: "Chọn loại báo cáo | FoundMatch",
  description: "Chọn báo cáo mất đồ hoặc nhặt được đồ để tìm kiếm và hỗ trợ nhanh chóng.",
};

export default function CreateReportPage() {
  return <ReportTypeSelector />;
}
