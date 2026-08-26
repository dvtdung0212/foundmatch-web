"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  FileText,
  Lock,
  Tag,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ReportDetailHeroHeader } from "./ReportDetailHeroHeader";
import { OverviewTab } from "./tabs/OverviewTab";
import { PublicAttributesTab } from "./tabs/PublicAttributesTab";
import { PrivateVerificationTab } from "./tabs/PrivateVerificationTab";
import { MatchCandidatesTab } from "./tabs/MatchCandidatesTab";
import { ActivityHistoryTab } from "./tabs/ActivityHistoryTab";
import { CloseReportDialog } from "../modals/CloseReportDialog";
import { ShareReportDialog } from "../modals/ShareReportDialog";
import type { OwnerReportView } from "../../api/owner-report-view";
import {
  closeOwnReport,
  getAuthenticatedOwnerReportView,
  withdrawOwnReport,
} from "../../api/owner-report-api";

interface ReportDetailViewProps {
  report: OwnerReportView;
}

export function ReportDetailView({ report: initialReport }: ReportDetailViewProps) {
  const [report, setReport] = useState(initialReport);
  const [activeTab, setActiveTab] = useState("overview");
  const [mediaPollAttempt, setMediaPollAttempt] = useState(0);

  // Dialog states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState<"hide" | "close" | null>(null);

  useEffect(() => {
    if (report.pendingMediaCount === 0 || mediaPollAttempt >= 12) return;

    const timeout = window.setTimeout(async () => {
      try {
        const refreshed = await getAuthenticatedOwnerReportView(report.id);
        setReport(refreshed);
      } catch {
        // Keep the last authoritative snapshot
      } finally {
        setMediaPollAttempt((attempt) => attempt + 1);
      }
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [mediaPollAttempt, report.id, report.pendingMediaCount]);

  const handleConfirmAction = async (reason: string) => {
    try {
      if (dialogAction === "close") {
        await closeOwnReport(report.id, 1, reason);
        toast.success("Đã đóng báo cáo thành công");
      } else if (dialogAction === "hide") {
        await withdrawOwnReport(report.id, 1, reason);
        toast.success("Đã tạm ẩn báo cáo thành công");
      }
      const refreshed = await getAuthenticatedOwnerReportView(report.id);
      setReport(refreshed);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Không thể thực hiện thao tác");
    } finally {
      setDialogAction(null);
    }
  };

  return (
    <div className="w-full space-y-6 text-left">
      {/* Hero Header Component */}
      <ReportDetailHeroHeader
        report={report}
        onSelectTab={setActiveTab}
        onOpenCloseDialog={() => setDialogAction("close")}
        onOpenHideDialog={() => setDialogAction("hide")}
        onOpenShareDialog={() => setIsShareModalOpen(true)}
      />

      {/* Tabs Navigation (Transparent, clean underline tabs matching Image 1) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5 w-full">
        <div className="border-b border-slate-200 overflow-x-auto pb-0">
          <div className="flex items-center gap-6 sm:gap-8 min-w-max">
            {/* Tab 1: Tổng quan */}
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 pb-3.5 pt-1 text-xs sm:text-sm transition-all cursor-pointer border-b-2 font-medium ${
                activeTab === "overview"
                  ? "border-[#4A0E2E] text-[#4A0E2E] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>

            {/* Tab 2: Thuộc tính công khai */}
            <button
              type="button"
              onClick={() => setActiveTab("public-attributes")}
              className={`flex items-center gap-2 pb-3.5 pt-1 text-xs sm:text-sm transition-all cursor-pointer border-b-2 font-medium ${
                activeTab === "public-attributes"
                  ? "border-[#4A0E2E] text-[#4A0E2E] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Thuộc tính công khai</span>
            </button>

            {/* Tab 3: Xác minh riêng tư */}
            <button
              type="button"
              onClick={() => setActiveTab("private-verification")}
              className={`flex items-center gap-2 pb-3.5 pt-1 text-xs sm:text-sm transition-all cursor-pointer border-b-2 font-medium ${
                activeTab === "private-verification"
                  ? "border-[#4A0E2E] text-[#4A0E2E] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Xác minh riêng tư</span>
            </button>

            {/* Tab 4: Kết quả khớp */}
            <button
              type="button"
              onClick={() => setActiveTab("matches")}
              className={`flex items-center gap-2 pb-3.5 pt-1 text-xs sm:text-sm transition-all cursor-pointer border-b-2 font-medium ${
                activeTab === "matches"
                  ? "border-[#4A0E2E] text-[#4A0E2E] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kết quả khớp</span>
            </button>

            {/* Tab 5: Lịch sử hoạt động */}
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 pb-3.5 pt-1 text-xs sm:text-sm transition-all cursor-pointer border-b-2 font-medium ${
                activeTab === "history"
                  ? "border-[#4A0E2E] text-[#4A0E2E] font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Lịch sử hoạt động</span>
            </button>
          </div>
        </div>

        {/* Tab 1 Content */}
        <TabsContent value="overview">
          <OverviewTab report={report} onSelectTab={setActiveTab} />
        </TabsContent>

        {/* Tab 2 Content */}
        <TabsContent value="public-attributes">
          <PublicAttributesTab report={report} />
        </TabsContent>

        {/* Tab 3 Content */}
        <TabsContent value="private-verification">
          <PrivateVerificationTab report={report} />
        </TabsContent>

        {/* Tab 4 Content */}
        <TabsContent value="matches">
          <MatchCandidatesTab report={report} />
        </TabsContent>

        {/* Tab 5 Content */}
        <TabsContent value="history">
          <ActivityHistoryTab report={report} />
        </TabsContent>
      </Tabs>

      {/* Modals & Dialogs */}
      {dialogAction && (
        <CloseReportDialog
          open={Boolean(dialogAction)}
          onOpenChange={(open) => !open && setDialogAction(null)}
          reportTitle={report.title}
          actionType={dialogAction}
          onConfirm={handleConfirmAction}
        />
      )}

      <ShareReportDialog
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        reportCode={report.code}
        reportTitle={report.title}
      />
    </div>
  );
}
