"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FilePlus2,
  FileText,
  Bookmark,
  User,
  Settings,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const menuGroups = [
  {
    title: "BÁO CÁO",
    items: [
      { name: "Báo cáo của tôi", href: "/reports", icon: FileText },
      { name: "Tạo báo cáo", href: "/reports/create", icon: FilePlus2 },
    ],
  },
  {
    title: "TÀI KHOẢN",
    items: [
      { name: "Hồ sơ cá nhân", href: "/profile", icon: User },
      { name: "Cài đặt", href: "/settings", icon: Settings },
    ],
  },
];

interface WorkspaceSidebarProps {
  isExpanded: boolean;
}

export function WorkspaceSidebar({ isExpanded }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const isOverviewActive = pathname === "/overview";

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-5 hide-scrollbar flex flex-col gap-4">
        {/* Top level item: Tổng quan */}
        <div className="px-3">
          <Link
            href="/overview"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[13px] transition-colors relative ${
              isOverviewActive
                ? "bg-[#FFF4F1] text-brand-plum"
                : "text-brand-muted hover:bg-black/5 hover:text-brand-heading"
            } ${!isExpanded ? "justify-center px-0" : ""}`}
            title={!isExpanded ? "Tổng quan" : undefined}
          >
            {isOverviewActive && isExpanded && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-plum rounded-r-md" />
            )}
            <LayoutGrid className="h-4.5 w-4.5 shrink-0" />
            {isExpanded && <span className="truncate">Tổng quan</span>}
          </Link>
        </div>

        {/* Menu Groups */}
        {menuGroups.map((group, index) => (
          <div key={index} className="px-3 space-y-1">
            {isExpanded && (
              <h4 className="px-3 text-[10px] font-extrabold text-brand-muted/60 uppercase tracking-widest mb-1.5">
                {group.title}
              </h4>
            )}
            {!isExpanded && (
              <div className="h-px bg-brand-border/50 mx-3 my-2" />
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/reports"
                    ? pathname === "/reports" || pathname === "/reports/mine" || (pathname.startsWith("/reports/") && !pathname.startsWith("/reports/create"))
                    : pathname === item.href || (item.href !== "#" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={!isExpanded ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[13px] transition-all relative ${
                      isActive
                        ? "bg-[#FFF4F1] text-brand-plum"
                        : "text-brand-muted hover:bg-black/5 hover:text-brand-heading"
                    } ${!isExpanded ? "justify-center px-0" : ""}`}
                  >
                    {/* Active left border indicator */}
                    {isActive && isExpanded && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-brand-plum rounded-r-md" />
                    )}

                    <item.icon className="h-4.5 w-4.5 shrink-0" />

                    {isExpanded && (
                      <span className="flex-1 truncate">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Safety Tips Card (Desktop Bottom) */}
      {isExpanded && (
        <div className="p-3 m-3 rounded-2xl bg-brand-cream/80 border border-brand-border space-y-1.5">
          <div className="flex items-center gap-2 text-brand-heading font-bold text-xs">
            <div className="h-6 w-6 rounded-lg bg-white border border-brand-border flex items-center justify-center text-brand-plum">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            Mẹo an toàn
          </div>
          <p className="text-[11px] text-brand-muted leading-relaxed font-medium">
            Không chia sẻ thông tin cá nhân hoặc gặp mặt khi chưa xác minh đối phương.
          </p>
          <Link
            href="/safety-tips"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-plum hover:underline pt-0.5"
          >
            Tìm hiểu thêm <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
