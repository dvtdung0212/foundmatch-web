"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  magicLinkSchema,
  signUpSchema,
  type SignUpInput,
} from "../schemas/auth.schema";
import type { AuthActionResult, AuthSessionUser } from "@/types/auth.types";
import { revalidatePath } from "next/cache";

/**
 * Đăng ký tài khoản mới bằng Email/Username + Password
 */
export async function signUpWithPassword(
  input: SignUpInput,
): Promise<AuthActionResult<AuthSessionUser>> {
  try {
    const validation = signUpSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            validation.error.errors[0]?.message ||
            "Thông tin đăng ký không hợp lệ",
        },
      };
    }

    const { email, username, fullName, password } = validation.data;
    const adminClient = createAdminClient();

    // 1. Kiểm tra Username trùng lặp trong foundmatch_schema.profiles
    const { data: existingUsername } = await adminClient
      .schema("foundmatch_schema")
      .from("profiles")
      .select("id")
      .ilike("username", username)
      .maybeSingle();

    if (existingUsername) {
      return {
        success: false,
        error: {
          code: "USERNAME_TAKEN",
          message: "Username này đã được người khác sử dụng.",
        },
      };
    }

    // 2. Gọi Supabase Auth SignUp
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.toLowerCase(),
          full_name: fullName,
        },
      },
    });

    if (error || !data.user) {
      return {
        success: false,
        error: {
          code: error?.code || "SIGN_UP_FAILED",
          message: error?.message || "Đăng ký thất bại",
        },
      };
    }

    revalidatePath("/", "layout");

    return {
      success: true,
      message: "Đăng ký tài khoản thành công!",
      data: {
        id: data.user.id,
        email: data.user.email!,
        role: "user",
        fullName,
      },
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
