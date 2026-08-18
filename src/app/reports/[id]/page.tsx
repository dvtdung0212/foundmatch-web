import { Metadata } from "next";
import { ReportDetailView } from "@/features/reports/components/detail/ReportDetailView";

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Báo cáo ${params.id} | FoundMatch`,
    description: "Chi tiết báo cáo đồ vật thất lạc và theo dõi trạng thái.",
  };
}

export default function ReportDetailPage({ params }: PageProps) {
  return <ReportDetailView id={params.id} />;
}
