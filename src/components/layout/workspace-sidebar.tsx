"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Home,
  FileText,
  Clock,
  Package,
  FolderArchive,
  User,
  MapPin,
  Shield,
  Settings,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkspaceSidebar({ isExpanded }: { isExpanded: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams?.get("type");

  const isHomeActive = pathname === "/" || pathname === "/overview";

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden whitespace-nowrap select-none">
      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto py-5 hide-scrollbar flex flex-col">
        {/* Top Group: Trang chủ */}
        <div className="px-3">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all relative whitespace-nowrap overflow-hidden",
              isHomeActive
                ? "bg-[#FFF4F1] text-brand-plum font-bold"
                : "text-brand-muted hover:bg-black/5 hover:text-brand-heading",
              !isExpanded && "justify-center px-0"
            )}
            title={!isExpanded ? "Trang chủ" : undefined}
          >
            <Home className="h-4.5 w-4.5 shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap overflow-hidden transition-all duration-300",
                isExpanded
                  ? "opacity-100 max-w-[180px]"
                  : "opacity-0 max-w-0 pointer-events-none"
              )}
            >
              Trang chủ
            </span>
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-brand-border/60 mx-4 my-3.5 shrink-0" />

        {/* Group 1: BÁO CÁO CỦA TÔI */}
        <div className="px-3 space-y-1">
          <h4
            className={cn(
              "px-3 text-[10px] font-extrabold text-brand-muted/60 uppercase tracking-widest mb-2 whitespace-nowrap overflow-hidden transition-all duration-300",
              isExpanded
                ? "opacity-100 max-h-6"
                : "opacity-0 max-h-0 pointer-events-none mb-0"
            )}
          >
            BÁO CÁO CỦA TÔI
          </h4>

          <div className="space-y-0.5">
            {/* Tất cả báo cáo */}
            <Link
              href="/reports"
              title={!isExpanded ? "Tất cả báo cáo" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all relative whitespace-nowrap overflow-hidden",
                pathname === "/reports" && !typeParam
                  ? "bg-[#FFF4F1] text-brand-plum font-bold"
                  : "text-brand-muted hover:bg-black/5 hover:text-brand-heading",
                !isExpanded && "justify-center px-0"
              )}
            >
              <FileText className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Tất cả báo cáo
              </span>
            </Link>

            {/* Báo cáo thất lạc */}
            <Link
              href="/reports?type=LOST"
              title={!isExpanded ? "Báo cáo thất lạc" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all relative whitespace-nowrap overflow-hidden",
                pathname === "/reports" && typeParam === "LOST"
                  ? "bg-[#FFF4F1] text-brand-plum font-bold"
                  : "text-brand-muted hover:bg-black/5 hover:text-brand-heading",
                !isExpanded && "justify-center px-0"
              )}
            >
              <Clock className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Báo cáo thất lạc
              </span>
            </Link>

            {/* Báo cáo nhặt được */}
            <Link
              href="/reports?type=FOUND"
              title={!isExpanded ? "Báo cáo nhặt được" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all relative whitespace-nowrap overflow-hidden",
                pathname === "/reports" && typeParam === "FOUND"
                  ? "bg-[#FFF4F1] text-brand-plum font-bold"
                  : "text-brand-muted hover:bg-black/5 hover:text-brand-heading",
                !isExpanded && "justify-center px-0"
              )}
            >
              <Package className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Báo cáo nhặt được
              </span>
            </Link>

            {/* Báo cáo của tôi */}
            <Link
              href="/reports"
              title={!isExpanded ? "Báo cáo của tôi" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all relative whitespace-nowrap overflow-hidden",
                (pathname === "/reports" || pathname === "/reports/mine") && !typeParam
                  ? "bg-[#FFF4F1] text-brand-plum font-bold"
                  : "text-brand-muted hover:bg-black/5 hover:text-brand-heading",
                !isExpanded && "justify-center px-0"
              )}
            >
              <FolderArchive className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Báo cáo của tôi
              </span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-brand-border/60 mx-4 my-3.5 shrink-0" />

        {/* Group 2: TÀI KHOẢN */}
        <div className="px-3 space-y-1">
          <h4
            className={cn(
              "px-3 text-[10px] font-extrabold text-brand-muted/60 uppercase tracking-widest mb-2 whitespace-nowrap overflow-hidden transition-all duration-300",
              isExpanded
                ? "opacity-100 max-h-6"
                : "opacity-0 max-h-0 pointer-events-none mb-0"
            )}
          >
            TÀI KHOẢN
          </h4>

          <div className="space-y-0.5">
            {/* Hồ sơ cá nhân */}
            <Link
              href="/profile"
              title={!isExpanded ? "Hồ sơ cá nhân" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all relative whitespace-nowrap overflow-hidden",
                pathname === "/profile"
                  ? "bg-[#FFF4F1] text-brand-plum font-bold"
                  : "text-brand-muted hover:bg-black/5 hover:text-brand-heading",
                !isExpanded && "justify-center px-0"
              )}
            >
              <User className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Hồ sơ cá nhân
              </span>
            </Link>

            {/* Địa chỉ & liên hệ */}
            <Link
              href="/profile#contact"
              title={!isExpanded ? "Địa chỉ & liên hệ" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] text-brand-muted hover:bg-black/5 hover:text-brand-heading transition-all whitespace-nowrap overflow-hidden",
                !isExpanded && "justify-center px-0"
              )}
            >
              <MapPin className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Địa chỉ & liên hệ
              </span>
            </Link>

            {/* Bảo mật */}
            <Link
              href="/profile#security"
              title={!isExpanded ? "Bảo mật" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] text-brand-muted hover:bg-black/5 hover:text-brand-heading transition-all whitespace-nowrap overflow-hidden",
                !isExpanded && "justify-center px-0"
              )}
            >
              <Shield className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Bảo mật
              </span>
            </Link>

            {/* Cài đặt */}
            <Link
              href="/settings"
              title={!isExpanded ? "Cài đặt" : undefined}
              className={cn(
                "flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-semibold text-[13px] transition-all relative whitespace-nowrap overflow-hidden",
                pathname === "/settings"
                  ? "bg-[#FFF4F1] text-brand-plum font-bold"
                  : "text-brand-muted hover:bg-black/5 hover:text-brand-heading",
                !isExpanded && "justify-center px-0"
              )}
            >
              <Settings className="h-4.5 w-4.5 shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap overflow-hidden transition-all duration-300",
                  isExpanded
                    ? "opacity-100 max-w-[180px]"
                    : "opacity-0 max-w-0 pointer-events-none"
                )}
              >
                Cài đặt
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Tips Card (Desktop Bottom) - Smooth Collapse */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          isExpanded
            ? "opacity-100 max-h-48 m-3 p-3.5 rounded-2xl bg-white border border-brand-border shadow-2xs space-y-1.5"
            : "opacity-0 max-h-0 p-0 m-0 border-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-2 text-brand-heading font-bold text-xs whitespace-nowrap">
          <div className="h-6 w-6 rounded-lg bg-brand-cream border border-brand-border flex items-center justify-center text-brand-plum shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          Mẹo an toàn
        </div>
        <p className="text-[11px] text-brand-muted leading-relaxed font-medium line-clamp-2">
          Không chia sẻ thông tin cá nhân hoặc gặp mặt khi chưa xác minh đối phương.
        </p>
        <Link
          href="/safety-tips"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-plum hover:underline pt-0.5 whitespace-nowrap"
        >
          Tìm hiểu thêm <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
