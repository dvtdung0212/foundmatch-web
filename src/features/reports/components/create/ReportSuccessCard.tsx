"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  MapPin,
  Clock,
  Bell,
  Eye,
  Plus,
  Home,
  ShieldCheck,
  Sparkles,
  Share2,
} from "lucide-react";
import { ShareReportDialog } from "../modals/ShareReportDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ReportSuccessCard() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "FM240520-8X7K2";
  const reportId = searchParams.get("reportId");
  const type = (searchParams.get("type") || "lost") as "lost" | "found";
  const title = searchParams.get("title") || "Ví da nam màu đen";

  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const isLost = type === "lost";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
        <Link href="/" className="hover:text-brand-plum transition-colors">
          Trang chủ
        </Link>
        <span>›</span>
        <Link href="/reports/create" className="hover:text-brand-plum transition-colors">
          Báo cáo
        </Link>
        <span>›</span>
        <span className="text-brand-found font-bold">Tạo báo cáo thành công</span>
      </nav>

      {/* Hero Success Banner */}
      <Card className="border-2 border-[#CCE6C7] bg-gradient-to-b from-[#F7FCF6] to-white overflow-hidden rounded-3xl shadow-sm">
        <CardContent className="p-6 sm:p-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8 text-center md:text-left">
          {/* Big Green Success Illustration */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-[#E8F4E5] border-4 border-white shadow-md flex items-center justify-center shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-found text-white flex items-center justify-center shadow-lg transform scale-110">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <Sparkles className="w-6 h-6 text-brand-found absolute top-2 right-2 animate-bounce" />
          </div>

          {/* Heading & Intro */}
          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-heading">
                Tạo báo cáo thành công!
              </h1>
              <p className="text-xs sm:text-sm text-brand-muted max-w-xl">
                Cảm ơn bạn đã cung cấp thông tin. Hệ thống của FoundMatch sẽ tiến hành phân tích, bảo vệ dữ liệu và tự động tìm kiếm kết quả khớp ngay lập tức.
              </p>
            </div>

            {/* 3 Quick Meta Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
              {/* Code */}
              <div className="p-3 rounded-xl bg-white border border-brand-border flex items-center justify-between shadow-2xs">
                <div className="min-w-0 pr-2">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-brand-muted">Mã báo cáo</div>
                  <div className="font-mono text-xs font-bold text-brand-plum truncate">{code}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  title="Sao chép mã"
                  className="p-1.5 rounded-lg hover:bg-brand-cream text-brand-muted hover:text-brand-plum transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-brand-found" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Type */}
              <div className="p-3 rounded-xl bg-white border border-brand-border flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-brand-muted">Loại báo cáo</div>
                  <div className="text-xs font-bold text-brand-heading">
                    {isLost ? "Báo cáo mất đồ" : "Báo cáo nhặt được"}
                  </div>
                </div>
                <Badge variant={isLost ? "lost" : "found"} className="text-[10px]">
                  {isLost ? "Mất" : "Nhặt"}
                </Badge>
              </div>

              {/* Status */}
              <div className="p-3 rounded-xl bg-white border border-brand-border flex items-center justify-between shadow-2xs">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-brand-muted">Trạng thái</div>
                  <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Đã tiếp nhận
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Middle Grid: Summary details & Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Report Item Summary Card (2 cols) */}
        <div className="lg:col-span-2 space-y-4 text-left">
          <Card className="border-brand-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <span className="font-bold text-sm text-brand-heading">Tóm tắt đồ vật đã đăng</span>
                <span className="text-xs text-brand-muted font-mono">{code}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-28 h-28 rounded-2xl overflow-hidden bg-brand-cream shrink-0 border border-brand-border">
                  <img
                    src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80"
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-brand-plum">Túi ví / Balo</span>
                    <h3 className="text-base font-bold text-brand-heading">{title}</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-brand-muted pt-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-plum shrink-0" />
                      <span>20/05/2024 (14:00 - 16:00)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-plum shrink-0" />
                      <span>Vincom Bà Triệu, Hai Bà Trưng</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-brand-muted line-clamp-2 italic pt-1">
                    &ldquo;Ví da nam màu đen, kiểu dáng gập đôi. Bên trong có nhiều ngăn thẻ và ngăn đựng tiền...&rdquo;
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Next Steps Timeline & Notification (1 col) */}
        <div className="space-y-4 text-left">
          {/* Next Steps Timeline Card */}
          <Card className="border-brand-border">
            <CardContent className="p-5 space-y-4">
              <span className="font-bold text-sm text-brand-heading block">Các bước tiếp theo</span>

              <div className="space-y-3.5 relative pl-4 border-l-2 border-brand-border text-xs">
                {/* Step 1 */}
                <div className="relative space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[21px] top-1 ring-4 ring-emerald-100" />
                  <strong className="text-brand-heading block">1. Hệ thống tiếp nhận & kích hoạt</strong>
                  <p className="text-[11px] text-brand-muted">
                    Báo cáo của bạn đã sẵn sàng tìm kiếm trên hệ thống.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-plum absolute -left-[21px] top-1 ring-4 ring-brand-soft" />
                  <strong className="text-brand-heading block">2. Tự động đối chiếu kết quả khớp</strong>
                  <p className="text-[11px] text-brand-muted">
                    AI liên tục rà soát cơ sở dữ liệu đối chiếu địa điểm, thời gian và thương hiệu.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-muted/40 absolute -left-[21px] top-1" />
                  <strong className="text-brand-muted block">3. Thông báo tức thì khi có kết quả</strong>
                  <p className="text-[11px] text-brand-muted">
                    Bạn sẽ nhận được thông báo ngay khi có người nhặt được báo thông tin trùng khớp.
                  </p>
                </div>
              </div>

              {/* Estimated Time Box */}
              <div className="p-3 rounded-xl bg-brand-cream/50 border border-brand-border text-xs flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-plum shrink-0" />
                <div>
                  <span className="text-[11px] text-brand-muted block">Thời gian xử lý ước tính:</span>
                  <strong className="text-brand-heading text-xs">24 - 48 giờ</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Callout Card */}
          <div className="p-4 rounded-2xl bg-brand-soft/50 border border-brand-plum/20 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-plum text-white flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 text-xs">
                <div className="font-bold text-brand-heading">Bật thông báo nhận tin tức thì</div>
                <p className="text-[11px] text-brand-muted">
                  Nhận thông báo qua ứng dụng và email khi có người xác minh tài sản.
                </p>
              </div>
            </div>
            <Button
              variant={notificationEnabled ? "secondary" : "primary"}
              size="sm"
              fullWidth
              onClick={() => setNotificationEnabled(true)}
              className="text-xs"
            >
              {notificationEnabled ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1" /> Đã bật thông báo
                </>
              ) : (
                "Bật thông báo ngay →"
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-4 rounded-2xl bg-white border border-brand-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={reportId ? `/reports/${reportId}` : `/reports/${code}`}>
            <Button variant="primary" className="gap-1.5 font-bold text-xs sm:text-sm">
              <Eye className="w-4 h-4" />
              Xem chi tiết báo cáo
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => setIsShareModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            Chia sẻ bài đăng
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/reports/create">
            <Button variant="outline" className="gap-1.5 text-xs text-brand-muted hover:text-brand-heading">
              <Plus className="w-3.5 h-3.5" />
              Tạo báo cáo mới
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-1.5 text-xs text-brand-muted hover:text-brand-heading">
              <Home className="w-3.5 h-3.5" />
              Về trang chủ
            </Button>
          </Link>
        </div>
      </div>

      {/* Share Modal */}
      <ShareReportDialog
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        reportCode={code}
        reportTitle={title}
      />
    </div>
  );
}
