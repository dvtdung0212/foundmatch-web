import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="w-full bg-[#FAF7F2] border-t border-[#EFE8DF] text-[#7A6E67] pt-12 pb-8">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-xs text-[#7A6E67] leading-relaxed max-w-sm font-medium">
              Nền tảng kết nối người đánh mất và người nhặt được đồ hàng đầu, giúp trao trả đồ thất lạc một cách an toàn, minh bạch và tử tế.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#2A1B17]">Về FoundMatch</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="#workflow" className="hover:text-[#5B0E2D] transition-colors">
                  Giới thiệu nền tảng
                </Link>
              </li>
              <li>
                <Link href="#workflow" className="hover:text-[#5B0E2D] transition-colors">
                  Quy trình 3 bước
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#5B0E2D] transition-colors">
                  Quy định & Chính sách
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#2A1B17]">Hỗ trợ cộng đồng</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="/reports/lost" className="hover:text-[#5B0E2D] transition-colors">
                  Báo mất đồ
                </Link>
              </li>
              <li>
                <Link href="/reports/found" className="hover:text-[#5B0E2D] transition-colors">
                  Đăng đồ nhặt được
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#5B0E2D] transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-[#2A1B17]">Liên hệ</h4>
            <p className="text-xs font-medium">Email: hotro@foundmatch.vn</p>
            <p className="text-xs font-medium">Hotline: 1900 xxxx</p>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-6 border-t border-[#EFE8DF] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6E67] gap-4">
          <p>© {new Date().getFullYear()} FoundMatch Relay. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6 font-semibold">
            <Link href="#" className="hover:underline">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="hover:underline">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
