import { Metadata } from "next";
import { FoundReportWizard } from "@/features/reports/components/create/FoundReportWizard";

export const metadata: Metadata = {
  title: "Tạo báo cáo nhặt được đồ | FoundMatch",
  description: "Đăng thông tin đồ vật nhặt được để trao trả cho chủ nhân.",
};

export default function CreateFoundReportPage() {
  return <FoundReportWizard />;
}
