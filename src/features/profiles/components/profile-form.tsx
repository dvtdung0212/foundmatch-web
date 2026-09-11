"use client";

import { useState } from "react";
import { updateProfile } from "../actions/profile.actions";
import type { UserProfileDTO } from "@/types/profile.types";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Lock,
  Bell,
  X,
  User,
  Shield,
  Clock,
  Calendar,
  Mail,
  MapPin,
  Activity,
  MessageSquare
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserActivityPanel } from "@/features/activity/components/user-activity-panel";

interface ProfileFormProps {
  profile: UserProfileDTO;
}

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  isVerified = false,
  icon,
  isTextarea = false,
  maxLength,
  isEditing = false,
}: {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  type?: string;
  disabled?: boolean;
  isVerified?: boolean;
  icon?: React.ReactNode;
  isTextarea?: boolean;
  maxLength?: number;
  isEditing?: boolean;
}) => {
  const isReadonly = !isEditing || disabled;

  if (isTextarea) {
    return (
      <div className="relative space-y-1.5">
        <Textarea
          label={label}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={isReadonly}
          maxLength={maxLength}
          placeholder={isReadonly ? "Chưa cập nhật" : "Nhập thông tin..."}
          className={
            isReadonly
              ? "bg-slate-50/50 border-brand-border/50 text-brand-heading/80 cursor-not-allowed min-h-[100px] resize-none"
              : "min-h-[100px] resize-none"
          }
        />
        {maxLength && (
          <div className="absolute bottom-3 right-4 text-[10px] font-bold text-brand-muted">
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative space-y-1.5">
      <Input
        label={label}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={isReadonly}
        icon={icon}
        placeholder={isReadonly ? "Chưa cập nhật" : "Nhập thông tin..."}
        className={
          isReadonly
            ? "bg-slate-50/50 border-brand-border/50 text-brand-heading/80 cursor-not-allowed"
            : ""
        }
      />
      {isVerified && (
        <div className="absolute right-2 top-8 flex items-center gap-1 text-[10px] text-brand-found font-bold bg-[#F3F9F1] px-2 py-1 rounded-md">
          Đã xác minh
        </div>
      )}
    </div>
  );
};

const ToggleSwitch = ({ active, onChange }: { active: boolean, onChange: (val: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!active)}
    className={`h-6 w-[42px] rounded-full relative shrink-0 transition-colors ${active ? 'bg-brand-plum' : 'bg-slate-200'}`}
  >
    <div className={`h-5 w-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${active ? 'right-0.5' : 'left-0.5'}`}></div>
  </button>
);

export function ProfileForm({ profile }: ProfileFormProps) {
  const [activeTab, setActiveTab] = useState("info");

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [bio, setBio] = useState("Tôi thường xuyên di chuyển trong thành phố và luôn mong muốn giúp mọi người tìm lại những món đồ bị thất lạc. Cảm ơn FoundMatch đã kết nối những tấm lòng tử tế!");
  const [quote, setQuote] = useState("Tôi tin rằng mỗi món đồ đều có giá trị và mỗi hành động tử tế đều tạo nên sự khác biệt. Hãy cùng nhau xây dựng cộng đồng văn minh và giàu lòng tốt!");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Settings Mock State
  const [showPhone, setShowPhone] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    setLoading(true);
    setMessage(null);

    const result = await updateProfile({
      fullName,
      avatarUrl: avatarUrl || undefined,
      phone: phone || undefined,
    });

    setLoading(false);

    if (result.success) {
      setMessage({
        type: "success",
        text: result.message || "Cập nhật hồ sơ thành công!",
      });
      setIsEditing(false); // Trở về read-only
    } else {
      setMessage({
        type: "error",
        text:
          result.error?.message ||
          "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.",
      });
    }
  };



  return (
    <div className="space-y-6">
      {/* Tabs Bar */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-brand-border px-2 overflow-x-auto hide-scrollbar">
        {[
          { id: "info", label: "Thông tin cá nhân", icon: User },
          { id: "security", label: "Bảo mật", icon: Shield },
          { id: "notifications", label: "Thông báo", icon: Bell },
          { id: "activity", label: "Lịch sử hoạt động", icon: Clock },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-3.5 px-1 border-b-2 text-[13px] font-bold transition-colors whitespace-nowrap ${isActive
                ? "border-brand-plum text-brand-plum"
                : "border-transparent text-brand-muted hover:text-brand-heading"
                }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "info" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Left Card: Form (col-span-7) */}
          <div className="lg:col-span-8 h-full bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border shadow-sm space-y-6 relative">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
              <div>
                <h3 className="text-xl font-extrabold text-brand-heading">Thông tin cá nhân</h3>
                <p className="text-[13px] font-semibold text-brand-muted mt-1">Cập nhật thông tin để giúp cộng đồng tin tưởng và kết nối tốt hơn.</p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-brand-plum hover:bg-[#FFF4F1] transition-colors border border-[#FFC7BA]/50 bg-[#FFF4F1]/30 shrink-0"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFullName(profile.fullName || "");
                      setPhone(profile.phone || "");
                      setMessage(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold text-brand-muted hover:bg-slate-100 transition-colors"
                  >
                    <X className="h-4 w-4" /> Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-bold bg-brand-plum text-white hover:bg-brand-dark transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                    Lưu
                  </button>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`flex items-start gap-3 p-3.5 rounded-xl text-[13px] font-semibold border ${message.type === "success"
                  ? "bg-[#F3F9F1] border-[#D4E8CE] text-brand-found"
                  : "bg-[#FFF4F1] border-[#FFC7BA] text-brand-lost"
                  }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 pt-2">
              <InputField
                label="Họ và tên"
                value={fullName}
                onChange={setFullName}
                isEditing={isEditing}
              />
              <InputField
                label="Ngày sinh"
                value="15/08/1993"
                disabled
                icon={<Calendar className="h-4 w-4" />}
                isEditing={isEditing}
              />
              <InputField
                label="Email"
                value={profile.email}
                type="email"
                disabled
                isVerified
                isEditing={isEditing}
              />
              <InputField
                label="Số điện thoại"
                value={phone}
                onChange={setPhone}
                type="tel"
                isVerified={!!profile.phone}
                isEditing={isEditing}
              />
              <div className="sm:col-span-2">
                <InputField
                  label="Địa chỉ"
                  value="Quận 1, TP. Hồ Chí Minh"
                  disabled
                  isEditing={isEditing}
                />
              </div>
              <div className="sm:col-span-2">
                <InputField
                  label="Giới thiệu bản thân"
                  value={bio}
                  onChange={setBio}
                  isTextarea
                  maxLength={250}
                  isEditing={isEditing}
                />
              </div>
              <div className="sm:col-span-2">
                <InputField
                  label="Châm ngôn / Thông điệp"
                  value={quote}
                  onChange={setQuote}
                  isTextarea
                  maxLength={150}
                  isEditing={isEditing}
                />
              </div>
            </div>

          </div>

          {/* Right Card: Settings (col-span-5) */}
          <div className="lg:col-span-4 bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border shadow-sm space-y-8">

            {/* Privacy */}
            <div className="space-y-5">
              <h4 className="text-[14px] font-extrabold text-brand-heading">Cài đặt quyền riêng tư</h4>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-brand-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-brand-heading">Hiển thị số điện thoại cho người khác</p>
                      <p className="text-[11px] font-semibold text-brand-muted mt-1">Người khác có thể xem số điện thoại của bạn</p>
                    </div>
                  </div>
                  <ToggleSwitch active={showPhone} onChange={setShowPhone} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-brand-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-brand-heading">Hiển thị vị trí chính xác</p>
                      <p className="text-[11px] font-semibold text-brand-muted mt-1">Hiển thị quận/huyện thay vì vị trí chính xác</p>
                    </div>
                  </div>
                  <ToggleSwitch active={showLocation} onChange={setShowLocation} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Activity className="h-4 w-4 text-brand-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-brand-heading">Hiển thị hoạt động</p>
                      <p className="text-[11px] font-semibold text-brand-muted mt-1">Cho phép người khác xem hoạt động của bạn</p>
                    </div>
                  </div>
                  <ToggleSwitch active={showActivity} onChange={setShowActivity} />
                </div>
              </div>
            </div>

            <div className="h-px bg-brand-border w-full"></div>

            {/* Notifications */}
            <div className="space-y-5">
              <h4 className="text-[14px] font-extrabold text-brand-heading">Tùy chọn thông báo</h4>

              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-brand-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-brand-heading">Thông báo email</p>
                      <p className="text-[11px] font-semibold text-brand-muted mt-1">Nhận thông báo qua email</p>
                    </div>
                  </div>
                  <ToggleSwitch active={emailNotif} onChange={setEmailNotif} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Bell className="h-4 w-4 text-brand-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-brand-heading">Thông báo đẩy</p>
                      <p className="text-[11px] font-semibold text-brand-muted mt-1">Nhận thông báo qua ứng dụng</p>
                    </div>
                  </div>
                  <ToggleSwitch active={pushNotif} onChange={setPushNotif} />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-4 w-4 text-brand-muted mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[13px] font-bold text-brand-heading">Bản tin cộng đồng</p>
                      <p className="text-[11px] font-semibold text-brand-muted mt-1">Nhận bản tin về mẹo và câu chuyện tử tế</p>
                    </div>
                  </div>
                  <ToggleSwitch active={newsletter} onChange={setNewsletter} />
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : activeTab === "activity" ? (
        <UserActivityPanel />
      ) : (
        <div className="bg-white rounded-[32px] p-12 border border-brand-border shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="h-16 w-16 bg-[#FAF7F2] rounded-full flex items-center justify-center text-brand-muted mb-4">
            <Clock className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-brand-heading">Tính năng sắp ra mắt</h3>
          <p className="text-sm font-semibold text-brand-muted mt-2 max-w-sm">
            Chúng tôi đang hoàn thiện giao diện cho tính năng này. Vui lòng quay lại sau nhé!
          </p>
        </div>
      )}
    </div>
  );
}
