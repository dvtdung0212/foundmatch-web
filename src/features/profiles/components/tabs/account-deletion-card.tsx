"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { requestWebAccountDeletion } from "@/features/auth/api/account-lifecycle-api";
import { AuthOperationSuccess } from "@/features/auth/components/auth-operation-success";
import { requestAccountDeletionSchema } from "@/features/auth/schemas/auth.schema";
import {
  FeedbackAlert,
  normalizeApiError,
  useZodFormValidation,
} from "@/features/feedback";

export function AccountDeletionCard() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [gracePeriodDays, setGracePeriodDays] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const validation = useZodFormValidation(requestAccountDeletionSchema);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const values = validation.validate({ currentPassword, confirmation });
    if (!values) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await requestWebAccountDeletion(values.currentPassword);
      setGracePeriodDays(result.gracePeriodDays);
      setOpen(false);
      setCompleted(true);
    } catch (cause) {
      const normalized = normalizeApiError(cause);
      if (normalized.fieldErrors.currentPassword?.[0]) {
        validation.setFieldErrors({
          currentPassword: normalized.fieldErrors.currentPassword[0],
        });
      } else {
        setError(normalized.message);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (completed) {
    return (
      <div className="rounded-[32px] border border-brand-border bg-white p-6 sm:p-8">
        <AuthOperationSuccess
          actionLabel="Về trang đăng nhập"
          description={`Tài khoản đã bị vô hiệu hóa và dự kiến được ẩn danh sau ${gracePeriodDays} ngày nếu không có nghĩa vụ đang mở. Bạn có thể đăng nhập lại trong thời gian chờ để nhận OTP khôi phục.`}
          destination="/login?deletionRequested=1"
          title="Đã tiếp nhận yêu cầu xóa tài khoản"
        />
      </div>
    );
  }

  return (
    <section
      aria-labelledby="account-deletion-title"
      className="rounded-[32px] border border-red-200 bg-white p-6 sm:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h3
              className="text-xl font-extrabold text-brand-heading"
              id="account-deletion-title"
            >
              Xóa tài khoản
            </h3>
            <p className="mt-1 max-w-xl text-[13px] font-medium leading-5 text-brand-muted">
              Tài khoản sẽ bị vô hiệu hóa ngay và chờ theo thời hạn chính sách
              (mặc định 30 ngày) trước khi dữ liệu cá nhân được ẩn danh. Lịch sử
              nghiệp vụ cần thiết vẫn được giữ để bảo vệ quyền sở hữu và giải
              quyết tranh chấp.
            </p>
          </div>
        </div>
        <Button
          className="shrink-0 bg-red-600 text-white hover:bg-red-700"
          onClick={() => setOpen(true)}
          type="button"
        >
          Yêu cầu xóa tài khoản
        </Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={(value) => !submitting && setOpen(value)}
      >
        <DialogContent maxWidth="max-w-lg">
          <form noValidate onSubmit={handleSubmit}>
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
                  <DialogDescription className="mt-2">
                    Sau khi xác nhận, mọi phiên đăng nhập sẽ bị thu hồi. Bạn chỉ
                    có thể mở lại tài khoản bằng OTP gửi tới email hiện tại
                    trong thời gian chờ.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-5">
              <FeedbackAlert error={error} onClose={() => setError(null)} />
              <Input
                autoComplete="current-password"
                error={validation.fieldErrors.currentPassword}
                label="Mật khẩu hiện tại"
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  validation.clearFieldError("currentPassword");
                }}
                placeholder="Nhập mật khẩu để xác nhận"
                type="password"
                value={currentPassword}
              />
              <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
                <Checkbox
                  checked={confirmation}
                  label="Tôi hiểu tài khoản sẽ bị vô hiệu hóa ngay và dữ liệu cá nhân sẽ được ẩn danh sau thời gian chờ."
                  onChange={(event) => {
                    setConfirmation(event.target.checked);
                    validation.clearFieldError("confirmation");
                  }}
                />
                {validation.fieldErrors.confirmation ? (
                  <p
                    className="mt-2 text-xs font-medium text-red-600"
                    role="alert"
                  >
                    {validation.fieldErrors.confirmation}
                  </p>
                ) : null}
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={submitting}
                onClick={() => setOpen(false)}
                type="button"
                variant="outline"
              >
                Hủy
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                loading={submitting}
                type="submit"
              >
                Xác nhận xóa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
