import { MyReportsView } from "@/features/reports/components/my-reports/MyReportsView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Báo cáo của tôi | FoundMatch",
  description: "Quản lý và theo dõi tất cả các báo cáo đồ thất lạc và nhặt được bạn đã tạo.",
};

export default function MyReportsPage() {
  return <MyReportsView />;
}
