"use client";

import { useState } from "react";
import { LoginForm } from "./login-form";
import { ShieldCheck, X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  nextUrl?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  title = "Yêu cầu đăng nhập",
  subtitle = "Đăng nhập để thực hiện các thao tác báo mất/nhặt đồ, gửi claim hoặc bàn giao an toàn.",
  nextUrl,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-card border border-border rounded-2xl shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* LoginForm */}
        <div className="pt-2">
          <LoginForm onSuccess={onClose} nextUrl={nextUrl} />
        </div>
      </div>
    </div>
  );
}
