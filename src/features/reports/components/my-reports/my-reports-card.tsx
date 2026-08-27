"use client";

import Link from "next/link";
import Image from "next/image";
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
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileEdit,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { OwnerItemDeclarationDto } from "./types";
import { StatusBadge, formatDate } from "./my-reports-table";

interface MyReportsCardProps {
  report: OwnerItemDeclarationDto;
  onCloseReport?: (report: OwnerItemDeclarationDto) => void;
  onWithdrawReport?: (report: OwnerItemDeclarationDto) => void;
  onDeleteDraft?: (report: OwnerItemDeclarationDto) => void;
}

export function MyReportsCard({
  report,
  onCloseReport,
  onWithdrawReport,
  onDeleteDraft,
}: MyReportsCardProps) {
  const isLost = report.type === "LOST";
  const isDraft = report.isDraft || report.workflowStatus === "DRAFT";
  const targetUrl = isDraft
    ? report.editUrl || (isLost ? "/reports/create/lost" : "/reports/create/found")
    : `/reports/${report.id}`;
  const displayImage = report.media?.[0]?.url;
  const displayTitle =
    report.title ||
    (isLost ? "Đồ thất lạc chưa đặt tên" : "Đồ nhặt được chưa đặt tên");
  const location = report.publicAreaLabel || "Không rõ khu vực";

  return (
    <Card className="p-4 hover:border-brand-plum/30 transition-all space-y-3.5">
      {/* Top: Thumbnail, Title, Type, Dropdown */}
      <div className="flex items-start gap-3">
        <div className="relative h-14 w-14 rounded-xl bg-brand-cream/80 border border-brand-border/80 overflow-hidden shrink-0 flex items-center justify-center">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={displayTitle}
              fill
              className="object-cover"
            />
          ) : (
            <Package className="h-6 w-6 text-brand-muted/70" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {isLost ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#FFF4F1] text-brand-lost border border-[#FFC7BA]/50">
                <AlertCircle className="h-3 w-3 shrink-0" />
                Thất lạc
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#F3F9F1] text-brand-found border border-[#D4E8CE]/50">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                Nhặt được
              </span>
            )}
            <StatusBadge workflowStatus={report.workflowStatus} isLost={isLost} />
          </div>

          <Link
            href={targetUrl}
            className="font-bold text-brand-heading hover:text-brand-plum transition-colors line-clamp-1 block text-sm mt-1.5"
          >
            {displayTitle}
          </Link>
        </div>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-lg border border-brand-border bg-white flex items-center justify-center text-brand-muted hover:text-brand-plum hover:bg-brand-cream/60 transition-all cursor-pointer shrink-0">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="right">
            {isDraft ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href={targetUrl} className="flex items-center gap-2 font-medium">
                    <FileEdit className="h-3.5 w-3.5 text-brand-plum" />
                    Tiếp tục sửa bản nháp
                  </Link>
                </DropdownMenuItem>
                {onDeleteDraft && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteDraft(report)}
                      className="text-red-600 hover:bg-red-50 font-medium"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      Xóa bản nháp
                    </DropdownMenuItem>
                  </>
                )}
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/reports/${report.id}`} className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-brand-muted" />
                    Xem chi tiết
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/reports/${report.id}?tab=matches`} className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    Xem ứng viên trùng khớp
                  </Link>
                </DropdownMenuItem>

                {report.workflowStatus === "ACTIVE" && (
                  <>
                    <DropdownMenuSeparator />
                    {onCloseReport && (
                      <DropdownMenuItem
                        onClick={() => onCloseReport(report)}
                        className="text-amber-700 hover:bg-amber-50"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                        Đóng báo cáo
                      </DropdownMenuItem>
                    )}
                    {onWithdrawReport && (
                      <DropdownMenuItem
                        onClick={() => onWithdrawReport(report)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-3.5 w-3.5 text-red-500" />
                        Rút báo cáo
                      </DropdownMenuItem>
                    )}
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Middle info: Location & Date */}
      <div className="flex items-center justify-between text-xs text-brand-muted border-t border-brand-border/60 pt-2.5 font-medium">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-brand-muted/70 shrink-0" />
          <span className="truncate max-w-[140px]">{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5 text-brand-muted/70 shrink-0" />
          <span>{formatDate(report.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
}
