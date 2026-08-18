import { Metadata } from "next";
import { LostReportWizard } from "@/features/reports/components/create/LostReportWizard";

export const metadata: Metadata = {
  title: "Tạo báo cáo mất đồ | FoundMatch",
  description: "Đăng thông tin đồ vật bị thất lạc để kết nối tìm lại tài sản.",
};

export default function CreateLostReportPage() {
  return <LostReportWizard />;
}
