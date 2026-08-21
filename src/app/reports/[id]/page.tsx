import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ReportDetailView } from "@/features/reports/components/detail/ReportDetailView";
import { mapOwnerReportView } from "@/features/reports/api/owner-report-view";
import { getServerApiClient } from "@/lib/api/server-client";

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

export default async function ReportDetailPage({ params }: PageProps) {
  try {
    const api = await getServerApiClient();
    const [reportResponse, privateFactsResponse] = await Promise.all([
      api.GET("/api/v1/public/item-declarations/{id}", {
        params: { path: { id: params.id } },
      }),
      api.GET("/api/v1/public/item-declarations/{id}/private-facts", {
        params: { path: { id: params.id } },
      }),
    ]);

    if (!reportResponse.data || !privateFactsResponse.data) notFound();

    return (
      <ReportDetailView
        report={mapOwnerReportView(reportResponse.data, privateFactsResponse.data)}
      />
    );
  } catch (error) {
    const status = (error as { status?: number })?.status;
    if (status === 401) redirect(`/login?next=/reports/${params.id}`);
    if (status === 403 || status === 404) notFound();
    throw error;
  }
}
