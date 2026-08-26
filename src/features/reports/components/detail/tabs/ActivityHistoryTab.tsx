"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  FileImage,
  Filter,
  PlusCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { OwnerReportView } from "../../../api/owner-report-view";

interface ActivityHistoryTabProps {
  report: OwnerReportView;
}

interface TimelineItem {
  id: string;
  type: "create" | "edit" | "media" | "system" | "view" | "verify";
  title: string;
  description: string;
  actorName: string;
  actorRole: string;
  actorAvatar?: string;
  isSystem?: boolean;
  time: string;
}

const DEFAULT_TIMELINE_EVENTS: TimelineItem[] = [
  {
    id: "act-1",
    type: "create",
    title: "Tạo báo cáo",
    description: "Báo cáo thất lạc được tạo thành công.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "20/05/2024 10:30",
  },
  {
    id: "act-2",
    type: "edit",
    title: "Cập nhật mô tả",
    description: "Cập nhật mô tả báo cáo.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "20/05/2024 10:45",
  },
  {
    id: "act-3",
    type: "media",
    title: "Thêm ảnh",
    description: "Đã thêm 3 ảnh cho báo cáo.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "20/05/2024 10:48",
  },
  {
    id: "act-4",
    type: "system",
    title: "Hệ thống",
    description: "Hệ thống đã tạo kết quả khớp dựa trên thông tin hiện có.",
    actorName: "Hệ thống FoundMatch",
    actorRole: "Hệ thống",
    isSystem: true,
    time: "20/05/2024 18:05",
  },
  {
    id: "act-5",
    type: "view",
    title: "Xem kết quả khớp",
    description: "Người dùng đã xem kết quả khớp.",
    actorName: "Nguyễn Thu Minh",
    actorRole: "Thành viên",
    actorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    time: "21/05/2024 09:12",
  },
  {
    id: "act-6",
    type: "verify",
    title: "Bổ sung xác minh",
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

  const [filteredEvents, setFilteredEvents] = useState<TimelineItem[]>(DEFAULT_TIMELINE_EVENTS);

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

  const getEventIcon = (type: TimelineItem["type"]) => {
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
    }
  };

  const getBadgeStyle = (type: TimelineItem["type"]) => {
    switch (type) {
      case "create":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "edit":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "media":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "system":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "view":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "verify":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column (8 cols): Timeline List */}
      <div className="lg:col-span-8 space-y-4 text-left">
        <div className="rounded-2xl border border-brand-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-brand-border/40 pb-3">
            <h2 className="text-base font-bold text-brand-heading">
              Dòng sự kiện hoạt động
            </h2>
            <span className="text-xs text-brand-muted">
              Hiển thị {filteredEvents.length} sự kiện
            </span>
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-4 relative pl-3 sm:pl-4 border-l-2 border-slate-200">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="relative pl-6 py-2 group"
              >
                {/* Bullet node on timeline border */}
                <div className="absolute -left-[19px] sm:-left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-white border-2 border-brand-plum ring-4 ring-brand-soft/60" />

                {/* Event Card */}
                <div className="rounded-xl border border-brand-border/70 bg-white p-4 shadow-2xs hover:border-brand-plum/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getBadgeStyle(event.type)}`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getBadgeStyle(event.type)}`}>
                          {event.title}
                        </span>
                      </div>
                      <p className="text-xs text-brand-heading font-medium leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  {/* Actor and Timestamp */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-brand-border/30 text-right">
                    <div className="flex items-center gap-2">
                      {event.isSystem ? (
                        <div className="w-7 h-7 rounded-full bg-brand-plum text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                          FM
                        </div>
                      ) : (
                        <img
                          src={event.actorAvatar}
                          alt={event.actorName}
                          className="w-7 h-7 rounded-full object-cover border border-brand-border"
                        />
                      )}
                      <div className="text-left sm:text-right">
                        <p className="text-xs font-bold text-brand-heading leading-tight">{event.actorName}</p>
                        <p className="text-[10px] text-brand-muted">{event.actorRole}</p>
                      </div>
                    </div>

                    <span className="text-[11px] text-brand-muted font-mono font-medium shrink-0">
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (4 cols): Filter Card */}
      <div className="lg:col-span-4 space-y-4 text-left">
        <div className="rounded-2xl border border-brand-border/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-brand-heading font-bold text-sm border-b border-brand-border/40 pb-3">
            <Filter className="w-4 h-4 text-brand-plum" />
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
          <div className="space-y-2 pt-2 border-t border-brand-border/40">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleApplyFilter}
              className="justify-center text-xs font-bold bg-brand-plum hover:bg-brand-plumDark text-white shadow-xs"
            >
              Áp dụng bộ lọc
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleResetFilter}
              className="justify-center text-xs text-brand-muted hover:text-brand-heading"
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
