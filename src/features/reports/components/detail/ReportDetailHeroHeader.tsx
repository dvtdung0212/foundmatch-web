"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Check,
  Clock,
  Copy,
  Edit,
  Eye,
  FileText,
  Folder,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import type { OwnerReportView } from "../../api/owner-report-view";

interface ReportDetailHeroHeaderProps {
  report: OwnerReportView;
  onSelectTab: (tab: string) => void;
  onOpenCloseDialog: () => void;
  onOpenHideDialog: () => void;
  onOpenShareDialog: () => void;
}

export function ReportDetailHeroHeader({
  report,
  onSelectTab,
  onOpenCloseDialog,
  onOpenHideDialog,
  onOpenShareDialog,
}: ReportDetailHeroHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const fallbackImages = [
    "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=600",
  ];

  const images = report.images.length > 0 ? report.images : fallbackImages;
  const isLost = report.type === "lost";

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(report.code);
      setCopied(true);
      toast.success("Đã sao chép mã báo cáo");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <div className="space-y-4 text-left w-full">
      {/* Breadcrumb & Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
            <Link href="/" className="hover:text-brand-plum transition-colors">
              Trang chủ
            </Link>
            <span className="text-slate-400">›</span>
            <Link href="/reports" className="hover:text-brand-plum transition-colors">
              Báo cáo của tôi
            </Link>
            <span className="text-slate-400">›</span>
            <span className="text-slate-900 font-semibold">Chi tiết báo cáo</span>
          </nav>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
            Chi tiết báo cáo
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem và quản lý thông tin chi tiết của báo cáo.
          </p>
        </div>

        {/* Top Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/reports/create?edit=${report.id}`}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>Chỉnh sửa</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={onOpenHideDialog}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>Tạm ẩn</span>
          </button>

          <button
            type="button"
            onClick={onOpenCloseDialog}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            <span>Đóng báo cáo</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTab("matches")}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4A0E2E] hover:bg-[#3B0B24] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Xem kết quả khớp</span>
          </button>
        </div>
      </div>

      {/* 2-Column Hero Layout: Gallery (Left) | Main Info & Status (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full">
        {/* Column 1: Gallery (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          {/* Main Image */}
          <div className="relative w-full h-[210px] sm:h-[235px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={report.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 left-2.5">
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs ${isLost
                  ? "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]"
                  : "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]"
                  }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {isLost ? "Thất lạc" : "Nhặt được"}
              </span>
            </div>
          </div>

          {/* Thumbnails Row (Full width) */}
          <div className="grid grid-cols-3 gap-2.5 mt-3 w-full">
            {images.slice(0, 3).map((imgUrl, idx) => {
              const isThirdAndMore = idx === 2 && images.length > 3;
              const remainingCount = images.length - 3;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-[60px] sm:h-[65px] w-full rounded-lg overflow-hidden border transition-all cursor-pointer ${selectedImageIndex === idx
                    ? "border-[#4A0E2E] ring-2 ring-[#4A0E2E]/20"
                    : "border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100"
                    }`}
                >
                  <img src={imgUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  {isThirdAndMore && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                      +{remainingCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: Thông tin chính & Trạng thái (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs flex flex-col justify-between space-y-4">
          {/* Header Row: Title & Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">
              Thông tin chính
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] font-bold text-xs shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#D97706]" />
              <span>Đang tìm kiếm</span>
            </div>
          </div>

          {/* 2-Column Key Attributes Grid */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 py-1 text-xs">
            {/* Row 1 */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-2">
              <dt className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Tên đồ vật</span>
              </dt>
              <dd className="font-bold text-slate-900 text-right truncate max-w-[160px]">
                {report.title || "Ví da màu đen"}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-2">
              <dt className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Khu vực</span>
              </dt>
              <dd className="font-semibold text-slate-900 text-right truncate max-w-[160px]">
                {report.location || "Quận 1, TP. HCM"}
              </dd>
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-2">
              <dt className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Mã báo cáo</span>
              </dt>
              <dd className="font-mono font-bold text-slate-900 flex items-center gap-1">
                <span>{report.code || "FM-2024-1024"}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title="Sao chép mã"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </dd>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-slate-100/80 pb-2">
              <dt className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày tạo</span>
              </dt>
              <dd className="font-normal text-slate-700 text-right">20/05/2024 10:30</dd>
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-between gap-2 pb-1">
              <dt className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                <span>Danh mục</span>
              </dt>
              <dd className="font-semibold text-slate-900 text-right">{report.category || "Ví / Bóp"}</dd>
            </div>

            <div className="flex items-center justify-between gap-2 pb-1">
              <dt className="text-slate-500 font-medium flex items-center gap-2 shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Cập nhật cuối</span>
              </dt>
              <dd className="font-normal text-slate-700 text-right">22/05/2024 09:15</dd>
            </div>
          </dl>

          {/* Merged Status & Security Footer Banner */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#14532D]">Thông tin của bạn được bảo mật</p>
                <p className="text-[11px] text-[#166534] leading-tight">
                  Chỉ bên liên quan được xác minh mới có thể xem thông tin liên hệ.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab("private-verification")}
              className="text-[11px] font-bold text-[#166534] hover:underline whitespace-nowrap cursor-pointer pl-9 sm:pl-0"
            >
              Tìm hiểu thêm →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
