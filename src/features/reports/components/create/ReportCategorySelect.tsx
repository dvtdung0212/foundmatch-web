"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";

import type { ReportCategoryOption } from "../../api/owner-report-api";

type Props = {
  categories: ReportCategoryOption[];
  disabled?: boolean;
  error?: string;
  hasAnswers: boolean;
  isLoading: boolean;
  label: string;
  onChange: (categoryId: string) => void;
  value: string;
};

export function ReportCategorySelect({
  categories,
  disabled,
  error,
  hasAnswers,
  isLoading,
  label,
  onChange,
  value,
}: Props) {
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(
    null,
  );

  return (
    <>
      <Select
        label={label}
        required
        options={categories.map(({ id, name }) => ({ label: name, value: id }))}
        value={value}
        onChange={(nextCategoryId) => {
          if (value && nextCategoryId !== value && hasAnswers) {
            setPendingCategoryId(nextCategoryId);
            return;
          }
          onChange(nextCategoryId);
        }}
        error={error}
        disabled={isLoading || disabled}
        placeholder={isLoading ? "Đang tải danh mục..." : "Chọn danh mục"}
      />
      <Dialog
        open={pendingCategoryId !== null}
        onOpenChange={(open) => !open && setPendingCategoryId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi danh mục và nhập lại thuộc tính?</DialogTitle>
            <DialogDescription>
              Bộ thuộc tính phụ thuộc vào danh mục. Khi tiếp tục, toàn bộ câu
              trả lời thuộc tính hiện tại sẽ được xóa để tránh lưu dữ liệu sai
              cấu hình.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPendingCategoryId(null)}
            >
              Giữ danh mục hiện tại
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                if (pendingCategoryId) onChange(pendingCategoryId);
                setPendingCategoryId(null);
              }}
            >
              Đổi và xóa câu trả lời
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
