"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("Application error captured:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-destructive/10 p-4 text-destructive mb-4">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">
        Đã xảy ra lỗi hệ thống
      </h2>
      <p className="mt-2 text-muted-foreground max-w-md text-sm">
        Ứng dụng gặp sự cố ngoài dự kiến. Vui lòng thử lại hoặc tải lại trang.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
      >
        <RefreshCw className="h-4 w-4" /> Thử lại
      </button>
    </div>
  );
}
