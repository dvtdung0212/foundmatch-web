const WEB_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: "Email này đã được sử dụng.",
  EMAIL_VERIFICATION_PENDING:
    "Email này đang chờ xác minh. Hãy tiếp tục với mã đã gửi.",
  EMAIL_VERIFICATION_REQUIRED: "Bạn cần xác minh email để tiếp tục.",
  INTERNAL_SERVER_ERROR: "Hệ thống gặp sự cố. Vui lòng thử lại sau.",
  INVALID_CREDENTIALS: "Email, tên đăng nhập hoặc mật khẩu không chính xác.",
  NETWORK_ERROR: "Không thể kết nối đến hệ thống. Vui lòng kiểm tra mạng và thử lại.",
  OTP_INVALID: "Mã xác minh không chính xác.",
  OTP_LOCKED: "Phiên xác minh đang tạm khóa do nhập sai quá nhiều lần.",
  OTP_VERIFICATION_NOT_FOUND: "Phiên xác minh không khả dụng hoặc đã hết hạn.",
  RATE_LIMIT_EXCEEDED: "Bạn thao tác quá nhanh. Vui lòng thử lại sau.",
  UNAUTHORIZED: "Bạn cần đăng nhập để tiếp tục.",
  USERNAME_ALREADY_EXISTS: "Tên đăng nhập này đã được sử dụng.",
  VALIDATION_FAILED: "Thông tin đã nhập chưa hợp lệ.",
};

export function translateWebError(code: string): string | undefined {
  return WEB_ERROR_MESSAGES[code];
}

