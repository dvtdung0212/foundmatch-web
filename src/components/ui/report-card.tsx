import React from "react";
import { Badge } from "./badge";
import { MapPin, Clock } from "lucide-react";

export interface ReportCardProps {
  id: string;
  type: "lost" | "found";
  title: string;
  location: string;
  timeAgo: string;
  imageUrl?: string;
  compact?: boolean;
}

export function ReportCard({
  type,
  title,
  location,
  timeAgo,
  imageUrl,
  compact = false,
}: ReportCardProps) {
  const isFound = type === "found";

  return (
    <div className="group flex flex-col p-2.5 rounded-2xl bg-white border border-[#EFE8DF] shadow-sm hover:shadow-md transition-all">
      {/* Inner Image container (Nền ảnh tự cover lọt lòng vuông vắn vừa khít) */}
      <div
        className={`relative w-full rounded-xl overflow-hidden flex items-center justify-center bg-[#FAF7F2] ${
          compact ? "h-22 sm:h-26" : "h-28 sm:h-30"
        }`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-2xl opacity-30">📦</div>
        )}
        <div className="absolute top-2 left-2 z-10">
          <Badge variant={isFound ? "found" : "lost"} className="text-[10px] px-2 py-0.5 shadow-sm">
            {isFound ? "Nhặt được" : "Thất lạc"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="px-1 pt-2 pb-1 flex flex-col justify-between flex-1 space-y-1.5">
        <h4 className="font-bold text-xs sm:text-sm text-[#2A1B17] line-clamp-1 group-hover:text-[#5B0E2D] transition-colors">
          {title}
        </h4>

        <div className="space-y-1 text-xs text-[#7A6E67]">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-[#7A6E67]" />
            <span className="truncate text-[11px] sm:text-xs">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#7A6E67]/80">
            <Clock className="h-3 w-3 shrink-0" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
