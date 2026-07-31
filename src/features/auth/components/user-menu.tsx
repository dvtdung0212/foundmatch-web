"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOutAction } from "../actions/auth.actions";
import type { UserProfileDTO } from "@/types/profile.types";
import {
  User,
  LogOut,
  ShieldCheck,
  ChevronDown,
  BadgeCheck,
} from "lucide-react";

interface UserMenuProps {
  profile: UserProfileDTO | null;
}

export function UserMenu({ profile }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!profile) return null;

  const roleLabels: Record<string, { label: string; color: string }> = {
    user: {
      label: "User",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    },
    relay_member: {
      label: "Relay Member",
      color:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    },
    moderator: {
      label: "Moderator",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    },
    admin: {
      label: "Admin",
      color:
        "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    },
  };

  const roleInfo = roleLabels[profile.role] || roleLabels.user;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-border bg-card hover:bg-muted/80 transition-all text-sm font-medium"
      >
        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.fullName || profile.email}
              className="h-full w-full object-cover"
            />
          ) : (
            (profile.fullName || profile.email).charAt(0).toUpperCase()
          )}
        </div>
        <span className="max-w-[120px] truncate hidden sm:inline text-foreground font-semibold text-xs">
          {profile.fullName || profile.email}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-2 border-b border-border/60 mb-1">
            <p className="font-bold text-sm text-foreground truncate">
              {profile.fullName || "Người dùng"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile.email}
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${roleInfo.color}`}
              >
                <BadgeCheck className="h-3 w-3" /> {roleInfo.label}
              </span>
            </div>
          </div>

          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <User className="h-4 w-4 text-muted-foreground" /> Hồ sơ cá nhân
          </Link>

          <button
            onClick={async () => {
              setIsOpen(false);
              await signOutAction();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
