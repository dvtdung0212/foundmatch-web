"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, MessageSquare, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

import type { UserProfileDTO } from "@/types/profile.types";

interface NavbarProps {
  profile?: UserProfileDTO | null;
  user?: {
    name: string;
    avatar?: string;
  };
}

export function Navbar({ profile, user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const displayName = profile?.fullName || user?.name || "Nguyễn Minh Đức";
  const displayAvatar = profile?.avatarUrl || user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/find?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: "Trang chủ", href: "/" },
    { label: "Tìm đồ", href: "/find" },
    { label: "Báo cáo", href: "/reports/create", isActive: pathname.startsWith("/reports") },
    { label: "Tin nhắn", href: "/messages", badge: "2" },
    { label: "Khu vực của tôi", href: "/my-area" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="w-full max-w-[1440px] mx-auto flex h-18 items-center justify-between px-4 sm:px-8">
        {/* Left: Logo & Search */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center shrink-0">
            <Logo size="md" />
          </Link>

          {/* Search bar in Navbar */}
          <form onSubmit={handleSearch} className="hidden lg:block w-64 xl:w-72">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Tìm kiếm đồ thất lạc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-full border border-brand-border bg-brand-cream/40 text-xs font-medium text-brand-heading placeholder:text-brand-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-plum/20 focus-visible:border-brand-plum transition-all"
              />
              <Search className="w-4 h-4 text-brand-muted absolute left-3 pointer-events-none" />
            </div>
          </form>
        </div>

        {/* Center: Nav links with active state indicator */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-semibold text-brand-heading">
          {navLinks.map((link) => {
            const active = link.isActive ?? pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-6 transition-colors flex items-center gap-1.5 ${
                  active ? "text-brand-plum font-bold" : "text-brand-heading hover:text-brand-plum"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="w-4 h-4 rounded-full bg-brand-lost text-white text-[10px] font-bold flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
                {/* Active Underline indicator */}
                {active && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-plum rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Notification Bell & User Avatar */}
        <div className="flex items-center gap-4">
          {/* Notification Button with badge */}
          <button
            type="button"
            title="Thông báo"
            className="relative w-9 h-9 rounded-full bg-brand-cream/60 border border-brand-border flex items-center justify-center text-brand-heading hover:text-brand-plum hover:bg-brand-soft transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-lost text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-brand-border/60 cursor-pointer group">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-brand-cream border border-brand-border shrink-0">
              <img
                src={displayAvatar}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:block text-xs font-bold text-brand-heading group-hover:text-brand-plum transition-colors max-w-[120px] truncate">
              {displayName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-brand-muted group-hover:text-brand-heading transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
