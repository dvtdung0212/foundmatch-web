import Link from "next/link";
import { getCurrentProfile } from "@/features/profiles/actions/profile.actions";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ReportCard } from "@/components/ui/report-card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Heart,
  Users,
  Smile,
  Check,
  FileText,
  Repeat,
  Handshake,
} from "lucide-react";

export default async function HomePage() {
  const profileResult = await getCurrentProfile();
  const profile = profileResult.success ? profileResult.data : null;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#2A1B17]">
      {/* Navbar Header */}
      <Navbar profile={profile} />

      <main className="flex-1 space-y-16 md:space-y-20 py-8 md:py-12">
        {/* HERO SECTION */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#2A1B17] leading-[1.15]">
                  Tìm lại đồ thất lạc, <br className="hidden sm:inline" />
                  hoàn trả đồ nhặt được
                </h1>
                <p className="text-sm sm:text-base text-[#7A6E67] font-medium leading-relaxed max-w-xl">
                  FoundMatch kết nối người đánh mất và người nhặt được để trả lại đồ một cách nhanh chóng, an toàn và đáng tin cậy.
                </p>
              </div>

              {/* Action Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Lost Card */}
                <Link
                  href="/reports/create/lost"
                  className="group relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-[#FFF4F1] border border-[#FFC7BA] hover:shadow-md hover:bg-[#FFEBE5] transition-all cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-[#5B0E2D] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Search className="h-5.5 w-5.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#2A1B17]">Tôi bị mất đồ</h3>
                      <p className="text-[11px] text-[#7A6E67] font-medium leading-tight">
                        Báo cáo đồ bị mất để cộng đồng giúp bạn tìm lại.
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#5B0E2D]/10 flex items-center justify-center text-[#5B0E2D] group-hover:bg-[#5B0E2D] group-hover:text-white transition-all shrink-0 ml-2">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>

                {/* Found Card */}
                <Link
                  href="/reports/create/found"
                  className="group relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-[#F3F9F1] border border-[#C4E1BE] hover:shadow-md hover:bg-[#E8F4E5] transition-all cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-[#37783C] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <ShoppingBag className="h-5.5 w-5.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#2A1B17]">Tôi nhặt được đồ</h3>
                      <p className="text-[11px] text-[#7A6E67] font-medium leading-tight">
                        Đăng thông tin đồ nhặt được để tìm chủ nhân.
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#37783C]/10 flex items-center justify-center text-[#37783C] group-hover:bg-[#37783C] group-hover:text-white transition-all shrink-0 ml-2">
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>

              {/* Bullet Features */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-[#7A6E67]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#5B0E2D]" />
                  <span>Cộng đồng tử tế</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#5B0E2D]" />
                  <span>Xác minh rõ ràng</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Heart className="h-4 w-4 text-[#5B0E2D]" />
                  <span>Hoàn trả an toàn</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic Container */}
            <div className="lg:col-span-7">
              <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#EBE0D8] shadow-md flex flex-col gap-3 sm:gap-6 p-3 sm:p-7 aspect-auto sm:aspect-[16/9.5] lg:aspect-[16/9]">
                {/* Desktop Background Illustration (16:9 Horizontal with Characters) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/handover-hero-right.png"
                  alt="Handover Illustration Background Desktop"
                  className="hidden sm:block absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Mobile Background Illustration (Clean Scenery, No People) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/handover-hero-mobile.png"
                  alt="Handover Illustration Background Mobile No People"
                  className="block sm:hidden absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Light Overlay Gradient ở phía bên trái */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#F5ECE5]/80 via-[#F5ECE5]/30 to-transparent z-0" />

                {/* Top Floating Match Card */}
                <div className="relative z-10 mr-auto ml-0 gap-4 sm:gap-5 max-w-full sm:max-w-[380px] w-full bg-white/95 backdrop-blur-md border border-[#EFE8DF] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl text-center flex flex-col items-center">
                  <div className="text-[13px] sm:text-[14px] font-bold text-[#7A6E67] tracking-wider uppercase flex items-center justify-center gap-1">
                    <span className="text-[#5B0E2D]">✦</span> KẾT QUẢ KHỚP <span className="text-[#5B0E2D]">✦</span>
                  </div>

                  <div className="flex items-center justify-center gap-3 sm:gap-4 my-auto">
                    <div className="text-center space-y-1">
                      <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-[#FAF7F2] border-2 border-[#5B0E2D]/20 overflow-hidden mx-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                          alt="Người nhặt được"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#7A6E67] block">Người nhặt</span>
                    </div>

                    <div className="h-7 w-7 rounded-full bg-[#5B0E2D] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
                      <Check className="h-4 w-4" />
                    </div>

                    <div className="text-center space-y-1">
                      <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-[#FAF7F2] border-2 border-[#5B0E2D]/20 overflow-hidden mx-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                          alt="Chủ sở hữu"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#7A6E67] block">Chủ sở hữu</span>
                    </div>
                  </div>

                  <div className="flex justify-center w-full">
                    <Badge variant="matchSuccess" className="text-[14px] px-2.5 py-1">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-[#37783C]" />
                      Đối chiếu thành công
                    </Badge>
                  </div>
                </div>

                {/* Bottom 3 Feature Cards (Tăng kích thước Icon lên h-10 w-10 sm:h-11 sm:w-11) */}
                <div className="relative z-10 grid grid-cols-3 gap-3 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-[#EFE8DF] text-center shadow-lg">
                  <div className="space-y-1.5">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#FFF4F1] border border-[#FFC7BA] flex items-center justify-center mx-auto text-[#5B0E2D] shadow-sm">
                      <Lock className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                    </div>
                    <h5 className="font-extrabold text-xs sm:text-sm text-[#2A1B17]">Bảo mật thông tin</h5>
                    <p className="text-[11px] text-[#7A6E67] leading-tight hidden sm:block">Thông tin cá nhân ẩn danh cho đến khi xác minh.</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#F3F9F1] border border-[#C4E1BE] flex items-center justify-center mx-auto text-[#37783C] shadow-sm">
                      <ShieldCheck className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                    </div>
                    <h5 className="font-extrabold text-xs sm:text-sm text-[#2A1B17]">Xác minh an toàn</h5>
                    <p className="text-[11px] text-[#7A6E67] leading-tight hidden sm:block">Đối chiếu thông tin để đảm bảo đúng người, đúng đồ.</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[#FFF9EE] border border-[#FFD99A] flex items-center justify-center mx-auto text-[#D97C17] shadow-sm">
                      <Handshake className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
                    </div>
                    <h5 className="font-extrabold text-xs sm:text-sm text-[#2A1B17]">Hoàn trả tận tâm</h5>
                    <p className="text-[11px] text-[#7A6E67] leading-tight hidden sm:block">Hỗ trợ hướng dẫn trả đồ thuận tiện, an toàn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MERGED SECTION: WORKFLOW (LEFT AS BEFORE) + RECENT ITEMS (RIGHT) IN 1 SINGLE ROW */}
        <section id="workflow" className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Sub-Section: Quy trình 3 bước đơn giản */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:border-r lg:border-[#EFE8DF] lg:pr-8 h-full">
              {/* Header Title */}
              <div className="h-8 sm:h-9 flex items-center">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#2A1B17]">
                  Quy trình 3 bước đơn giản
                </h2>
              </div>

              {/* 3 Steps Container */}
              <div className="flex items-center justify-between gap-3 pt-2 my-auto w-full">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center space-y-3 flex-1 min-w-0">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#FFF4F1] border-2 border-[#FFC7BA] text-[#5B0E2D] flex items-center justify-center font-bold shadow-sm">
                      <FileText className="h-8 w-8 sm:h-9 sm:w-9" />
                    </div>
                    <span className="absolute -top-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#5B0E2D] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow">
                      1
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#2A1B17]">Báo cáo</h3>
                  <p className="text-xs sm:text-sm text-[#7A6E67] leading-relaxed max-w-[130px] sm:max-w-[150px]">
                    Cung cấp thông tin chi tiết về đồ thất lạc hoặc nhặt được.
                  </p>
                </div>

                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#7A6E67]/50 shrink-0 -mt-10" />

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center space-y-3 flex-1 min-w-0">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#FFF9EE] border-2 border-[#FFD99A] text-[#D97C17] flex items-center justify-center font-bold shadow-sm">
                      <Repeat className="h-8 w-8 sm:h-9 sm:w-9" />
                    </div>
                    <span className="absolute -top-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#5B0E2D] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow">
                      2
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#2A1B17]">Đối chiếu</h3>
                  <p className="text-xs sm:text-sm text-[#7A6E67] leading-relaxed max-w-[130px] sm:max-w-[150px]">
                    Hệ thống giúp tìm kiếm, đối chiếu thông tin.
                  </p>
                </div>

                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-[#7A6E67]/50 shrink-0 -mt-10" />

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center space-y-3 flex-1 min-w-0">
                  <div className="relative">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#F3F9F1] border-2 border-[#C4E1BE] text-[#37783C] flex items-center justify-center font-bold shadow-sm">
                      <Handshake className="h-8 w-8 sm:h-9 sm:w-9" />
                    </div>
                    <span className="absolute -top-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#5B0E2D] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center border-2 border-white shadow">
                      3
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#2A1B17]">Hoàn trả</h3>
                  <p className="text-xs sm:text-sm text-[#7A6E67] leading-relaxed max-w-[130px] sm:max-w-[150px]">
                    Xác minh thành công, trao trả đồ an toàn.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sub-Section: Đồ thất lạc / nhặt được gần đây */}
            <div id="reports" className="lg:col-span-7 space-y-6">
              <div className="h-8 sm:h-9 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#2A1B17]">
                  Đồ thất lạc / nhặt được gần đây
                </h2>
                <Link
                  href="/reports"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#5B0E2D] hover:underline"
                >
                  <span>Xem tất cả</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ReportCard
                  id="1"
                  type="found"
                  title="Ví da màu đen"
                  location="Quận 1, TP. HCM"
                  timeAgo="2 giờ trước"
                  imageUrl="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80"
                />
                <ReportCard
                  id="2"
                  type="lost"
                  title="iPhone 13 Pro Max"
                  location="Quận Ba Đình, Hà Nội"
                  timeAgo="3 giờ trước"
                  imageUrl="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"
                />
                <ReportCard
                  id="3"
                  type="found"
                  title="Chìa khóa xe Honda"
                  location="Gò Vấp, TP. HCM"
                  timeAgo="5 giờ trước"
                  imageUrl="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=400&q=80"
                />
                <ReportCard
                  id="4"
                  type="lost"
                  title="Túi vải màu be"
                  location="Cầu Giấy, Hà Nội"
                  timeAgo="1 ngày trước"
                  imageUrl="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80"
                />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: STATS & TRUST */}
        <section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="rounded-3xl bg-[#FFF8F3] border border-[#F9DCCB] p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Stat 1 */}
            <div className="flex items-center gap-4 shrink-0">
              <Users className="h-10 w-10 text-[#5B0E2D] shrink-0" />
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2A1B17]">50.000+</span>
                <p className="text-xs text-[#7A6E67] font-semibold">Thành viên tin tưởng</p>
              </div>
            </div>

            <div className="hidden lg:block h-12 w-px bg-[#EFE8DF]" />

            {/* Stat 2 */}
            <div className="flex items-center gap-4 shrink-0">
              <CheckCircle2 className="h-10 w-10 text-[#5B0E2D] shrink-0" />
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2A1B17]">12.500+</span>
                <p className="text-xs text-[#7A6E67] font-semibold">Vật dụng đã được hoàn trả</p>
              </div>
            </div>

            <div className="hidden lg:block h-12 w-px bg-[#EFE8DF]" />

            {/* Stat 3 */}
            <div className="flex items-center gap-4 shrink-0">
              <Smile className="h-10 w-10 text-[#5B0E2D] shrink-0" />
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#2A1B17]">98%</span>
                <p className="text-xs text-[#7A6E67] font-semibold">Hài lòng với trải nghiệm</p>
              </div>
            </div>

            <div className="hidden lg:block h-12 w-px bg-[#EFE8DF]" />

            {/* Trust Message */}
            <div className="space-y-0.5 max-w-xs shrink-0 text-center lg:text-left">
              <h4 className="font-extrabold text-sm sm:text-base text-[#2A1B17]">
                Nền tảng đáng tin cậy
              </h4>
              <p className="text-[11px] text-[#7A6E67] leading-tight">
                Chúng tôi cam kết xây dựng một cộng đồng tử tế, minh bạch và luôn đặt sự an toàn của bạn lên hàng đầu.
              </p>
            </div>

            {/* Security Pill (Far Right) */}
            <div className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-[#FFF4F1] border border-[#FFC7BA] text-xs font-semibold text-[#2A1B17] shrink-0 shadow-sm">
              <div className="p-2 rounded-xl bg-[#FAF7F2] text-[#5B0E2D] shadow-sm">
                <Lock className="h-5.5 w-5.5" />
              </div>
              <div>
                <p className="font-bold text-[#2A1B17] text-xs sm:text-sm">Thông tin của bạn luôn được bảo vệ</p>
                <a href="#security" className="text-[11px] text-[#5B0E2D] hover:underline flex items-center gap-1 font-bold mt-0.5">
                  Tìm hiểu thêm <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
