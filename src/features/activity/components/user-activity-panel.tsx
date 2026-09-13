"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, parseISO } from "date-fns";
import { Calendar, ChevronDown, RotateCcw } from "lucide-react";

import { ActivityTimeline } from "@/components/ui/activity-timeline";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { listUserActivity, type UserActivityCategory } from "../api/user-activity-api";

const PAGE_SIZE = 10;

const categoryFilters: { label: string; value?: UserActivityCategory }[] = [
  { label: "Tất cả" },
  { label: "Tài khoản & bảo mật", value: "ACCOUNT_SECURITY" },
  { label: "Dữ liệu cá nhân", value: "PERSONAL_DATA" },
  { label: "Báo cáo đồ vật", value: "REPORT" },
];

type DatePreset = "ALL" | "7D" | "30D" | "90D" | "CUSTOM";

const datePresets: { id: DatePreset; label: string; days?: number }[] = [
  { id: "ALL", label: "Tất cả" },
  { id: "7D", label: "7 ngày qua", days: 7 },
  { id: "30D", label: "30 ngày qua", days: 30 },
  { id: "90D", label: "90 ngày qua", days: 90 },
];

const categoryLabels: Record<UserActivityCategory, string> = {
  ACCOUNT_SECURITY: "Tài khoản & bảo mật",
  PERSONAL_DATA: "Dữ liệu cá nhân",
  REPORT: "Báo cáo đồ vật",
  MATCHING: "Đối sánh",
  ADMINISTRATION: "Quản trị",
  MODERATION: "Kiểm duyệt",
  SECURITY: "Bảo mật",
  SYSTEM: "Hệ thống",
};

function activityType(category: UserActivityCategory): string {
  if (category === "ACCOUNT_SECURITY" || category === "SECURITY") return "verify";
  if (category === "REPORT") return "edit";
  if (category === "PERSONAL_DATA") return "view";
  return "system";
}

export function UserActivityPanel() {
  const [category, setCategory] = useState<UserActivityCategory | undefined>();
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>("ALL");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [page, setPage] = useState(1);

  const handlePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    setPage(1);

    if (preset === "ALL") {
      setDateFrom("");
      setDateTo("");
      return;
    }

    const item = datePresets.find((p) => p.id === preset);
    if (item?.days) {
      const now = new Date();
      setDateTo(format(now, "yyyy-MM-dd"));
      setDateFrom(format(subDays(now, item.days), "yyyy-MM-dd"));
    }
  };

  const handleDateFromChange = (eOrVal: unknown) => {
    const val =
      typeof eOrVal === "string"
        ? eOrVal
        : (eOrVal as React.ChangeEvent<HTMLInputElement>)?.target?.value || "";
    setDateFrom(val);
    setDatePreset("CUSTOM");
    setPage(1);
  };

  const handleDateToChange = (eOrVal: unknown) => {
    const val =
      typeof eOrVal === "string"
        ? eOrVal
        : (eOrVal as React.ChangeEvent<HTMLInputElement>)?.target?.value || "";
    setDateTo(val);
    setDatePreset("CUSTOM");
    setPage(1);
  };

  const handleResetDates = () => {
    setDatePreset("ALL");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  };

  const isDateFiltered = Boolean(dateFrom || dateTo || datePreset !== "ALL");

  const activeDateLabel = useMemo(() => {
    if (datePreset === "ALL") return "";
    if (datePreset !== "CUSTOM") {
      return datePresets.find((p) => p.id === datePreset)?.label || "";
    }
    if (dateFrom && dateTo) {
      return `${format(parseISO(dateFrom), "dd/MM/yyyy")} - ${format(parseISO(dateTo), "dd/MM/yyyy")}`;
    }
    if (dateFrom) {
      return `Từ ${format(parseISO(dateFrom), "dd/MM/yyyy")}`;
    }
    if (dateTo) {
      return `Đến ${format(parseISO(dateTo), "dd/MM/yyyy")}`;
    }
    return "Tùy chỉnh";
  }, [datePreset, dateFrom, dateTo]);

  const query = useQuery({
    queryKey: ["user-activity", category, page, dateFrom, dateTo],
    queryFn: () =>
      listUserActivity({
        category,
        page,
        pageSize: PAGE_SIZE,
        dateFrom: dateFrom ? `${dateFrom}T00:00:00.000Z` : undefined,
        dateTo: dateTo ? `${dateTo}T23:59:59.999Z` : undefined,
      }),
  });

  const data = query.data;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-brand-border shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-2">
        <div>
          <h3 className="text-xl font-extrabold text-brand-heading">Lịch sử hoạt động</h3>
          <p className="text-[13px] font-semibold text-brand-muted mt-1">
            Các thay đổi thành công liên quan đến tài khoản và dữ liệu của bạn trong 12 tháng gần nhất.
          </p>
        </div>
      </div>

      <div>
        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2" aria-label="Lọc nhóm hoạt động">
            {categoryFilters.map((filter) => (
              <Button
                key={filter.value ?? "all"}
                size="sm"
                variant={category === filter.value ? "primary" : "secondary"}
                onClick={() => {
                  setCategory(filter.value);
                  setPage(1);
                }}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Date filter trigger */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsDateFilterOpen((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all border cursor-pointer",
                isDateFilterOpen || isDateFiltered
                  ? "bg-brand-plum text-white border-brand-plum shadow-xs"
                  : "bg-white text-brand-heading border-brand-border hover:bg-brand-cream/80"
              )}
              aria-expanded={isDateFilterOpen}
              aria-controls="date-filter-collapse-panel"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{activeDateLabel ? `Thời gian: ${activeDateLabel}` : "Lọc thời gian"}</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  isDateFilterOpen && "rotate-180"
                )}
              />
            </button>

            {isDateFiltered && (
              <button
                type="button"
                onClick={handleResetDates}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand-border bg-white text-brand-muted hover:text-brand-plum hover:bg-brand-cream/80 transition-colors cursor-pointer"
                title="Đặt lại thời gian"
                aria-label="Đặt lại thời gian"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Date Picker Dropdown Panel */}
        <div
          id="date-filter-collapse-panel"
          className={cn(
            "grid transition-[grid-template-rows,opacity,margin] duration-250 ease-out",
            isDateFilterOpen
              ? "grid-rows-[1fr] opacity-100 my-4"
              : "grid-rows-[0fr] opacity-0 my-0 pointer-events-none"
          )}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl border border-brand-border/70 bg-brand-cream/30 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-heading">
                  Khoảng thời gian
                </span>
                {isDateFiltered && (
                  <button
                    type="button"
                    onClick={handleResetDates}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-plum hover:underline cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Đặt lại thời gian
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {datePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetChange(preset.id)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer border",
                      datePreset === preset.id
                        ? "bg-brand-plum text-white border-brand-plum shadow-xs"
                        : "bg-white text-brand-heading border-brand-border hover:bg-brand-cream/80"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <DatePicker
                  label="Từ ngày"
                  placeholder="Chọn ngày bắt đầu"
                  value={dateFrom}
                  onChange={handleDateFromChange}
                  disabledDays={(d) => d > new Date() || (dateTo ? d > parseISO(dateTo) : false)}
                />
                <DatePicker
                  label="Đến ngày"
                  placeholder="Chọn ngày kết thúc"
                  value={dateTo}
                  onChange={handleDateToChange}
                  disabledDays={(d) => d > new Date() || (dateFrom ? d < parseISO(dateFrom) : false)}
                />
              </div>
            </div>
          </div>
        </div>

        {!isDateFilterOpen && <div className="h-4" />}

        {/* Timeline Content */}
        {query.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">Không thể tải lịch sử hoạt động.</p>
            <Button className="mt-4" size="sm" variant="secondary" onClick={() => query.refetch()}>
              Thử lại
            </Button>
          </div>
        ) : (
          <ActivityTimeline
            isLoading={query.isLoading}
            emptyText="Chưa có hoạt động nào trong khoảng thời gian hoặc nhóm này."
            items={(data?.items ?? []).map((event) => ({
              id: event.id,
              type: activityType(event.category),
              tag: categoryLabels[event.category],
              title: event.title,
              description: event.description,
              time: new Intl.DateTimeFormat("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(event.createdAt)),
            }))}
          />
        )}

        {/* Pagination */}
        {data && data.total > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-2">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={data.total}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="hoạt động"
            />
          </div>
        )}
      </div>
    </div>
  );
}
