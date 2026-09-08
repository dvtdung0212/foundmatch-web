import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LostReportWizard } from "@/features/reports/components/create/LostReportWizard";
import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";

export const metadata: Metadata = {
  title: "Tạo báo cáo mất đồ | FoundMatch",
  description: "Đăng thông tin đồ vật bị thất lạc để kết nối tìm lại tài sản.",
};

export default async function CreateLostReportPage() {
  const profile = await getCurrentProfile();
  if (!profile.success || !profile.data)
    redirect("/login?next=/reports/create/lost");

  return <LostReportWizard />;
}
