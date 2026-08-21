import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LostReportWizard } from "@/features/reports/components/create/LostReportWizard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tạo báo cáo mất đồ | FoundMatch",
  description: "Đăng thông tin đồ vật bị thất lạc để kết nối tìm lại tài sản.",
};

export default async function CreateLostReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/reports/create/lost");

  return <LostReportWizard />;
}
