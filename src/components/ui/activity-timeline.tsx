"use client";

import React from "react";
import {
  Edit,
  Eye,
  FileImage,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityTimelineItem {
  id: string;
  type?: "create" | "edit" | "media" | "system" | "view" | "verify" | string;
  tag?: string;
  title?: string;
  description: string;
  actorName?: string;
  actorRole?: string;
  actorAvatar?: string;
  isSystem?: boolean;
  time: string;
}

export interface ActivityTimelineProps {
  items: ActivityTimelineItem[];
  isLoading?: boolean;
  emptyText?: string;
  className?: string;
}

export function ActivityTimeline({
  items,
  isLoading,
  emptyText = "Chưa có sự kiện hoạt động nào.",
  className,
}: ActivityTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center pl-6">
            <div className="w-3.5 h-3.5 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 h-16 bg-slate-100 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-xs text-slate-400 italic py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
        {emptyText}
      </div>
    );
  }

  const getEventIcon = (type?: string) => {
    switch (type) {
      case "create":
        return <PlusCircle className="w-4 h-4 text-emerald-600" />;
      case "edit":
        return <Edit className="w-4 h-4 text-sky-600" />;
      case "media":
        return <FileImage className="w-4 h-4 text-purple-600" />;
      case "system":
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case "view":
        return <Eye className="w-4 h-4 text-teal-600" />;
      case "verify":
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-plum" />;
    }
  };

  const getBadgeStyle = (type?: string) => {
    switch (type) {
      case "create":
        return {
          iconBox: "bg-emerald-50/80 border-emerald-200 text-emerald-600",
          tag: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "edit":
        return {
          iconBox: "bg-sky-50/80 border-sky-200 text-sky-600",
          tag: "bg-sky-50 text-sky-700 border-sky-200",
        };
      case "media":
        return {
          iconBox: "bg-purple-50/80 border-purple-200 text-purple-600",
          tag: "bg-purple-50 text-purple-700 border-purple-200",
        };
      case "system":
        return {
          iconBox: "bg-amber-50/80 border-amber-200 text-amber-600",
          tag: "bg-amber-50 text-amber-700 border-amber-200",
        };
      case "view":
        return {
          iconBox: "bg-teal-50/80 border-teal-200 text-teal-600",
          tag: "bg-teal-50 text-teal-700 border-teal-200",
        };
      case "verify":
        return {
          iconBox: "bg-indigo-50/80 border-indigo-200 text-indigo-600",
          tag: "bg-indigo-50 text-indigo-700 border-indigo-200",
        };
      default:
        return {
          iconBox: "bg-slate-50 border-slate-200 text-slate-600",
          tag: "bg-slate-50 text-slate-700 border-slate-200",
        };
    }
  };

  return (
    <div className={cn("flex flex-col relative ml-1", className)}>
      {/* Continuous Vertical Timeline Axis Line (Like CMS HistoryTimeline) */}
      <div className="absolute left-[7px] top-4 bottom-4 w-px bg-slate-200 z-0" />

      <div className="space-y-4">
        {items.map((item, index) => {
          const isLatest = index === 0;
          const styles = getBadgeStyle(item.type);
          const tagLabel = item.tag || item.title || "Sự kiện";

          const dotClass = isLatest
            ? "bg-[#4A0E2E] ring-2 ring-[#4A0E2E]/30"
            : "bg-slate-400 ring-1 ring-slate-300";

          return (
            <div key={item.id || index} className="relative z-10 pl-7 group">
              {/* Timeline Dot (Identical to CMS style) */}
              <div
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white transition-all shadow-2xs",
                  dotClass
                )}
              />

              {/* Event Content Card (Preserving current layout) */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                {/* Left side: Icon badge + Tag + Description */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs",
                      styles.iconBox
                    )}
                  >
                    {getEventIcon(item.type)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <span
                      className={cn(
                        "inline-block text-[11px] font-bold px-2 py-0.5 rounded border",
                        styles.tag
                      )}
                    >
                      {tagLabel}
                    </span>
                    <p className="text-xs font-semibold text-slate-900 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right side: Actor Profile + Timestamp */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {item.actorName && (
                    <div className="flex items-center gap-2">
                      {item.isSystem ? (
                        <div className="w-7 h-7 rounded-full bg-[#4A0E2E] text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
                          FM
                        </div>
                      ) : item.actorAvatar ? (
                        <img
                          src={item.actorAvatar}
                          alt={item.actorName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 text-xs shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="text-left sm:text-right">
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          {item.actorName}
                        </p>
                        {item.actorRole && (
                          <p className="text-[10px] text-slate-400 leading-tight">
                            {item.actorRole}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <span className="text-xs text-slate-500 font-normal whitespace-nowrap pl-2">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
