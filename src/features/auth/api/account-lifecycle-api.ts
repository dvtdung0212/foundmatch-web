import { callApi } from "@/features/feedback";
import { getApiClient } from "@/lib/api/client";

export function requestWebAccountDeletion(currentPassword: string) {
  return callApi(
    () =>
      getApiClient().POST("/api/v1/public/users/me/account-deletion", {
        body: { confirmation: true, currentPassword },
      }),
    {
      emptyMessage: "Hệ thống không trả về thông tin yêu cầu xóa tài khoản.",
      fallback: "Không thể gửi yêu cầu xóa tài khoản.",
    },
  );
}

export function getWebAccountReactivation(verificationId: string) {
  return callApi(
    () =>
      getApiClient().GET(
        "/api/v1/public/web-auth/account-reactivation/{verificationId}",
        { params: { path: { verificationId } } },
      ),
    {
      emptyMessage: "Không tìm thấy phiên khôi phục tài khoản.",
      fallback: "Không thể tải phiên khôi phục tài khoản.",
    },
  );
}

export function resendWebAccountReactivation(verificationId: string) {
  return callApi(
    () =>
      getApiClient().POST(
        "/api/v1/public/web-auth/account-reactivation/resend",
        { body: { verificationId } },
      ),
    {
      emptyMessage: "Hệ thống không trả về phiên OTP mới.",
      fallback: "Không thể gửi lại mã khôi phục.",
    },
  );
}

export function verifyWebAccountReactivation(input: {
  code: string;
  verificationId: string;
}) {
  return callApi(
    () =>
      getApiClient().POST(
        "/api/v1/public/web-auth/account-reactivation/verify",
        {
          body: {
            code: input.code,
            confirmation: true,
            verificationId: input.verificationId,
          },
        },
      ),
    {
      emptyMessage: "Hệ thống không xác nhận kết quả khôi phục.",
      fallback: "Không thể khôi phục tài khoản.",
    },
  );
}
