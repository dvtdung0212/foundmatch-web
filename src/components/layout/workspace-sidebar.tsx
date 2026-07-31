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
    title: "BÁO CÁO",
    items: [
      { name: "Tạo báo cáo", href: "#", icon: FilePlus2 },
      { name: "Báo cáo của tôi", href: "/reports/mine", icon: FileText },
      { name: "Báo cáo đã lưu", href: "#", icon: Bookmark },
    ],
  },
  {
    title: "HOẠT ĐỘNG",
    items: [
      { name: "Tin nhắn", href: "#", icon: MessageSquare },
      { name: "Thông báo", href: "#", icon: Bell, badge: 3 },
    ],
  },
  {
    title: "TÀI KHOẢN",
    items: [
      { name: "Hồ sơ", href: "/profile", icon: User },
      { name: "Cài đặt", href: "#", icon: Settings },
    ],
  },
];

interface WorkspaceSidebarProps {
  isExpanded: boolean;
}

export function WorkspaceSidebar({ isExpanded }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 hide-scrollbar flex flex-col gap-5">

        {/* Top level item */}
        <div className="px-3">
          <Link
            href="/overview"
            className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[13px] transition-colors ${pathname === "/overview"
              ? "bg-[#FFF4F1] text-brand-plum"
              : "text-brand-muted hover:bg-black/5 hover:text-brand-heading"
              } ${!isExpanded ? "justify-center px-0" : ""}`}
            title={!isExpanded ? "Tổng quan" : undefined}
          >
            <LayoutGrid className="h-4.5 w-4.5 shrink-0" />
            {isExpanded && <span className="truncate">Tổng quan</span>}
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
                const isActive = pathname.startsWith(item.href) && item.href !== "#";

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={!isExpanded ? item.name : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl font-semibold text-[13px] transition-all relative ${isActive
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

                    {/* Badge */}
                    {item.badge && (
                      <div
                        className={`h-5 min-w-[20px] rounded-full bg-brand-plum text-white text-[9px] font-bold flex items-center justify-center px-1.5 ${!isExpanded ? "absolute -top-1 -right-1" : ""
                          }`}
                      >
                        {item.badge}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </>
  );
}
