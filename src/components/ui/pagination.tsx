"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "./select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  itemLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
  itemLabel = "báo cáo",
}: PaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate visible page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1 text-xs text-brand-muted font-medium",
        className
      )}
    >
      {/* Total items text */}
      <div>
        Hiển thị <span className="font-bold text-brand-heading">{startItem}</span> đến{" "}
        <span className="font-bold text-brand-heading">{endItem}</span> trong tổng số{" "}
        <span className="font-bold text-brand-heading">{totalItems}</span> {itemLabel}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Page navigation */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-8 w-8 rounded-lg border border-brand-border bg-white flex items-center justify-center text-brand-heading hover:bg-brand-cream/80 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Trang trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pages.map((p, index) => {
            const prevPage = pages[index - 1];
            const isEllipsis = prevPage && p - prevPage > 1;

            return (
              <React.Fragment key={p}>
                {isEllipsis && <span className="px-1 text-brand-muted">...</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={cn(
                    "h-8 min-w-[32px] px-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border",
                    currentPage === p
                      ? "bg-brand-plum text-white border-brand-plum shadow-xs"
                      : "bg-white text-brand-heading border-brand-border hover:bg-brand-cream/80"
                  )}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="h-8 w-8 rounded-lg border border-brand-border bg-white flex items-center justify-center text-brand-heading hover:bg-brand-cream/80 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="Trang sau"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Page size selector */}
        {onPageSizeChange && (
          <div className="w-28">
            <Select
              aria-label="Số bản ghi mỗi trang"
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              options={pageSizeOptions.map((opt) => ({
                label: `${opt} / trang`,
                value: String(opt),
              }))}
              triggerClassName="h-8 rounded-lg px-2.5 py-1 text-xs font-semibold"
            />
          </div>
        )}
      </div>
    </div>
  );
}
