"use client";

import { useState } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ActivityTimeline, type ActivityTimelineItem } from "@/components/ui/activity-timeline";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface ActivityHistoryTabProps {
  report: OwnerReportView;
}

const DEFAULT_TIMELINE_EVENTS: ActivityTimelineItem[] = [
  {
    id: "act-1",
    type: "create",
    tag: "Tạo báo cáo",
    description: "Báo cáo thất lạc được tạo thành công.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "20/05/2024 10:30",
  },
  {
    id: "act-2",
    type: "edit",
    tag: "Cập nhật mô tả",
    description: "Cập nhật mô tả báo cáo.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "20/05/2024 10:45",
  },
  {
    id: "act-3",
    type: "media",
    tag: "Thêm ảnh",
    description: "Đã thêm 3 ảnh cho báo cáo.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "20/05/2024 10:48",
  },
  {
    id: "act-4",
    type: "system",
    tag: "Hệ thống",
    description: "Hệ thống đã tạo kết quả khớp dựa trên thông tin hiện có.",
    actorName: "Hệ thống FoundMatch",
    actorRole: "Hệ thống",
    isSystem: true,
    time: "20/05/2024 18:05",
  },
  {
    id: "act-5",
    type: "view",
    tag: "Xem kết quả khớp",
    description: "Người dùng đã xem kết quả khớp.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "21/05/2024 09:12",
  },
  {
    id: "act-6",
    type: "verify",
    tag: "Bổ sung xác minh",
    description: "Bổ sung thông tin xác minh: số điện thoại liên hệ.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "22/05/2024 09:15",
  },
];

export function ActivityHistoryTab({ report }: ActivityHistoryTabProps) {
  const [activityType, setActivityType] = useState("all");
  const [timeRange, setTimeRange] = useState("7days");
  const [actorFilter, setActorFilter] = useState("all");
  const [fromDate, setFromDate] = useState("2024-05-15");
  const [toDate, setToDate] = useState("2024-05-22");

  const [filteredEvents, setFilteredEvents] = useState<ActivityTimelineItem[]>(DEFAULT_TIMELINE_EVENTS);

  const handleApplyFilter = () => {
    let result = DEFAULT_TIMELINE_EVENTS;
    if (activityType !== "all") {
      result = result.filter((e) => e.type === activityType);
    }
    if (actorFilter === "system") {
      result = result.filter((e) => e.isSystem);
    } else if (actorFilter === "user") {
      result = result.filter((e) => !e.isSystem);
    }
    setFilteredEvents(result);
  };

  const handleResetFilter = () => {
    setActivityType("all");
    setTimeRange("7days");
    setActorFilter("all");
    setFilteredEvents(DEFAULT_TIMELINE_EVENTS);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      {/* Left Column (8 cols): Timeline List Container */}
      <div className="lg:col-span-8 space-y-4 text-left">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              Dòng sự kiện hoạt động
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Hiển thị {filteredEvents.length} sự kiện
            </span>
          </div>

          {/* Reusable ActivityTimeline Component */}
          <ActivityTimeline items={filteredEvents} />
        </div>
      </div>

      {/* Right Column (4 cols): Filter Card */}
      <div className="lg:col-span-4 space-y-4 text-left">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-200 pb-3">
            <Filter className="w-4 h-4 text-[#4A0E2E]" />
            <span>Bộ lọc lịch sử hoạt động</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Filter 1: Loại hoạt động */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Loại hoạt động</label>
              <Select
                value={activityType}
                onChange={setActivityType}
                options={[
                  { label: "Tất cả hoạt động", value: "all" },
                  { label: "Tạo & Cập nhật mô tả", value: "create" },
                  { label: "Thêm ảnh / tài liệu", value: "media" },
                  { label: "Kết quả khớp từ hệ thống", value: "system" },
                  { label: "Bổ sung xác minh", value: "verify" },
                ]}
              />
            </div>

            {/* Filter 2: Thời gian */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Thời gian</label>
              <Select
                value={timeRange}
                onChange={setTimeRange}
                options={[
                  { label: "7 ngày qua", value: "7days" },
                  { label: "30 ngày qua", value: "30days" },
                  { label: "Tất cả thời gian", value: "all" },
                ]}
              />
            </div>

            {/* Filter 3: Từ ngày - Đến ngày */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Từ ngày</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Đến ngày</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            {/* Filter 4: Người thực hiện */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Người thực hiện</label>
              <Select
                value={actorFilter}
                onChange={setActorFilter}
                options={[
                  { label: "Tất cả người thực hiện", value: "all" },
                  { label: "Tôi (Thành viên)", value: "user" },
                  { label: "Hệ thống FoundMatch", value: "system" },
                ]}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleApplyFilter}
              className="justify-center text-xs font-bold bg-[#4A0E2E] hover:bg-[#3B0B24] text-white shadow-xs"
            >
              Áp dụng bộ lọc
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleResetFilter}
              className="justify-center text-xs text-slate-500 hover:text-slate-900"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Đặt lại bộ lọc
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
