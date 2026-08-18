"use client";

import { useState } from "react";
import { AlertTriangle, Lock, EyeOff } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CloseReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  actionType: "hide" | "close";
  onConfirm: (reason: string) => void;
}

export function CloseReportDialog({
  open,
  onOpenChange,
  reportTitle,
  actionType,
  onConfirm,
}: CloseReportDialogProps) {
  const [reason, setReason] = useState("");
  const isClose = actionType === "close";

  const handleConfirm = () => {
    onConfirm(reason);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-lost">
            {isClose ? <Lock className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            {isClose ? "Đóng bài đăng báo cáo" : "Tạm ẩn bài đăng báo cáo"}
          </DialogTitle>
          <DialogDescription>
            {isClose
              ? `Bạn có chắc muốn đóng báo cáo "${reportTitle}"? Báo cáo sẽ được lưu trữ và ngừng tìm kiếm khớp.`
              : `Báo cáo "${reportTitle}" sẽ tạm thời bị ẩn khỏi bảng tin công khai.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              {isClose
                ? "Sau khi đóng, bạn vẫn có thể xem lại lịch sử trong trang cá nhân nhưng không thể nhận thêm yêu cầu xác minh mới."
                : "Bạn có thể mở lại bài đăng bất cứ lúc nào trong trang quản lý cá nhân."}
            </p>
          </div>

          <Textarea
            label="Lý do (tùy chọn)"
            placeholder={isClose ? "Ví dụ: Đã tìm lại được đồ, không cần hỗ trợ nữa..." : "Nhập lý do tạm ẩn..."}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleConfirm}
            className={isClose ? "bg-brand-lost hover:bg-[#A32F2E]" : ""}
          >
            {isClose ? "Xác nhận đóng báo cáo" : "Xác nhận tạm ẩn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
