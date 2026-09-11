"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ActivityTimeline } from "@/components/ui/activity-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listUserActivity, type UserActivityCategory } from "../api/user-activity-api";

const filters: { label: string; value?: UserActivityCategory }[] = [
  { label: "Tất cả" },
  { label: "Tài khoản & bảo mật", value: "ACCOUNT_SECURITY" },
  { label: "Dữ liệu cá nhân", value: "PERSONAL_DATA" },
  { label: "Báo cáo đồ vật", value: "REPORT" },
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
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["user-activity", category, page],
    queryFn: () => listUserActivity({ category, page, pageSize: 20 }),
  });
  const data = query.data;
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 20)));

  return (
    <Card className="rounded-[32px]">
      <CardHeader className="items-start">
        <div>
          <CardTitle>Lịch sử hoạt động</CardTitle>
          <CardDescription className="mt-1">
            Các thay đổi thành công liên quan đến tài khoản và dữ liệu của bạn trong 12 tháng gần nhất.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex flex-wrap gap-2" aria-label="Lọc lịch sử hoạt động">
          {filters.map((filter) => (
            <Button
              key={filter.value ?? "all"}
              size="sm"
              variant={category === filter.value ? "primary" : "secondary"}
              onClick={() => { setCategory(filter.value); setPage(1); }}
            >
              {filter.label}
            </Button>
          ))}
        </div>
        {query.isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">Không thể tải lịch sử hoạt động.</p>
            <Button className="mt-4" size="sm" variant="secondary" onClick={() => query.refetch()}>Thử lại</Button>
          </div>
        ) : (
          <ActivityTimeline
            isLoading={query.isLoading}
            emptyText="Chưa có hoạt động nào trong nhóm này."
            items={(data?.items ?? []).map((event) => ({
              id: event.id,
              type: activityType(event.category),
              tag: categoryLabels[event.category],
              title: event.title,
              description: event.description,
              time: new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(event.createdAt)),
            }))}
          />
        )}
        {data && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <span className="text-xs font-semibold text-brand-muted">Trang {page}/{totalPages}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Trang trước</Button>
              <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)}>Trang sau</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
