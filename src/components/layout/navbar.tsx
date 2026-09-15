import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/features/auth/components/user-menu";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import type { UserProfileDTO } from "@/types/profile.types";
import { ChevronDown } from "lucide-react";

interface NavbarProps {
  profile?: UserProfileDTO | null;
}

export function Navbar({ profile }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-brand-cream/90 backdrop-blur-md border-b border-brand-border">
      <div className="w-full max-w-[1800px] mx-auto flex h-20 items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Brand Logo PNG */}
        <Link href="/" className="flex items-center shrink-0">
          <Logo size="md" />
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-brand-heading">
          <Link href="#workflow" className="hover:text-brand-plum transition-colors">
            Cách hoạt động
          </Link>
          <Link href="/reports/create" className="hover:text-brand-plum transition-colors">
            Báo cáo
          </Link>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-brand-plum transition-colors">
            <span>Hỗ trợ</span>
            <ChevronDown className="h-4 w-4 text-brand-muted" />
          </div>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {profile ? (
            <div className="flex items-center gap-3">
              <NotificationBell enabled={Boolean(profile)} />
              <UserMenu profile={profile} />
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="md">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="md">
                  Đăng ký miễn phí
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
