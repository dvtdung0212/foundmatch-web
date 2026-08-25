import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  FilePlus2,
  FileText,
  Bookmark,
  MessageSquare,
  Bell,
  User,
  Settings,
  ShieldCheck,
  ArrowRight
} from "lucide-react";

const menuGroups = [
  {
    title: "BÁO CÁO CỦA TÔI",
    items: [
      { name: "Tất cả báo cáo", href: "/reports", icon: FileText },
      { name: "Báo cáo thất lạc", href: "/reports/create/lost", icon: FilePlus2 },
      { name: "Báo cáo nhặt được", href: "/reports/create/found", icon: Bookmark },
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

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 hide-scrollbar flex flex-col gap-5">
        {/* Top level item */}
        <div className="px-3">
          <Link
            href="/reports"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[13px] transition-colors ${
              pathname === "/reports" || pathname === "/reports/mine"
                ? "bg-[#FFF4F1] text-brand-plum"
                : "text-brand-muted hover:bg-black/5 hover:text-brand-heading"
            } ${!isExpanded ? "justify-center px-0" : ""}`}
            title={!isExpanded ? "Báo cáo của tôi" : undefined}
          >
            <LayoutGrid className="h-4.5 w-4.5 shrink-0" />
            {isExpanded && <span className="truncate">Báo cáo của tôi</span>}
          </Link>
        </div>

        {/* Menu Groups */}
        {menuGroups.map((group, index) => (
          <div key={index} className="px-3 space-y-1">
            {isExpanded && (
              <h4 className="px-3 text-[10px] font-extrabold text-brand-muted/60 uppercase tracking-widest mb-2">
                {group.title}
              </h4>
            )}
            {!isExpanded && (
              <div className="h-px bg-brand-border/50 mx-3 my-3" />
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "#" && item.href !== "/reports" && pathname.startsWith(item.href));

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
        <div className="p-3 m-3 rounded-2xl bg-brand-cream/60 border border-brand-border/80 space-y-2">
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
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-plum hover:underline pt-1"
          >
            Tìm hiểu thêm <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
