"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  HelpCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  FileQuestion,
  Users,
  ShieldCheck,
  Bell,
  HeartHandshake,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ReportTypeSelector() {
  const router = useRouter();
  const [quickQuery, setQuickQuery] = useState("");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      router.push(`/find?q=${encodeURIComponent(quickQuery.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 py-6 px-4 sm:px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center justify-center gap-2 text-xs font-semibold text-brand-muted">
        <Link href="/" className="hover:text-brand-plum transition-colors">
          Trang chủ
        </Link>
        <span>›</span>
        <span>Báo cáo</span>
        <span>›</span>
        <span className="text-brand-plum">Chọn loại báo cáo</span>
      </nav>

      {/* Main Heading */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-heading tracking-tight">
          Bạn muốn báo cáo gì?
        </h1>
        <p className="text-sm sm:text-base text-brand-muted">
          Chọn loại báo cáo phù hợp để hệ thống kết nối và hỗ trợ bạn nhanh chóng, bảo mật và chính xác nhất.
        </p>

        {/* Quick Search Bar */}
        <form onSubmit={handleQuickSearch} className="pt-2 max-w-lg mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Bạn muốn tìm kiếm đồ thất lạc trước? (vd: Ví Pedro, AirPods...)"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-24 rounded-full border border-brand-border bg-white text-xs sm:text-sm font-medium text-brand-heading placeholder:text-brand-muted/70 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-plum/20 focus-visible:border-brand-plum transition-all"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-4 pointer-events-none" />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1.5 h-9 rounded-full px-4 text-xs font-bold"
            >
              Tìm nhanh
            </Button>
          </div>
        </form>
      </div>

      {/* Two Big Hero Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Left: Lost Report Card */}
        <Card className="relative overflow-hidden border-2 border-[#FFDCD3] bg-gradient-to-b from-[#FFF7F5] to-white hover:border-brand-lost hover:shadow-lg transition-all duration-300 group rounded-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lost/5 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
              {/* Illustration & Badge */}
              <div className="relative w-full h-44 rounded-2xl bg-[#FFEBE5]/60 border border-[#FFDCD3] flex items-center justify-center overflow-hidden">
                {/* Simulated Backpack Image / Badge */}
                <div className="relative flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-brand-plum to-brand-lost text-white flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform">
                    <span className="text-4xl">🎒</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-brand-plum text-white flex items-center justify-center border-2 border-white shadow-sm font-bold text-sm">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 text-left">
                <h2 className="text-2xl font-bold text-brand-heading group-hover:text-brand-plum transition-colors">
                  Tôi bị mất đồ
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Báo cáo chi tiết đồ vật bạn bị thất lạc để cộng đồng và AI hỗ trợ tìm kiếm khớp tự động.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-2.5 pt-2 text-left text-xs sm:text-sm text-brand-heading">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-lostBg text-brand-lost flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span>Tiếp cận mạng lưới cộng đồng & đối tác rộng lớn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-lostBg text-brand-lost flex items-center justify-center shrink-0">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <span>Nhận thông báo thông minh ngay khi có kết quả khớp</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-lostBg text-brand-lost flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>Thông tin xác minh được mã hóa và bảo mật tuyệt đối</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-lostBg text-brand-lost flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span>Tăng tối đa cơ hội tìm lại tài sản thất lạc</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/reports/create/lost" className="block pt-2">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="bg-brand-plum hover:bg-brand-dark text-white rounded-xl gap-2 font-bold text-sm sm:text-base group-hover:shadow-md transition-all"
              >
                Tạo báo cáo mất đồ
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Right: Found Report Card */}
        <Card className="relative overflow-hidden border-2 border-[#CCE6C7] bg-gradient-to-b from-[#F7FCF6] to-white hover:border-brand-found hover:shadow-lg transition-all duration-300 group rounded-3xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-found/5 rounded-full blur-2xl pointer-events-none" />
          <CardContent className="p-6 sm:p-8 flex flex-col justify-between h-full space-y-6">
            <div className="space-y-6">
              {/* Illustration & Badge */}
              <div className="relative w-full h-44 rounded-2xl bg-[#E8F4E5]/60 border border-[#CCE6C7] flex items-center justify-center overflow-hidden">
                {/* Simulated Hand & Keys Image / Badge */}
                <div className="relative flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-brand-found text-white flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform">
                    <span className="text-4xl">🔑</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-brand-found text-white flex items-center justify-center border-2 border-white shadow-sm font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-2 text-left">
                <h2 className="text-2xl font-bold text-brand-heading group-hover:text-brand-found transition-colors">
                  Tôi nhặt được đồ
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Đăng thông tin đồ vật bạn nhặt được để kết nối trao trả cho chủ nhân thực sự một cách an toàn.
                </p>
              </div>

              {/* Benefits list */}
              <div className="space-y-2.5 pt-2 text-left text-xs sm:text-sm text-brand-heading">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-foundBg text-brand-found flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <span>Giúp người khác tìm lại tài sản quý giá</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-foundBg text-brand-found flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>Quy trình xác minh độc quyền, ngăn chặn mạo nhận</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-foundBg text-brand-found flex items-center justify-center shrink-0">
                    <Building2Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>Hỗ trợ gửi bảo quản tại Holding Point đối tác</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-foundBg text-brand-found flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>Góp phần lan tỏa tinh thần tử tế vì cộng đồng</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/reports/create/found" className="block pt-2">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="bg-brand-found hover:bg-[#2F6733] text-white rounded-xl gap-2 font-bold text-sm sm:text-base group-hover:shadow-md transition-all"
              >
                Tạo báo cáo nhặt được
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Support & Community Rules Section */}
      <div className="p-6 rounded-2xl bg-brand-cream/60 border border-brand-border flex flex-col md:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-brand-heading">Cần trợ giúp hoặc có thắc mắc?</h4>
            <p className="text-xs text-brand-muted">
              Xem hướng dẫn tạo báo cáo chuẩn hoặc liên hệ đội ngũ FoundMatch để được giải đáp.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/help/reporting-guide"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-brand-border hover:bg-brand-cream text-xs font-semibold text-brand-heading transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-plum" />
            Hướng dẫn báo cáo
          </Link>
          <Link
            href="/faq"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-brand-border hover:bg-brand-cream text-xs font-semibold text-brand-heading transition-colors"
          >
            <FileQuestion className="w-3.5 h-3.5 text-brand-plum" />
            Câu hỏi thường gặp
          </Link>
          <Link
            href="/community-rules"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-brand-border hover:bg-brand-cream text-xs font-semibold text-brand-heading transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-plum" />
            Quy định cộng đồng
          </Link>
        </div>
      </div>

      {/* Bottom Privacy Assurance */}
      <div className="flex items-center justify-center gap-2 text-xs font-medium text-brand-muted text-center pt-2">
        <Lock className="w-3.5 h-3.5 text-brand-plum shrink-0" />
        <span>Thông tin của bạn được bảo mật nghiêm ngặt và chỉ dùng để hỗ trợ tìm lại đồ thất lạc.</span>
      </div>
    </div>
  );
}

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
