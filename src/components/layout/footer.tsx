import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="w-full bg-brand-cream border-t border-brand-border text-brand-muted pt-12 pb-8">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="text-xs text-brand-muted leading-relaxed max-w-sm font-medium">
              Nền tảng kết nối người đánh mất và người nhặt được đồ hàng đầu, giúp trao trả đồ thất lạc một cách an toàn, minh bạch và tử tế.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-brand-heading">Về FoundMatch</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="#workflow" className="hover:text-brand-plum transition-colors">
                  Giới thiệu nền tảng
                </Link>
              </li>
              <li>
                <Link href="#workflow" className="hover:text-brand-plum transition-colors">
                  Quy trình 3 bước
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-plum transition-colors">
                  Quy định & Chính sách
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-brand-heading">Hỗ trợ cộng đồng</h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link href="/reports/create/lost" className="hover:text-brand-plum transition-colors">
                  Báo mất đồ
                </Link>
              </li>
              <li>
                <Link href="/reports/create/found" className="hover:text-brand-plum transition-colors">
                  Đăng đồ nhặt được
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-plum transition-colors">
                  Trung tâm trợ giúp
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Hotlines */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-brand-heading">Hỗ trợ khẩn cấp</h4>
            <p className="text-xs font-semibold text-brand-muted">
              Tổng đài trực 24/7 giải quyết tranh chấp và hỗ trợ bàn giao.
            </p>
            <div className="text-sm font-black text-brand-plum">
              1900 8888 (Miễn phí)
            </div>
            <p className="text-[11px] text-brand-muted">
              Email: support@foundmatch.vn
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-brand-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-brand-muted">
          <p>© {new Date().getFullYear()} FoundMatch Vietnam. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-brand-heading transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="hover:text-brand-heading transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="hover:text-brand-heading transition-colors">
              Sơ đồ trang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
