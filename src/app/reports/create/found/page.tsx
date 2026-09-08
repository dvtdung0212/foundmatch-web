import { Metadata } from "next";
import { redirect } from "next/navigation";
import { FoundReportWizard } from "@/features/reports/components/create/FoundReportWizard";
import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";

export const metadata: Metadata = {
  title: "Tạo báo cáo nhặt được đồ | FoundMatch",
  description: "Đăng thông tin đồ vật nhặt được để trao trả cho chủ nhân.",
};

export default async function CreateFoundReportPage() {
  const profile = await getCurrentProfile();
  if (!profile.success || !profile.data)
    redirect("/login?next=/reports/create/found");

  return <FoundReportWizard />;
}
