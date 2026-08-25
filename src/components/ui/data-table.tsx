"use client";

import React, { useState } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Select } from "./select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Pagination } from "./pagination";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export type DataTableFilter =
  | {
      type: "search";
      key: string;
      placeholder?: string;
      value: string;
      onChange: (val: string) => void;
    }
  | {
      type: "select";
      key: string;
      label?: string;
      options: { label: string; value: string }[];
      value: string;
      onChange: (val: string) => void;
    };

export interface DataTableProps<T> {
  className?: string;
  title?: React.ReactNode;
  data: T[];
  columns: DataTableColumn<T>[];
  filters?: DataTableFilter[];
  isLoading?: boolean;
  emptyState?: React.ReactNode;

  rowKey: (row: T) => string;
  selectedRowKey?: string | null;
  onRowClick?: (row: T) => void;
  rowContextMenu?: (row: T, children: React.ReactNode) => React.ReactNode;
  renderRow?: (args: {
    row: T;
    index: number;
    cells: React.ReactNode;
    defaultRow: React.ReactNode;
  }) => React.ReactNode;
  footer?: React.ReactNode;

  page?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

function getColumnAlignment(align: DataTableColumn<unknown>["align"]) {
  switch (align) {
    case "center":
      return { content: "justify-center", text: "text-center" };
    case "right":
      return { content: "justify-end", text: "text-right" };
    default:
      return { content: "justify-start", text: "text-left" };
  }
}

export function DataTable<T>({
  className,
  title,
  data,
  columns,
  filters,
  isLoading,
  emptyState = "Không có dữ liệu.",
  rowKey,
  selectedRowKey,
  onRowClick,
  rowContextMenu,
  renderRow,
  footer,
  page,
  total,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: DataTableProps<T>) {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const hasFilters = filters && filters.length > 0;
  const searchFilter = filters?.find((f) => f.type === "search");
  const selectFilters = filters?.filter((f) => f.type === "select");

  const activeFiltersCount =
    selectFilters?.filter((filter) => {
      if (filter.type !== "select") return false;
      const defaultValue = filter.options[0]?.value;
      return filter.value && filter.value !== defaultValue;
    }).length || 0;

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-brand-border shadow-xs overflow-hidden flex flex-col",
        className
      )}
    >
      {title && (
        <div className="px-6 py-4 flex justify-between items-center border-b border-brand-border/60">
          {title}
        </div>
      )}

      {hasFilters && (
        <div className="border-b border-brand-border/60">
          {/* Main Toolbar */}
          <div className="flex items-center gap-3 py-4 px-4 sm:px-6">
            {searchFilter && searchFilter.type === "search" && (
              <div className="w-full sm:max-w-md">
                <Input
                  aria-label={searchFilter.placeholder ?? "Tìm kiếm"}
                  placeholder={searchFilter.placeholder ?? "Tìm kiếm..."}
                  icon={<Search className="w-4 h-4 text-brand-muted" />}
                  className="h-10 rounded-xl"
                  value={searchFilter.value}
                  onChange={(e) => searchFilter.onChange(e.target.value)}
                />
              </div>
            )}

            <div className="flex-1" />

            {selectFilters && selectFilters.length > 0 && (
              <Button
                variant="outline"
                className="gap-2 h-10 font-bold px-3.5 text-xs rounded-xl"
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              >
                <Filter className="w-3.5 h-3.5" />
                Bộ lọc
                {activeFiltersCount > 0 && (
                  <span className="ml-1 flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold bg-brand-plum text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Expanded Select Filters */}
          {selectFilters && selectFilters.length > 0 && isFiltersExpanded && (
            <div className="p-4 bg-brand-cream/30 border-t border-brand-border/50 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {selectFilters.map((filter) => {
                if (filter.type !== "select") return null;
                return (
                  <div key={filter.key}>
                    <Select
                      label={filter.label}
                      value={filter.value}
                      onChange={filter.onChange}
                      options={filter.options}
                      triggerClassName="h-9 text-xs"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Table Area */}
      <div className="overflow-x-auto">
        <Table className="border-none shadow-none rounded-none">
          <TableHeader>
            <TableRow>
              {columns.map((col) => {
                const alignment = getColumnAlignment(col.align);
                return (
                  <TableHead
                    key={col.key}
                    className={cn(col.className, alignment.text)}
                  >
                    <div
                      className={cn(
                        "flex w-full items-center",
                        alignment.content
                      )}
                    >
                      {col.header}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-brand-muted"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-brand-plum border-t-transparent animate-spin" />
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((row, index) => {
                const isSelected =
                  selectedRowKey !== undefined &&
                  selectedRowKey !== null &&
                  selectedRowKey === rowKey(row);

                const cells = columns.map((col, colIndex) => {
                  const alignment = getColumnAlignment(col.align);
                  return (
                    <TableCell
                      key={col.key}
                      className={cn(
                        col.className,
                        alignment.text,
                        isSelected &&
                          colIndex === 0 &&
                          "shadow-[inset_4px_0_0_0_#6B1D2F]"
                      )}
                    >
                      <div
                        className={cn(
                          "flex w-full items-center",
                          alignment.content
                        )}
                      >
                        {col.cell(row, index)}
                      </div>
                    </TableCell>
                  );
                });

                const defaultRow = (
                  <TableRow
                    key={rowKey(row)}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "transition-colors",
                      onRowClick && "cursor-pointer hover:bg-brand-cream/40",
                      isSelected && "bg-brand-cream/60"
                    )}
                  >
                    {cells}
                  </TableRow>
                );

                const content = renderRow
                  ? renderRow({ row, index, cells, defaultRow })
                  : defaultRow;

                return (
                  <React.Fragment key={rowKey(row)}>
                    {rowContextMenu ? rowContextMenu(row, content) : content}
                  </React.Fragment>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-brand-muted"
                >
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {footer}

      {/* Pagination Footer */}
      {totalPages !== undefined && totalPages > 0 && onPageChange && (
        <div className="border-t border-brand-border/60 px-4 bg-white">
          <Pagination
            currentPage={page ?? 1}
            totalPages={totalPages}
            totalItems={total ?? 0}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      )}
    </div>
  );
}
