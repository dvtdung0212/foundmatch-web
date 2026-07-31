import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-full bg-muted p-4 text-muted-foreground mb-4">
        <FileQuestion className="h-10 w-10" />
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight">
        404 — Không tìm thấy trang
      </h2>
      <p className="mt-2 text-muted-foreground max-w-md text-sm">
        Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
      >
        <Home className="h-4 w-4" /> Về trang chủ
      </Link>
    </div>
  );
}
