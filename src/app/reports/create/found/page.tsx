import { Metadata } from "next";
import { redirect } from "next/navigation";
import { FoundReportWizard } from "@/features/reports/components/create/FoundReportWizard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tạo báo cáo nhặt được đồ | FoundMatch",
  description: "Đăng thông tin đồ vật nhặt được để trao trả cho chủ nhân.",
};

export default async function CreateFoundReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/reports/create/found");

  return <FoundReportWizard />;
}
