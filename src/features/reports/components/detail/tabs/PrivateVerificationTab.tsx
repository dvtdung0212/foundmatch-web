"use client";

import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Edit,
  FileText,
  ImageIcon,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Receipt,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface PrivateVerificationTabProps {
  report: OwnerReportView;
}

export function PrivateVerificationTab({ report }: PrivateVerificationTabProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateVerification = () => {
    toast.info("Tính năng cập nhật bằng chứng đang mở trong form bổ sung.");
  };

  return (
    <div className="space-y-6 text-left">
      {/* 3 Columns Grid: 1. Secret Facts, 2. Sharing Rules, 3. Provided Evidence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {/* Card 1: Thông tin bí mật để xác minh */}
        <Card className="p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-plum/10 text-brand-plum font-bold text-xs flex items-center justify-center">
                1
              </div>
              <CardTitle>Thông tin bí mật để xác minh</CardTitle>
            </div>
            <CardDescription>
              Những thông tin này chỉ được chia sẻ khi đã xác minh quyền sở hữu thành công.
            </CardDescription>

            <div className="space-y-2.5 text-xs">
              {/* Phone */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                  <span className="font-mono text-slate-600">•••• •••• 6789</span>
                </div>
                <Badge variant="success" className="text-[10px] py-0 px-2">Đã xác minh</Badge>
              </div>

              {/* Email */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-brand-muted shrink-0" />
                  <span className="font-mono text-slate-600">n••••n.h@gmail.com</span>
                </div>
                <Badge variant="success" className="text-[10px] py-0 px-2">Đã xác minh</Badge>
              </div>

              {/* Distinctive trait */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium text-slate-600">
                    <KeyRound className="w-3.5 h-3.5 text-brand-plum" />
                    <span>Đặc điểm chỉ chủ sở hữu biết</span>
                  </div>
                  <Badge variant="success" className="text-[10px] py-0 px-2">Đã xác minh</Badge>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed pl-5">
                  {report.distinctiveFeatures || "Ví có ngăn phụ khóa kéo bên trong, logo dập chìm góc dưới bên phải."}
                </p>
              </div>

              {/* Secret compartment */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium text-slate-600">
                    <Lock className="w-3.5 h-3.5 text-brand-plum" />
                    <span>Ngăn bí mật</span>
                  </div>
                  <Badge variant="success" className="text-[10px] py-0 px-2">Đã xác minh</Badge>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed pl-5">
                  {report.secretVerificationAnswers || "Ngăn nhỏ phía sau, bên trong lót vải xám, có vạch chỉ đỏ."}
                </p>
              </div>

              {/* Receipt info */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-medium text-slate-600">
                    <Receipt className="w-3.5 h-3.5 text-brand-plum" />
                    <span>Hóa đơn / Chứng từ</span>
                  </div>
                  <Badge variant="success" className="text-[10px] py-0 px-2">Đã xác minh</Badge>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed pl-5">
                  Hóa đơn mua tại Pedro - Vincom Đồng Khởi (15/03/2024)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Card 2: Quy tắc chia sẻ thông tin */}
        <Card className="p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-plum/10 text-brand-plum font-bold text-xs flex items-center justify-center">
                2
              </div>
              <CardTitle>Quy tắc chia sẻ thông tin</CardTitle>
            </div>
            <CardDescription>
              Thông tin riêng tư của bạn được bảo vệ tuyệt đối theo chính sách Zero-Knowledge.
            </CardDescription>

            <ul className="space-y-3 text-xs text-slate-700 pt-1">
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-soft/80 text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-3 h-3" />
                </div>
                <span className="leading-relaxed">
                  Chỉ khi có kết quả khớp tiềm năng và cả hai bên đều xác minh thành công, hệ thống mới mở khóa thông tin.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-soft/80 text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3 h-3" />
                </div>
                <span className="leading-relaxed">
                  Thông tin được chia sẻ thông qua kênh an toàn của FoundMatch, không công khai trên mạng xã hội hay diễn đàn.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-brand-soft/80 text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
                  <KeyRound className="w-3 h-3" />
                </div>
                <span className="leading-relaxed">
                  Mọi dữ liệu nhạy cảm đều được mã hóa trên máy chủ và tuân thủ chặt chẽ tiêu chuẩn kiểm toán.
                </span>
              </li>
            </ul>
          </div>

          {/* Privacy Commitment Box */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cam kết bảo mật</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì bất kỳ mục đích thương mại nào.
            </p>
          </div>
        </Card>

        {/* Card 3: Bằng chứng đã cung cấp */}
        <Card className="p-5 sm:p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-brand-plum/10 text-brand-plum font-bold text-xs flex items-center justify-center">
                3
              </div>
              <CardTitle>Bằng chứng đã cung cấp</CardTitle>
            </div>
            <CardDescription>
              Các tệp và tài liệu giúp đối chiếu và chứng minh quyền sở hữu hợp pháp.
            </CardDescription>

            {/* Evidence Files List */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-700 min-w-0">
                  <FileText className="w-4 h-4 text-brand-plum shrink-0" />
                  <span className="font-medium truncate">Hoa_don_mua_hang.pdf</span>
                  <span className="text-[10px] text-brand-muted shrink-0">(458 KB)</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-700 min-w-0">
                  <ImageIcon className="w-4 h-4 text-brand-plum shrink-0" />
                  <span className="font-medium truncate">Anh_chi_tiet_mat_truoc.jpg</span>
                  <span className="text-[10px] text-brand-muted shrink-0">(1.2 MB)</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-brand-border/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-700 min-w-0">
                  <ImageIcon className="w-4 h-4 text-brand-plum shrink-0" />
                  <span className="font-medium truncate">Anh_chi_tiet_ben_trong.jpg</span>
                  <span className="text-[10px] text-brand-muted shrink-0">(1.4 MB)</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            </div>
          </div>

          {/* 2 Stat Boxes: Completion & Trust Score */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-center space-y-0.5">
              <span className="text-[10px] text-brand-muted font-medium">Trạng thái hoàn tất</span>
              <p className="text-xl font-extrabold text-brand-plum">100%</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Đã cung cấp đầy đủ</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-brand-border/60 text-center space-y-0.5">
              <span className="text-[10px] text-brand-muted font-medium">Điểm tin cậy xác minh</span>
              <div className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <p className="text-xl font-extrabold text-emerald-700">92%</p>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">Độ tin cậy cao</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Full-width Action Banner */}
      <Card variant="muted" className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-brand-plum/10 text-brand-plum flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs sm:text-sm text-brand-heading">
              Thông tin riêng tư được bảo vệ nghiêm ngặt
            </h4>
            <p className="text-[11px] sm:text-xs text-brand-muted leading-relaxed max-w-2xl">
              Vui lòng không chia sẻ thông tin nhạy cảm qua các kênh bên ngoài. FoundMatch chỉ liên hệ với bạn thông qua ứng dụng và email chính thức.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleUpdateVerification}
          className="gap-1.5 text-xs font-bold shrink-0 bg-brand-plum hover:bg-brand-plumDark text-white shadow-xs"
        >
          <Edit className="w-3.5 h-3.5" />
          Cập nhật thông tin xác minh
        </Button>
      </Card>
    </div>
  );
}
