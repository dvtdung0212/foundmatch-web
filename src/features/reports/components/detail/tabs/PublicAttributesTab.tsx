"use client";

import { Check, ShieldCheck } from "lucide-react";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface PublicAttributesTabProps {
  report: OwnerReportView;
}

export function PublicAttributesTab({ report }: PublicAttributesTabProps) {
  const isLost = report.type === "lost";

  // Standardized key-value list matching mockup
  const attributesList = [
    { key: "Danh mục", value: report.category },
    { key: "Tình trạng", value: "Đã qua sử dụng" },
    { key: "Màu sắc", value: "Đen" },
    { key: "Khu vực", value: report.location },
    { key: "Thương hiệu", value: "Pedro" },
    { key: isLost ? "Ngày bị mất" : "Ngày nhặt được", value: report.time },
    { key: "Chất liệu", value: "Da" },
    { key: isLost ? "Địa điểm bị mất" : "Địa điểm nhặt được", value: report.location },
    { key: "Kích thước", value: "11 x 8 x 2 cm" },
    { key: "Mã công khai", value: report.code },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column (8 cols): Structured Public Attributes & Full Description */}
      <div className="lg:col-span-8 space-y-6 text-left">
        <div className="rounded-2xl border border-brand-border/80 bg-white p-6 shadow-2xs space-y-5">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900">Thuộc tính công khai</h2>
            <p className="text-[13px] text-slate-500 mt-1">
              Những thông tin này có thể được hiển thị công khai để giúp kết nối với người nhặt/chủ sở hữu.
            </p>
          </div>

          {/* Key-Value Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-sm">
            {/* Grid 2 rows side-by-side on tablet/desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
              <div className="p-3.5 flex justify-between gap-2 bg-slate-50/50">
                <span className="text-brand-muted font-medium">Danh mục</span>
                <span className="font-bold text-brand-heading text-right">{report.category}</span>
              </div>
              <div className="p-3.5 flex justify-between gap-2">
                <span className="text-brand-muted font-medium">Tình trạng</span>
                <span className="font-semibold text-brand-heading text-right">Đã qua sử dụng</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
              <div className="p-3.5 flex justify-between gap-2 bg-slate-50/50">
                <span className="text-brand-muted font-medium">Màu sắc</span>
                <span className="font-semibold text-brand-heading text-right">Đen</span>
              </div>
              <div className="p-3.5 flex justify-between gap-2">
                <span className="text-brand-muted font-medium">Khu vực</span>
                <span className="font-semibold text-brand-heading text-right">{report.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
              <div className="p-3.5 flex justify-between gap-2 bg-slate-50/50">
                <span className="text-brand-muted font-medium">Thương hiệu</span>
                <span className="font-semibold text-brand-heading text-right">Pedro</span>
              </div>
              <div className="p-3.5 flex justify-between gap-2">
                <span className="text-brand-muted font-medium">{isLost ? "Ngày bị mất" : "Ngày nhặt được"}</span>
                <span className="font-semibold text-brand-heading text-right">{report.time}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
              <div className="p-3.5 flex justify-between gap-2 bg-slate-50/50">
                <span className="text-brand-muted font-medium">Chất liệu</span>
                <span className="font-semibold text-brand-heading text-right">Da bò</span>
              </div>
              <div className="p-3.5 flex justify-between gap-2">
                <span className="text-brand-muted font-medium">{isLost ? "Địa điểm mất" : "Địa điểm nhặt"}</span>
                <span className="font-semibold text-brand-heading text-right">{report.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
              <div className="p-3.5 flex justify-between gap-2 bg-slate-50/50">
                <span className="text-brand-muted font-medium">Kích thước</span>
                <span className="font-semibold text-brand-heading text-right">11 x 8 x 2 cm</span>
              </div>
              <div className="p-3.5 flex justify-between gap-2">
                <span className="text-brand-muted font-medium">Mã báo cáo</span>
                <span className="font-mono font-bold text-brand-plum text-right">{report.code}</span>
              </div>
            </div>
          </div>

          {/* Full Public Description */}
          <div className="space-y-2 pt-2">
            <h3 className="font-bold text-sm text-brand-heading">Mô tả công khai</h3>
            <div className="p-4 rounded-xl bg-slate-50/80 border border-brand-border/60 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
              {report.description || "Chưa có mô tả công khai nào được thêm."}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (4 cols): Safety Rules & Guidance */}
      <div className="lg:col-span-4 space-y-4 text-left">
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-sm">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <span>Quy tắc hiển thị thông tin</span>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Các thuộc tính trên là thông tin công khai, được hiển thị cho cộng đồng để tăng khả năng tìm lại đồ thất lạc.
          </p>

          <ul className="space-y-2.5 text-xs text-emerald-900 pt-1">
            <li className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Không chứa thông tin liên hệ cá nhân nhạy cảm</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Tập trung vào đặc điểm nhận dạng tổng quát của đồ vật</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>Hỗ trợ thuật toán gợi ý ghép đôi chính xác và an toàn</span>
            </li>
          </ul>

          <div className="pt-2 border-t border-emerald-200/60">
            <a
              href="#privacy-policy"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1"
            >
              Tìm hiểu thêm về quy tắc hiển thị →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
