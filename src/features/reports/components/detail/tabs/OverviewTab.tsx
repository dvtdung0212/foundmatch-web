"use client";

import {
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Lock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface OverviewTabProps {
  report: OwnerReportView;
  onSelectTab: (tab: string) => void;
}

export function OverviewTab({ report, onSelectTab }: OverviewTabProps) {
  const handleOpenMap = () => {
    const query = encodeURIComponent(`${report.location || "Phố đi bộ Nguyễn Huệ, Quận 1, TP. HCM"}, Việt Nam`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  const defaultBullets = [
    "Ví da bò màu đen, dáng ngang",
    "Logo dập chìm góc dưới bên phải",
    "Bên trong có 6 ngăn thẻ, 2 ngăn lớn",
    "Có khóa kéo ngăn phụ bên trong",
  ];

  return (
    <div className="space-y-5 text-left w-full">
      {/* Top 3 Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Mô tả ngắn */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 flex flex-col justify-between shadow-2xs">
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900">
              Mô tả ngắn
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {report.description && report.description !== "Chưa có mô tả."
                ? report.description
                : "Ví da màu đen, dáng ngang, chất liệu da bò. Bên trong có nhiều ngăn đựng thẻ và 2 ngăn lớn đựng tiền, mặt ngoài có logo dập chìm ở góc dưới bên phải."}
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => onSelectTab("public-attributes")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Xem chi tiết mô tả</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Card 2: Điểm nổi bật */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">
            Điểm nổi bật
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-700">
            {defaultBullets.map((text, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 3: Thời gian & Địa điểm */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">
            Thời gian & Địa điểm
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div className="space-y-2 text-xs text-slate-600">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.type === "lost" ? "Ngày bị mất" : "Ngày nhặt được"}</span>
                </div>
                <p className="font-semibold text-slate-800 pl-5">{report.eventDate || "18/05/2024"}</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Khoảng thời gian</span>
                </div>
                <p className="font-semibold text-slate-800 pl-5">{report.eventTimeRange || "Cả ngày"}</p>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Địa điểm</span>
                </div>
                <p className="font-semibold text-slate-800 pl-5">{report.location || "Phố đi bộ Nguyễn Huệ, Quận 1, TP. HCM"}</p>
              </div>
            </div>

            {/* Map Mini Preview */}
            <div className="relative w-full h-[120px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-2">
              <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:10px_10px] opacity-60" />
              <div className="w-8 h-8 rounded-full bg-[#4A0E2E] text-white flex items-center justify-center shadow-md relative z-10 mb-1">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
              <button
                type="button"
                onClick={handleOpenMap}
                className="relative z-10 w-full py-1 px-2 rounded-md bg-white/95 text-slate-800 text-[10px] font-bold shadow-2xs border border-slate-200 flex items-center justify-center gap-1 hover:bg-white transition-colors cursor-pointer"
              >
                <span>Xem trên bản đồ</span>
                <ExternalLink className="w-2.5 h-2.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2 Cards Row: Private Verification + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left (5 cols): Xác minh riêng tư */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3 flex flex-col justify-between shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                Xác minh riêng tư
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Để bảo vệ quyền riêng tư, chúng tôi chỉ chia sẻ thông tin nhạy cảm khi có kết quả khớp tiềm năng.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Đã cung cấp thông tin xác minh
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Thông tin chi tiết sẽ được chia sẻ khi cần thiết.
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => onSelectTab("private-verification")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#4A0E2E] hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Xem chi tiết</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right (7 cols): Thống kê nhanh */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-5 space-y-3.5 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">
            Thống kê nhanh
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Box 1 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-white text-center space-y-1 shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Lượt xem</span>
              </div>
              <p className="text-xl font-bold text-slate-900">128</p>
            </div>

            {/* Box 2 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-white text-center space-y-1 shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Kết quả khớp tiềm năng</span>
              </div>
              <p className="text-xl font-bold text-slate-900">12</p>
            </div>

            {/* Box 3 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-white text-center space-y-1 shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Yêu cầu xác minh</span>
              </div>
              <p className="text-xl font-bold text-slate-900">0</p>
            </div>

            {/* Box 4 */}
            <div className="p-3 rounded-xl border border-slate-100 bg-white text-center space-y-1 shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                <span>Phản hồi từ bạn</span>
              </div>
              <p className="text-xl font-bold text-slate-900">2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
