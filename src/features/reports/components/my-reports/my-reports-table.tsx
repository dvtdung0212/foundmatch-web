"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  MapPin,
  Package,
  Sparkles,
  Lock,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import type { OwnerItemDeclarationDto } from "./types";

interface MyReportsTableProps {
  reports: OwnerItemDeclarationDto[];
  isLoading?: boolean;
  onCloseReport?: (report: OwnerItemDeclarationDto) => void;
  onWithdrawReport?: (report: OwnerItemDeclarationDto) => void;
  page?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export function MyReportsTable({
  reports,
  isLoading,
  onCloseReport,
  onWithdrawReport,
  page,
  total,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: MyReportsTableProps) {
  const columns = useMemo<DataTableColumn<OwnerItemDeclarationDto>[]>(
    () => [
      {
        key: "item",
        header: "Vật phẩm",
        className: "w-[34%]",
        align: "left",
        cell: (item) => {
          const isLost = item.type === "LOST";
          const displayImage = item.media?.[0]?.url;
          const displayTitle =
            item.title || (isLost ? "Đồ thất lạc chưa đặt tên" : "Đồ nhặt được chưa đặt tên");
          const location = item.publicAreaLabel || "Không rõ khu vực";

          return (
            <div className="flex items-center gap-3.5">
              <div className="relative h-12 w-12 rounded-xl bg-brand-cream/80 border border-brand-border/80 overflow-hidden shrink-0 flex items-center justify-center">
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={displayTitle}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Package className="h-5 w-5 text-brand-muted/70" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/reports/${item.id}`}
                  className="font-bold text-brand-heading hover:text-brand-plum transition-colors line-clamp-1 block text-sm"
                >
                  {displayTitle}
                </Link>
                <div className="flex items-center gap-1 text-xs text-brand-muted mt-1 font-medium">
                  <MapPin className="h-3 w-3 shrink-0 text-brand-muted/70" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
            </div>
          );
        },
      },
      {
        key: "type",
        header: "Loại báo cáo",
        className: "w-[14%]",
        cell: (item) => {
          const isLost = item.type === "LOST";
          return isLost ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FFF4F1] text-brand-lost border border-[#FFC7BA]/50">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Thất lạc
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F3F9F1] text-brand-found border border-[#D4E8CE]/50">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              Nhặt được
            </span>
          );
        },
      },
      {
        key: "status",
        header: "Trạng thái",
        className: "w-[16%]",
        cell: (item) => (
          <StatusBadge
            workflowStatus={item.workflowStatus}
            isLost={item.type === "LOST"}
          />
        ),
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        className: "w-[14%] text-xs text-brand-muted font-medium",
        cell: (item) => formatDate(item.createdAt),
      },
      {
        key: "updatedAt",
        header: "Cập nhật cuối",
        className: "w-[14%] text-xs text-brand-muted font-medium",
        cell: (item) => formatDate(item.updatedAt),
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "center",
        className: "w-[8%] text-center",
        cell: (item) => (
          <div
            className="flex items-center justify-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quick View Button */}
            <Link
              href={`/reports/${item.id}`}
              className="h-8 w-8 rounded-lg border border-brand-border bg-white flex items-center justify-center text-brand-muted hover:text-brand-plum hover:border-brand-plum/40 hover:bg-brand-cream/60 transition-all shadow-2xs"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </Link>

            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 rounded-lg border border-brand-border bg-white flex items-center justify-center text-brand-muted hover:text-brand-plum hover:border-brand-plum/40 hover:bg-brand-cream/60 transition-all shadow-2xs cursor-pointer">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="right">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/reports/${item.id}`}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-3.5 w-3.5 text-brand-muted" />
                    Xem chi tiết
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/reports/${item.id}?tab=matches`}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Xem ứng viên trùng khớp
                  </Link>
                </DropdownMenuItem>

                {item.workflowStatus === "ACTIVE" && (
                  <>
                    <DropdownMenuSeparator />
                    {onCloseReport && (
                      <DropdownMenuItem
                        onClick={() => onCloseReport(item)}
                        className="text-amber-700 hover:bg-amber-50"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                        Đóng báo cáo
                      </DropdownMenuItem>
                    )}
                    {onWithdrawReport && (
                      <DropdownMenuItem
                        onClick={() => onWithdrawReport(item)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                        Rút báo cáo
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [onCloseReport, onWithdrawReport]
  );

  return (
    <DataTable<OwnerItemDeclarationDto>
      data={reports}
      columns={columns}
      isLoading={isLoading}
      rowKey={(row) => row.id}
      page={page}
      total={total}
      totalPages={totalPages}
      onPageChange={onPageChange}
      pageSize={pageSize}
      onPageSizeChange={onPageSizeChange}
      emptyState="Không có báo cáo nào."
    />
  );
}

export function StatusBadge({
  workflowStatus,
  isLost,
}: {
  workflowStatus: string;
  isLost: boolean;
}) {
  switch (workflowStatus) {
    case "ACTIVE":
      return isLost ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock className="h-3 w-3 text-amber-600" />
          Đang tìm kiếm
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
          <Clock className="h-3 w-3 text-purple-600" />
          Chờ xác minh
        </span>
      );

    case "RESOLVED":
      return isLost ? (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
          Đã tìm thấy
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
          <RotateCcw className="h-3 w-3 text-blue-600" />
          Đã trả lại
        </span>
      );

    case "SUBMITTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="h-3 w-3" />
          Đã gửi
        </span>
      );

    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          Bản nháp
        </span>
      );

    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          <Lock className="h-3 w-3 text-gray-500" />
          Đã đóng
        </span>
      );

    case "WITHDRAWN":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          <XCircle className="h-3 w-3 text-gray-500" />
          Đã rút
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
          {workflowStatus}
        </span>
      );
  }
}

export function formatDate(dateString?: string | Date | null): string {
  if (!dateString) return "---";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "---";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
