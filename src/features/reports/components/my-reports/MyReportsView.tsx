"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Plus, RefreshCw, AlertCircle, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination } from "@/components/ui/pagination";
import { MyReportsTable } from "./my-reports-table";
import { MyReportsCard } from "./my-reports-card";
import { CloseReportDialog } from "../modals/CloseReportDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  listOwnReports,
  closeOwnReport,
  withdrawOwnReport,
} from "../../api/owner-report-api";
import type { OwnerItemDeclarationDto } from "./types";

export function MyReportsView() {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortOrder, setSortOrder] = useState<string>("NEWEST");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<OwnerItemDeclarationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Counts for tabs
  const [counts, setCounts] = useState({
    all: 0,
    lost: 0,
    found: 0,
  });

  // Action Modals State
  const [selectedReport, setSelectedReport] = useState<OwnerItemDeclarationDto | null>(null);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch reports
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const typeParam = activeTab === "ALL" ? undefined : activeTab;
      const statusParam = statusFilter === "ALL" ? undefined : statusFilter;

      const data = await listOwnReports({
        page,
        pageSize,
        type: typeParam,
        workflowStatus: statusParam,
        search: searchQuery ? searchQuery.trim() : undefined,
      });

      const items = (data?.items || []) as OwnerItemDeclarationDto[];
      const total = data?.total ?? items.length;

      setReports(items);
      setTotalCount(total);

      // Also fetch tab counts if on page 1 of "ALL"
      if (activeTab === "ALL" && !statusParam && !searchQuery) {
        const lostCount = items.filter((item) => item.type === "LOST").length;
        const foundCount = items.filter((item) => item.type === "FOUND").length;
        setCounts({
          all: total,
          lost: lostCount,
          found: foundCount,
        });
      }
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setError(errObj?.message || "Không thể tải danh sách báo cáo. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, searchQuery, page, pageSize]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Client-side sort if needed
  const sortedReports = useMemo(() => {
    return [...reports].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "NEWEST" ? dateB - dateA : dateA - dateB;
    });
  }, [reports, sortOrder]);

  // Handle Tab change
  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setPage(1);
  };

  // Handle Close report action
  const handleCloseReport = async (reason: string) => {
    if (!selectedReport) return;
    try {
      setActionLoading(true);
      await closeOwnReport(selectedReport.id, selectedReport.version, reason);
      setIsCloseModalOpen(false);
      setSelectedReport(null);
      await fetchReports();
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      alert(errObj?.message || "Không thể đóng báo cáo. Vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Withdraw report action
  const handleWithdrawReport = async () => {
    if (!selectedReport) return;
    try {
      setActionLoading(true);
      await withdrawOwnReport(
        selectedReport.id,
        selectedReport.version,
        "Người dùng chủ động rút báo cáo"
      );
      setIsWithdrawModalOpen(false);
      setSelectedReport(null);
      await fetchReports();
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      alert(errObj?.message || "Không thể rút báo cáo. Vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-heading tracking-tight">
            Báo cáo của tôi
          </h1>
          <p className="text-xs sm:text-sm font-medium text-brand-muted mt-1">
            Quản lý và theo dõi tất cả các báo cáo bạn đã tạo.
          </p>
        </div>

        {/* Create Button (Mobile-top / Desktop-inline) */}
        <Link href="/reports/create" className="sm:hidden block">
          <Button
            variant="primary"
            className="w-full bg-brand-plum hover:bg-brand-dark text-white rounded-xl shadow-xs py-2.5 font-bold flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> Tạo báo cáo mới
          </Button>
        </Link>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 pt-2">
        {/* Left: Category Tabs */}
        <div className="overflow-x-auto hide-scrollbar pb-1">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="p-0 gap-2">
              <TabsTrigger value="ALL" badge={counts.all > 0 ? counts.all : undefined}>
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="LOST" badge={counts.lost > 0 ? counts.lost : undefined}>
                Thất lạc
              </TabsTrigger>
              <TabsTrigger value="FOUND" badge={counts.found > 0 ? counts.found : undefined}>
                Nhặt được
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right: Dropdowns + Create button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs sm:text-[13px] font-bold text-brand-heading focus:outline-none focus:border-brand-plum shadow-2xs cursor-pointer"
            >
              <option value="ALL">Trạng thái: Tất cả</option>
              <option value="ACTIVE">Đang tìm kiếm / Chờ xác minh</option>
              <option value="RESOLVED">Đã tìm thấy / Đã trả lại</option>
              <option value="SUBMITTED">Đã gửi</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="CLOSED">Đã đóng</option>
              <option value="WITHDRAWN">Đã rút</option>
            </select>
          </div>

          {/* Sort Order Dropdown */}
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-10 rounded-xl border border-brand-border bg-white px-3.5 py-2 text-xs sm:text-[13px] font-bold text-brand-heading focus:outline-none focus:border-brand-plum shadow-2xs cursor-pointer"
            >
              <option value="NEWEST">Thời gian: Mới nhất</option>
              <option value="OLDEST">Thời gian: Cũ nhất</option>
            </select>
          </div>

          {/* Desktop Create Button */}
          <Link href="/reports/create" className="hidden sm:inline-block">
            <Button
              variant="primary"
              className="h-10 bg-brand-plum hover:bg-brand-dark text-white rounded-xl shadow-xs px-4 font-bold flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Tạo báo cáo mới
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {loading ? (
          /* Loading Skeleton */
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-xs space-y-4 animate-pulse">
            <div className="h-6 bg-brand-cream/80 rounded-md w-1/4" />
            <div className="space-y-3 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-brand-cream/50 rounded-xl w-full" />
              ))}
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="bg-white rounded-2xl border border-brand-border p-8 text-center space-y-4 shadow-xs">
            <div className="h-12 w-12 rounded-full bg-red-50 text-brand-lost flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-heading">Có lỗi xảy ra</h3>
              <p className="text-xs text-brand-muted mt-1 max-w-sm mx-auto">{error}</p>
            </div>
            <Button
              variant="outline"
              onClick={fetchReports}
              className="inline-flex items-center gap-2 rounded-xl text-xs font-bold"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Thử lại
            </Button>
          </div>
        ) : sortedReports.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center space-y-4 shadow-xs">
            <div className="h-16 w-16 rounded-full bg-brand-cream flex items-center justify-center text-brand-muted mx-auto">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-brand-heading">
                Chưa có báo cáo nào
              </h3>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-sm mx-auto">
                {activeTab === "ALL"
                  ? "Bạn chưa tạo báo cáo thất lạc hoặc nhặt được nào. Hãy tạo báo cáo để bắt đầu tìm kiếm hoặc hỗ trợ người khác."
                  : activeTab === "LOST"
                  ? "Bạn chưa có báo cáo đồ thất lạc nào."
                  : "Bạn chưa có báo cáo đồ nhặt được nào."}
              </p>
            </div>
            <Link href="/reports/create" className="inline-block pt-2">
              <Button
                variant="primary"
                className="bg-brand-plum hover:bg-brand-dark text-white rounded-xl shadow-xs px-5 py-2.5 font-bold flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Tạo báo cáo ngay
              </Button>
            </Link>
          </div>
        ) : (
          /* Report List */
          <div className="space-y-4">
            {/* Desktop Table View (>= 1024px) */}
            <div className="hidden lg:block">
              <MyReportsTable
                reports={sortedReports}
                onCloseReport={(report) => {
                  setSelectedReport(report);
                  setIsCloseModalOpen(true);
                }}
                onWithdrawReport={(report) => {
                  setSelectedReport(report);
                  setIsWithdrawModalOpen(true);
                }}
              />
            </div>

            {/* Mobile / Tablet Card View (< 1024px) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 lg:hidden">
              {sortedReports.map((report) => (
                <MyReportsCard
                  key={report.id}
                  report={report}
                  onCloseReport={(rep) => {
                    setSelectedReport(rep);
                    setIsCloseModalOpen(true);
                  }}
                  onWithdrawReport={(rep) => {
                    setSelectedReport(rep);
                    setIsWithdrawModalOpen(true);
                  }}
                />
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="bg-white rounded-2xl border border-brand-border px-4 shadow-xs">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalCount}
                pageSize={pageSize}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Modals */}
      {selectedReport && (
        <>
          <CloseReportDialog
            open={isCloseModalOpen}
            onOpenChange={setIsCloseModalOpen}
            reportTitle={selectedReport.title || "báo cáo này"}
            actionType="close"
            onConfirm={handleCloseReport}
          />

          <ConfirmDialog
            open={isWithdrawModalOpen}
            onOpenChange={setIsWithdrawModalOpen}
            title="Rút báo cáo"
            description={`Bạn có chắc muốn rút báo cáo "${
              selectedReport.title || "này"
            }"? Hành động này sẽ dừng tìm kiếm và rút báo cáo khỏi hệ thống.`}
            confirmText="Rút báo cáo"
            cancelText="Hủy"
            variant="danger"
            loading={actionLoading}
            onConfirm={handleWithdrawReport}
          />
        </>
      )}
    </div>
  );
}
