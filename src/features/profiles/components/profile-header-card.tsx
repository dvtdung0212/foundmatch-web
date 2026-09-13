"use client";

import { useEffect, useState } from "react";
import { UserProfileDTO } from "@/types/profile.types";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

interface ProfileHeaderCardProps {
  profile: UserProfileDTO;
}

export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  const [currentProfile, setCurrentProfile] = useState<UserProfileDTO>(profile);

  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  useEffect(() => {
    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<UserProfileDTO>;
      if (customEvent.detail) {
        setCurrentProfile((prev) => ({
          ...prev,
          ...customEvent.detail,
        }));
      }
    };

    window.addEventListener("profile-updated", handleProfileUpdated);
    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, []);
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-between relative overflow-hidden">
      
      {/* Left Column (Info) */}
      <div className="flex-1 flex flex-col justify-center gap-5 w-full">
        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden bg-brand-cream border-[3px] border-white shadow-md flex items-center justify-center text-3xl font-bold text-brand-plum">
              {currentProfile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentProfile.avatarUrl}
                  alt={currentProfile.fullName || currentProfile.email}
                  className="h-full w-full object-cover"
                />
              ) : (
                (currentProfile.fullName || currentProfile.email).charAt(0).toUpperCase()
              )}
            </div>
            <button className="absolute bottom-0 right-0 h-7 w-7 bg-brand-muted text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-brand-heading transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </button>
          </div>

          {/* Info Details */}
          <div className="flex-1 space-y-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-[22px] font-extrabold text-brand-heading tracking-tight leading-none">
                {currentProfile.fullName || "Người dùng"}
              </h2>
              <button className="h-6 w-6 rounded-full bg-[#F9ECE3] text-brand-plum flex items-center justify-center hover:bg-brand-plum hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              </button>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FFF4F1] text-brand-lost text-[11px] font-bold border border-[#FFC7BA]/50">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Người dùng tích cực
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-bold text-brand-muted pt-1">
              <span className="flex items-center gap-1 text-brand-found">
                <ShieldCheck className="h-3.5 w-3.5" /> Đã xác minh
              </span>
              <span className="hidden sm:inline text-brand-muted/50">•</span>
              <span>
                Thành viên từ {new Date(currentProfile.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 pt-1.5 text-[13px] font-semibold text-brand-heading">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted shrink-0"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <span className="truncate">{currentProfile.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>{currentProfile.phone || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{currentProfile.address || "Chưa cập nhật"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Trust Score Sub-Card) */}
      <div className="w-full lg:w-[250px] shrink-0 flex flex-col gap-3">
        {/* Main Trust Score Card (Flex-1 to stretch) */}
        <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#F9ECE3] flex items-center justify-center flex-1 gap-4">
          <div className="h-12 w-12 bg-brand-found text-white rounded-full flex items-center justify-center shadow-sm border-2 border-white shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 text-brand-heading">
              <span className="text-3xl font-extrabold leading-none">4.8</span>
              <span className="text-sm font-bold text-brand-heading">/5</span>
            </div>
            <p className="text-[12px] font-semibold text-brand-heading mt-1 flex items-center gap-1">
              Điểm uy tín <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-muted"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
            </p>
          </div>
        </div>
        
        {/* Secondary Status Card */}
        <div className="bg-[#F3F9F1]/50 rounded-xl p-3.5 border border-[#D4E8CE]/50 flex items-start gap-2.5">
          <div className="h-6 w-6 rounded-full bg-[#EAF3E7] text-brand-found flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className="space-y-0.5">
            <p className="text-[12px] font-semibold text-[#4A5D4E] leading-snug">Tài khoản của bạn đang hoạt động tốt.</p>
            <button className="text-[11px] font-bold text-brand-plum hover:underline flex items-center gap-1 mt-1">Xem chi tiết &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
