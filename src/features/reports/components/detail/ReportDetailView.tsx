"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Lock,
  Sparkles,
  Share2,
  Edit,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Shield,
  ShieldCheck,
  Users,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { PotentialMatchesDrawer } from "../modals/PotentialMatchesDrawer";
import { ShareReportDialog } from "../modals/ShareReportDialog";
import { CloseReportDialog } from "../modals/CloseReportDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OwnerReportView } from "../../api/owner-report-view";
import { getAuthenticatedOwnerReportView } from "../../api/owner-report-api";

interface ReportDetailViewProps {
  report: OwnerReportView;
}

const mockReportData = {
  id: "FM-240520-8F3A7C",
  code: "FM-240520-8F3A7C",
  title: "Balo Kanken màu tím mận",
  type: "lost" as const,
  typeText: "Tôi bị mất đồ",
  category: "Túi ví / Balo",
  status: "active" as const,
  statusText: "Đang hoạt động",
  time: "20/05/2024 (14:00 - 16:00)",
  location: "Vincom Center Bà Triệu, Hai Bà Trưng, Hà Nội",
  locationDetail: "Khu vực sảnh tầng 1, cạnh cửa hàng The Coffee House.",
  description: "Balo vải Kanken màu đỏ mận/tím, quai đeo màu nâu đậm. Bên ngoài có một số vết xước nhẹ ở góc đáy phải. Khóa kéo màu vàng đồng có logo hình con cáo dập nổi.",
  
  // Private Facts
  distinctiveFeatures: "Một trong các ngăn phụ có kẹp móc khóa hình gấu bông nhỏ màu nâu và thẻ xe buýt.",
  secretVerificationAnswers: "Bên trong ngăn khóa kéo bí mật có 1 tai nghe có dây màu trắng và 1 chìa khóa phòng có thẻ tên Minh Đức.",
  
  // Images
  images: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=400&q=80",
    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400&q=80",
  ],
  
  // Stats
  potentialMatchesCount: 2,
  verificationRequestsCount: 1,
  
  // Recent Activities
  activities: [
    {
      id: "act-1",
      title: "Báo cáo đã được đăng",
      description: "Báo cáo của bạn đã được hiển thị công khai trên hệ thống.",
      time: "20/05/2024 • 16:05",
      icon: "success",
    },
    {
      id: "act-2",
      title: "Có 2 lượt xem báo cáo",
      description: "Người dùng trong khu vực Hai Bà Trưng đã xem tin của bạn.",
      time: "20/05/2024 • 18:20",
      icon: "view",
    },
    {
      id: "act-3",
      title: "Có 1 yêu cầu xác minh",
      description: "Một người đã gửi yêu cầu đối chiếu thông tin vật phẩm.",
      time: "21/05/2024 • 09:15",
      icon: "message",
    },
  ],
};

export function ReportDetailView({ report: initialReport }: ReportDetailViewProps) {
  const [report, setReport] = useState(initialReport);
  const [mediaPollAttempt, setMediaPollAttempt] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMatchesDrawerOpen, setIsMatchesDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [closeModalConfig, setCloseModalConfig] = useState<{
    open: boolean;
    type: "hide" | "close";
  }>({
    open: false,
    type: "close",
  });

  useEffect(() => {
    if (report.pendingMediaCount === 0 || mediaPollAttempt >= 12) return;

    const timeout = window.setTimeout(async () => {
      try {
        const refreshed = await getAuthenticatedOwnerReportView(report.id);
        setReport(refreshed);
      } catch {
        // Keep the last authoritative snapshot; the next page refresh can retry.
      } finally {
        setMediaPollAttempt((attempt) => attempt + 1);
      }
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [mediaPollAttempt, report.id, report.pendingMediaCount]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
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
        <span className="text-brand-plum font-mono">{report.code}</span>
      </nav>

      {/* Main Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left border-b border-brand-border/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-heading">
              Chi tiết báo cáo
            </h1>
            <Badge variant={report.type === "lost" ? "lost" : "found"}>
              {report.type === "lost" ? "Báo cáo mất đồ" : "Báo cáo nhặt được"}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-brand-muted">
            <span className="font-mono font-bold text-brand-plum">{report.code}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {report.statusText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            className="gap-1.5 text-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            Chia sẻ
          </Button>
          <Link href="/reports/create">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
              + Tạo báo cáo mới
            </Button>
          </Link>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 Cols): Image Gallery + Public Info + Secret Info + Activity Timeline */}
        <div className="lg:col-span-2 space-y-6 text-left">
          {/* Image Gallery Card */}
          <Card className="border-brand-border overflow-hidden">
            <CardContent className="p-5 space-y-4">
              {report.images.length > 0 ? (
                <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden bg-brand-cream/40 border border-brand-border">
                  <img
                    src={report.images[selectedImageIndex]}
                    alt={report.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-brand-dark/70 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {selectedImageIndex + 1} / {report.images.length}
                  </div>
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-cream/40 px-6 text-center text-sm text-brand-muted">
                  {report.pendingMediaCount > 0
                    ? `${report.pendingMediaCount} ảnh đang được xử lý an toàn.`
                    : "Báo cáo chưa có ảnh sẵn sàng hiển thị."}
                </div>
              )}

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {report.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-brand-plum shadow-xs ring-2 ring-brand-plum/20"
                        : "border-brand-border hover:border-brand-muted opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* General Information Card */}
          <Card className="border-brand-border shadow-xs">
            <CardContent className="p-6 sm:p-8 space-y-5">
              <div className="border-b border-brand-border/60 pb-3 flex items-center justify-between">
                <h3 className="font-bold text-lg text-brand-heading">Thông tin báo cáo</h3>
                <span className="text-xs text-brand-muted font-mono">{report.code}</span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-brand-border/40">
                  <span className="text-brand-muted font-medium">Loại báo cáo:</span>
                  <span className="sm:col-span-2 font-bold text-brand-heading">{report.typeText}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-brand-border/40">
                  <span className="text-brand-muted font-medium">Danh mục:</span>
                  <span className="sm:col-span-2 font-bold text-brand-plum">{report.category}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-brand-border/40">
                  <span className="text-brand-muted font-medium">Thời gian xảy ra:</span>
                  <span className="sm:col-span-2 font-semibold text-brand-heading flex items-center gap-2">
                    <Clock className="w-4 h-4 text-brand-plum" />
                    {report.time}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-brand-border/40">
                  <span className="text-brand-muted font-medium">Địa điểm xảy ra:</span>
                  <span className="sm:col-span-2 font-semibold text-brand-heading flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-plum shrink-0" />
                    {report.location}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2">
                  <span className="text-brand-muted font-medium">Mô tả chi tiết:</span>
                  <p className="sm:col-span-2 text-brand-heading leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Private Verification Fact Card (Zero-Knowledge Privacy Alert) */}
          {(report.distinctiveFeatures || report.secretVerificationAnswers || report.locationDetail) && (
          <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
              <Lock className="w-5 h-5 text-amber-700" />
              <span>Thông tin xác minh (Chỉ hiển thị với bạn)</span>
            </div>

            <div className="space-y-4 text-sm text-amber-900">
              <div className="space-y-1.5">
                <strong className="block text-amber-950 font-bold">Đặc điểm nhận dạng nổi bật:</strong>
                <p className="bg-white/80 p-4 rounded-xl border border-amber-200/80 text-amber-900 leading-relaxed">
                  {report.distinctiveFeatures ?? "Chưa cung cấp"}
                </p>
              </div>

              <div className="space-y-1.5">
                <strong className="block text-amber-950 font-bold">Thông tin bí mật đối chiếu:</strong>
                <p className="bg-white/80 p-4 rounded-xl border border-amber-200/80 text-amber-900 leading-relaxed">
                  {report.secretVerificationAnswers ?? "Chưa cung cấp"}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-amber-700 italic">
              * Thông tin này được bảo mật nghiêm ngặt. Người nhặt chỉ có thể đối chiếu khi cung cấp đúng thông tin qua quy trình bàn giao.
            </p>
          </div>
          )}

          {/* Recent Activity Timeline */}
          <Card className="border-brand-border">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
                <h3 className="font-bold text-base text-brand-heading">Hoạt động gần đây</h3>
                <span className="text-xs text-brand-muted">Thời gian thực</span>
              </div>

              <div className="space-y-4 relative pl-4 border-l-2 border-brand-border/60 text-xs">
                {report.activities.map((act) => (
                  <div key={act.id} className="relative space-y-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-plum absolute -left-[21px] top-1 ring-4 ring-brand-soft" />
                    <div className="flex items-center justify-between">
                      <strong className="text-brand-heading">{act.title}</strong>
                      <span className="text-[11px] text-brand-muted font-mono">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-brand-muted">{act.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Status + Progress + Matches Card + Quick Actions */}
        <div className="space-y-6 text-left">
          {/* Status & Progress Stepper Card */}
          <Card className="border-brand-border">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-muted">Trạng thái báo cáo</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {report.statusText}
                </span>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[11px] leading-relaxed">
                  {report.isPublic
                    ? "Báo cáo đang được hiển thị công khai với dữ liệu đã được giới hạn theo chính sách riêng tư."
                    : "Báo cáo hiện chưa được hiển thị công khai. Dữ liệu riêng tư vẫn chỉ dành cho chủ báo cáo và quy trình xác minh được phép."}
                </p>
              </div>

              <div className="rounded-xl border border-brand-border bg-brand-cream/40 p-3 text-xs text-brand-muted">
                Trạng thái workflow: <strong className="text-brand-heading">{report.workflowStatus}</strong>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Match Stats Card */}
          <div className="grid grid-cols-2 gap-3">
            {/* Potential Matches Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-brand-soft/60 border border-brand-plum/30 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-muted">Khớp tiềm năng</span>
                <Sparkles className="w-4 h-4 text-brand-plum group-hover:scale-110 transition-transform" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-brand-plum">{report.potentialMatchesCount}</span>
              </div>
              <span className="text-[11px] font-medium text-brand-muted">
                Chưa có API thống kê khớp
              </span>
            </div>

            {/* Verification Requests Box */}
            <div className="p-4 rounded-2xl bg-white border border-brand-border flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-brand-muted">Yêu cầu xác minh</span>
                <Users className="w-4 h-4 text-brand-muted" />
              </div>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-brand-heading">{report.verificationRequestsCount}</span>
              </div>
              <span className="text-[11px] font-medium text-brand-muted">
                Đang chờ đối chiếu
              </span>
            </div>
          </div>

          {/* Quick Actions Card */}
          <Card className="border-brand-border">
            <CardContent className="p-5 space-y-2">
              <span className="text-xs font-bold text-brand-heading block mb-2">Thao tác nhanh</span>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                disabled
                className="justify-start gap-2 text-xs font-semibold h-10"
              >
                <Edit className="w-4 h-4 text-brand-plum" />
                Chỉnh sửa thông tin báo cáo
              </Button>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                disabled
                className="justify-start gap-2 text-xs font-semibold h-10 text-brand-muted hover:text-brand-heading"
              >
                <EyeOff className="w-4 h-4" />
                Tạm ẩn bài đăng
              </Button>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                disabled
                className="justify-start gap-2 text-xs font-semibold h-10 text-brand-lost hover:bg-brand-lostBg hover:border-brand-lost/40"
              >
                <Lock className="w-4 h-4 text-brand-lost" />
                Đóng báo cáo
              </Button>

              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() => setIsShareModalOpen(true)}
                className="justify-start gap-2 text-xs font-semibold h-10"
              >
                <Share2 className="w-4 h-4 text-brand-plum" />
                Chia sẻ bài đăng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals & Drawers */}
      <PotentialMatchesDrawer
        open={isMatchesDrawerOpen}
        onOpenChange={setIsMatchesDrawerOpen}
        reportTitle={report.title}
      />

      <ShareReportDialog
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        reportCode={report.code}
        reportTitle={report.title}
      />

      <CloseReportDialog
        open={closeModalConfig.open}
        onOpenChange={(open) => setCloseModalConfig((prev) => ({ ...prev, open }))}
        reportTitle={report.title}
        actionType={closeModalConfig.type}
        onConfirm={(reason) => {
          // Confirm action
        }}
      />
    </div>
  );
}
