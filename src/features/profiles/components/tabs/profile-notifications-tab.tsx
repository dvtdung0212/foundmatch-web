import { Bell } from "lucide-react";

export function ProfileNotificationsTab() {
  return (
    <div className="bg-white rounded-[32px] p-12 border border-brand-border shadow-sm flex flex-col items-center justify-center text-center min-h-[360px]">
      <div className="h-16 w-16 bg-[#F3F9F1] text-brand-found rounded-full flex items-center justify-center mb-4">
        <Bell className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-bold text-brand-heading">
        Cài đặt Thông báo
      </h3>
      <p className="text-sm font-semibold text-brand-muted mt-2 max-w-md leading-relaxed">
        Hệ thống tùy chọn thông báo kết hợp (Email & In-App) theo danh mục sẽ được
        kết nối với tùy chọn người dùng ở Giai đoạn tiếp theo.
      </p>
    </div>
  );
}
