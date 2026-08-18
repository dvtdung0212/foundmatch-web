"use client";

import { Lightbulb, FileText, MapPin, Image as ImageIcon, Lock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ReportTipsCardProps {
  step: number;
  type: "lost" | "found";
}

export function ReportTipsCard({ step, type }: ReportTipsCardProps) {
  const isLost = type === "lost";

  return (
    <div className="space-y-4">
      {/* Smart Tips Card */}
      <Card className="border-brand-border bg-gradient-to-b from-white to-brand-cream/30">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-2.5 text-brand-heading font-extrabold text-base">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <span>Mẹo để báo cáo hiệu quả</span>
          </div>

          <div className="space-y-4 text-xs text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-soft text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-sm text-brand-heading block font-bold">Mô tả càng chi tiết càng tốt</strong>
                <p className="text-brand-muted text-xs leading-relaxed mt-0.5">
                  Cung cấp đầy đủ thông tin về kiểu dáng, màu sắc, thương hiệu và đặc điểm riêng biệt.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-soft text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-sm text-brand-heading block font-bold">Xác định thời gian & địa điểm</strong>
                <p className="text-brand-muted text-xs leading-relaxed mt-0.5">
                  Ghi nhớ chính xác thời gian và địa điểm bị mất/nhặt được sẽ giúp thu hẹp phạm vi tìm kiếm.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-soft text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <strong className="text-sm text-brand-heading block font-bold">Thêm hình ảnh minh chứng</strong>
                <p className="text-brand-muted text-xs leading-relaxed mt-0.5">
                  Ảnh thực tế giúp người khác nhận diện nhanh chóng và chính xác hơn 3 lần.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-soft text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-sm text-brand-heading block font-bold">Bảo mật thông tin xác minh</strong>
                <p className="text-brand-muted text-xs leading-relaxed mt-0.5">
                  {isLost
                    ? "Không chia sẻ thông tin bí mật ra ngoài. Chỉ dùng để đối chiếu khi người khác liên hệ."
                    : "Không công khai hết tất cả đặc điểm nhận dạng để bảo vệ tài sản người mất."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Commitment Box */}
      <div className="p-5 rounded-2xl bg-brand-soft/40 border border-brand-plum/15 flex items-start gap-3 text-left">
        <ShieldCheck className="w-6 h-6 text-brand-plum shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm text-brand-heading">FoundMatch cam kết bảo mật tuyệt đối</div>
          <p className="text-xs text-brand-muted leading-relaxed">
            Thông tin của bạn được bảo mật và chỉ dùng để hỗ trợ tìm lại đồ thất lạc. Vị trí chính xác sẽ được ẩn bán kính.
          </p>
        </div>
      </div>
    </div>
  );
}
