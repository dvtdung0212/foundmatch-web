"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { magicLinkSchema } from "../schemas/auth.schema";
import type { AuthActionResult } from "@/types/auth.types";

/**
 * Đăng nhập bằng Magic Link Email
 */
export async function signInWithMagicLink(
  emailInput: string,
): Promise<AuthActionResult> {
  try {
    const validation = magicLinkSchema.safeParse({ email: emailInput });
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: validation.error.errors[0]?.message || "Email không hợp lệ",
        },
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: validation.data.email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: {
          code: error.code || "AUTH_ERROR",
          message: error.message,
        },
      };
    }

    return {
      success: true,
      message: "Mã OTP / Magic Link đã được gửi đến email của bạn.",
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: err instanceof Error ? err.message : "Đã xảy ra lỗi máy chủ",
      },
    };
  }
}
