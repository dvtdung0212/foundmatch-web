"use client";

import { useState } from "react";
import { Share2, Copy, Check, QrCode, Facebook, Send, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportCode: string;
  reportTitle: string;
}

export function ShareReportDialog({
  open,
  onOpenChange,
  reportCode,
  reportTitle,
}: ShareReportDialogProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/reports/${reportCode}` : `https://foundmatch.vn/reports/${reportCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-brand-plum" />
            Chia sẻ báo cáo
          </DialogTitle>
          <DialogDescription>
            Chia sẻ lên mạng xã hội hoặc sao chép link để cộng đồng cùng hỗ trợ tìm kiếm.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Simulated QR Code Box */}
          <div className="flex flex-col items-center justify-center p-4 bg-brand-cream/40 rounded-2xl border border-brand-border text-center space-y-2">
            <div className="w-32 h-32 bg-white rounded-xl p-2.5 border border-brand-border shadow-xs flex items-center justify-center">
              <QrCode className="w-24 h-24 text-brand-heading" />
            </div>
            <div className="text-xs font-mono font-bold text-brand-plum">{reportCode}</div>
            <p className="text-[11px] text-brand-muted">Quét mã QR để truy cập trực tiếp bài đăng</p>
          </div>

          {/* Copy Link Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-heading">Đường dẫn bài đăng</label>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="text-xs font-mono text-brand-muted select-all" />
              <Button
                variant={copied ? "primary" : "secondary"}
                type="button"
                onClick={handleCopy}
                className="shrink-0 gap-1.5 text-xs px-3"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Đã chép" : "Sao chép"}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-brand-heading">Chia sẻ nhanh qua mạng xã hội</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")}
                className="p-2.5 rounded-xl border border-brand-border hover:bg-brand-cream text-xs font-semibold text-brand-heading flex flex-col items-center gap-1 transition-all"
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <span>Facebook</span>
              </button>
              <button
                type="button"
                onClick={() => window.open(`https://zalo.me/share?url=${encodeURIComponent(shareUrl)}`, "_blank")}
                className="p-2.5 rounded-xl border border-brand-border hover:bg-brand-cream text-xs font-semibold text-brand-heading flex flex-col items-center gap-1 transition-all"
              >
                <Globe className="w-5 h-5 text-[#0068FF]" />
                <span>Zalo</span>
              </button>
              <button
                type="button"
                onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(reportTitle)}`, "_blank")}
                className="p-2.5 rounded-xl border border-brand-border hover:bg-brand-cream text-xs font-semibold text-brand-heading flex flex-col items-center gap-1 transition-all"
              >
                <Send className="w-5 h-5 text-[#229ED9]" />
                <span>Telegram</span>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" type="button" onClick={() => onOpenChange(false)} className="w-full">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
