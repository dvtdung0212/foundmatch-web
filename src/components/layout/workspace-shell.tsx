"use client";

import { useState } from "react";
import { WorkspaceSidebar } from "./workspace-sidebar";
import { WorkspaceHeader } from "./workspace-header";
import type { UserProfileDTO } from "@/types/profile.types";
import { Lock, Unlock } from "lucide-react";

interface WorkspaceShellProps {
  profile: UserProfileDTO | null;
  children: React.ReactNode;
}

export function WorkspaceShell({ profile, children }: WorkspaceShellProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isLocked || isHovered;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAF7F2]">
      {/* Global Workspace Header */}
      <WorkspaceHeader profile={profile} />

      {/* Main Layout Area (Below Header) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Spacer (Desktop) - Smoothly push content on hover and lock */}
        <div
          className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${isExpanded ? "w-[240px]" : "w-[72px]"}`}
        >
          {/* Overlay Sidebar */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`absolute top-0 left-0 h-full bg-[#FAF7F2] lg:bg-white flex flex-col transition-all duration-300 border-r border-[#EFE8DF] z-50 overflow-visible group ${isExpanded ? "w-[240px] shadow-xl" : "w-[72px]"
              } ${isLocked ? "shadow-none" : ""}`}
          >
            <WorkspaceSidebar isExpanded={isExpanded} />

            {/* Lock Toggle Button (Desktop Only) - Hover on right border */}
            <button
              onClick={() => setIsLocked(!isLocked)}
              className="hidden lg:flex absolute left-full top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 bg-white border border-[#EFE8DF] rounded-full items-center justify-center text-brand-muted hover:text-brand-plum hover:border-[#FFC7BA] transition-all shadow-sm z-50 opacity-0 group-hover:opacity-100"

            >
              {isLocked ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                <Unlock className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
