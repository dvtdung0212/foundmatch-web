"use client";

import { UserMenu } from "@/features/auth/components/user-menu";
import type { UserProfileDTO } from "@/types/profile.types";
import { Bell, Menu, Lock, Unlock } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

interface WorkspaceHeaderProps {
  profile: UserProfileDTO | null;
}

export function WorkspaceHeader({ profile }: WorkspaceHeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-16 sm:h-20 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-4 sm:px-6 shrink-0 w-full">
      
      {/* Left side (Logo) */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger (visible on small screens) */}
        <button className="lg:hidden p-2 -ml-2 rounded-xl text-brand-muted hover:bg-black/5 transition-colors">
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo size="md" />
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-brand-muted hover:text-brand-plum hover:border-[#FFC7BA] transition-all shadow-sm">
          <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
          {/* Notification Badge indicator */}
          <span className="absolute top-0 right-0 h-2.5 w-2.5 sm:h-3 sm:w-3 bg-brand-plum rounded-full border-2 border-white" />
        </button>
        
        {profile && (
          <div className="border-l border-[#E5E7EB] pl-3 sm:pl-4 ml-1">
            <UserMenu profile={profile} />
          </div>
        )}
      </div>
    </header>
  );
}
