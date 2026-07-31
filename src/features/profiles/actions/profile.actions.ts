"use server";

import "server-only";
import { createClient } from "@/lib/supabase/server";
import { updateProfileSchema } from "../schemas/profile.schema";
import type { UserProfileDTO, UpdateProfileInput } from "@/types/profile.types";
import type { AuthActionResult } from "@/types/auth.types";
import { revalidatePath } from "next/cache";

/**
 * Lấy Profile của User hiện tại đang đăng nhập
 */
export async function getCurrentProfile(): Promise<
  AuthActionResult<UserProfileDTO | null>
> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: true,
        data: null,
      };
    }

    const { data: profile, error: profileError } = await supabase
      .schema("foundmatch_schema")
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Không tìm thấy hồ sơ người dùng",
        },
      };
    }

    const dto: UserProfileDTO = {
      id: profile.id,
      email: profile.email,
      username: profile.username || null,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      phone: profile.phone,
      role: profile.role,
      relayStatus: profile.relay_status,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };

    return {
      success: true,
      data: dto,
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
 * Cập nhật thông tin cá nhân (fullName, avatarUrl, phone)
 */
export async function updateProfile(
  input: UpdateProfileInput,
): Promise<AuthActionResult<UserProfileDTO>> {
  try {
    const validation = updateProfileSchema.safeParse(input);
    if (!validation.success) {
      return {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message:
            validation.error.errors[0]?.message ||
            "Thông tin nhập không hợp lệ",
        },
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Bạn chưa đăng nhập",
        },
      };
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (validation.data.fullName !== undefined) {
      updateData.full_name = validation.data.fullName;
    }
    if (validation.data.avatarUrl !== undefined) {
      updateData.avatar_url = validation.data.avatarUrl || null;
    }
    if (validation.data.phone !== undefined) {
      updateData.phone = validation.data.phone || null;
    }

    const { data: updated, error: updateError } = await supabase
      .schema("foundmatch_schema")
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select("*")
      .single();

    if (updateError || !updated) {
      return {
        success: false,
        error: {
          code: "UPDATE_FAILED",
          message: updateError?.message || "Cập nhật hồ sơ thất bại",
        },
      };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    const dto: UserProfileDTO = {
      id: updated.id,
      email: updated.email,
      username: updated.username || null,
      fullName: updated.full_name,
      avatarUrl: updated.avatar_url,
      phone: updated.phone,
      role: updated.role,
      relayStatus: updated.relay_status,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
    };

    return {
      success: true,
      message: "Cập nhật hồ sơ cá nhân thành công!",
      data: dto,
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
