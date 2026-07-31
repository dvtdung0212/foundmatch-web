import { ShieldCheck, ShieldAlert, CheckCircle2 } from "lucide-react";

export function ProfileSidebar() {
  return (
    <div className="space-y-6">
      {/* Impact Card Placeholder */}
      <div className="bg-[#FAF7F2] rounded-3xl border border-brand-border shadow-sm flex flex-col relative overflow-hidden h-64">
        <div className="p-6">
          <div className="flex items-center gap-2 text-brand-heading font-bold mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-lost"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            Tác động của bạn
          </div>
          <p className="text-xs text-brand-muted">Bạn đang tạo nên sự khác biệt tích cực! (Coming soon)</p>
        </div>
        <div className="mt-auto bg-[#E4CFBF]/30 h-24 w-full"></div>
      </div>

      {/* Verification Card Placeholder */}
      <div className="bg-white rounded-3xl p-6 border border-brand-border shadow-sm flex flex-col space-y-3">
        <div className="flex items-center justify-between font-bold text-brand-heading">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-found" />
            Cấp độ xác minh
          </div>
          <button className="text-brand-muted hover:text-brand-heading">&rarr;</button>
        </div>
        <div className="flex items-start gap-4 pt-2">
          <div className="h-12 w-12 rounded bg-[#F3F9F1] text-brand-found flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-brand-found">Đã xác minh <CheckCircle2 className="inline h-3 w-3" /></p>
            <p className="text-[11px] text-brand-muted mt-0.5 leading-tight">Tài khoản của bạn đã được xác minh danh tính.</p>
            <button className="text-[11px] font-bold text-brand-plum hover:underline mt-1.5">Nâng cấp xác minh &rarr;</button>
          </div>
        </div>
      </div>

      {/* Safety Reminder Card Placeholder */}
      <div className="bg-[#FFF4F1] rounded-3xl p-6 border border-[#FFC7BA] shadow-sm space-y-4">
        <div className="flex items-center justify-between font-bold text-brand-lost">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Nhắc nhở an toàn
          </div>
          <button className="text-brand-lost/60 hover:text-brand-lost">&rarr;</button>
        </div>
        <ul className="space-y-2 text-xs font-semibold text-brand-heading">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-found shrink-0 mt-0.5" />
            Không chia sẻ OTP hoặc mật khẩu
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-found shrink-0 mt-0.5" />
            Giao dịch tại nơi công cộng
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-found shrink-0 mt-0.5" />
            Báo cáo ngay nếu có dấu hiệu bất thường
          </li>
        </ul>
        <button className="text-[11px] font-bold text-brand-lost hover:underline">Xem hướng dẫn an toàn &rarr;</button>
      </div>
    </div>
  );
}
