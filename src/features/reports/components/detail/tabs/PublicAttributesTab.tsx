"use client";

import { Check, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface PublicAttributesTabProps {
  report: OwnerReportView;
}

export function PublicAttributesTab({ report }: PublicAttributesTabProps) {
  const isLost = report.type === "lost";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column (8 cols): Structured Public Attributes & Full Description */}
      <div className="lg:col-span-8 space-y-6 text-left">
        <Card className="p-6 space-y-5">
          <div>
            <CardTitle className="text-[17px]">Thuộc tính công khai</CardTitle>
            <CardDescription className="mt-1">
              Những thông tin này có thể được hiển thị công khai để giúp kết nối với người nhặt/chủ sở hữu.
            </CardDescription>
          </div>

          {/* Key-Value Table */}
          <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-sm">
            {/* Row 1 */}
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

            {/* Row 2 */}
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

            {/* Row 3: Ngày rõ ràng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
              <div className="p-3.5 flex justify-between gap-2 bg-slate-50/50">
                <span className="text-brand-muted font-medium">Thương hiệu</span>
                <span className="font-semibold text-brand-heading text-right">Pedro</span>
              </div>
              <div className="p-3.5 flex justify-between gap-2">
                <span className="text-brand-muted font-medium">{isLost ? "Ngày bị mất" : "Ngày nhặt được"}</span>
                <span className="font-semibold text-brand-heading text-right">{report.eventDate || "Chưa xác định"}</span>
              </div>
            </div>

            {/* Row 4: Khung giờ gộp gọn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-brand-border/40">
              <div className="p-3.5 flex justify-between gap-2 bg-slate-50/50">
                <span className="text-brand-muted font-medium">Chất liệu</span>
                <span className="font-semibold text-brand-heading text-right">Da bò</span>
              </div>
              <div className="p-3.5 flex justify-between gap-2">
                <span className="text-brand-muted font-medium">Khoảng thời gian</span>
                <span className="font-semibold text-brand-heading text-right">{report.eventTimeRange || "Cả ngày"}</span>
              </div>
            </div>

            {/* Row 5 */}
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
        </Card>
      </div>

      {/* Right Column (4 cols): Safety Rules & Guidance */}
      <div className="lg:col-span-4 space-y-4 text-left">
        <Card variant="highlight" className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-sm">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <span>Quy tắc hiển thị thông tin</span>
          </div>

          <p className="text-xs text-emerald-900 leading-relaxed">
            Các thuộc tính trên là thông tin công khai, được hiển thị cho cộng đồng để tăng khả năng tìm lại đồ thất lạc.
          </p>

          <ul className="space-y-2 text-xs text-emerald-950/90 pt-1">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                ✓
              </span>
              <span>Không hiển thị số điện thoại hay địa chỉ chính xác của bạn.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                ✓
              </span>
              <span>Các đặc điểm nhận dạng bí mật chỉ dùng để đối soát quyền sở hữu.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-200/80 text-emerald-800 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                ✓
              </span>
              <span>Bạn có thể chỉnh sửa hoặc ẩn thông tin bất kỳ lúc nào.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
