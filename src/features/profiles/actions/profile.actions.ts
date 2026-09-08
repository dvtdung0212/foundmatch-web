"use server";

import "server-only";
import { getServerApiClient } from "@/lib/api/server-client";
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
    const apiClient = await getServerApiClient();
    const { data: profileResponse, error: profileError } = await apiClient.GET(
      "/api/v1/public/users/me",
    );

    if (profileError || !profileResponse) {
      return {
        success: false,
        error: {
          code: "PROFILE_NOT_FOUND",
          message: "Không tìm thấy hồ sơ người dùng",
        },
      };
    }

    // backend returns CurrentUserResponseDto which extends UserResponseDto
    // mapping it to UserProfileDTO
    const dto: UserProfileDTO = {
      id: profileResponse.id,
      email: profileResponse.email,
      username: null, // Note: update backend if username is supported
      fullName: profileResponse.fullName,
      avatarUrl: profileResponse.avatarUrl,
      phone: profileResponse.phone,
      role: profileResponse.role as any,
      relayStatus: profileResponse.relayStatus as any,
      createdAt: profileResponse.createdAt,
      updatedAt: profileResponse.updatedAt,
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

    const updateData: Record<string, unknown> = {};

    if (validation.data.fullName !== undefined) {
      updateData.fullName = validation.data.fullName;
    }
    if (validation.data.avatarUrl !== undefined) {
      updateData.avatarUrl = validation.data.avatarUrl || null;
    }
    if (validation.data.phone !== undefined) {
      updateData.phone = validation.data.phone || null;
    }

    const apiClient = await getServerApiClient();
    const { data: updated, error: updateError } = await apiClient.PATCH(
      "/api/v1/public/users/me/profile",
      {
        body: updateData as any, // Cast because openapi-fetch types might complain if fields are strictly defined
      },
    );

    if (updateError || !updated) {
      return {
        success: false,
        error: {
          code: "UPDATE_FAILED",
          message:
            typeof updateError === "object" &&
            updateError !== null &&
            "message" in updateError
              ? (updateError.message as string)
              : "Cập nhật hồ sơ thất bại",
        },
      };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    const dto: UserProfileDTO = {
      id: updated.id,
      email: updated.email,
      username: null,
      fullName: updated.fullName,
      avatarUrl: updated.avatarUrl,
      phone: updated.phone,
      role: updated.role as any,
      relayStatus: updated.relayStatus as any,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
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
