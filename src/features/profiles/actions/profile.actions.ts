"use server";

import "server-only";
import { getServerApiClient } from "@/lib/api/server-client";
import type { components } from "@/lib/api/generated/schema";
import { updateProfileSchema } from "../schemas/profile.schema";
import type { UserProfileDTO, UpdateProfileInput } from "@/types/profile.types";
import type {
  AuthActionResult,
  RelayMemberStatus,
  UserRole,
} from "@/types/auth.types";

type OwnerProfileResponse = components["schemas"]["OwnerProfileResponseDto"];
type UpdateProfileRequest = components["schemas"]["UpdateProfileDto"];

const USER_ROLES: readonly UserRole[] = [
  "guest",
  "user",
  "relay_member",
  "moderator",
  "admin",
];

const RELAY_MEMBER_STATUSES: readonly RelayMemberStatus[] = [
  "none",
  "pending",
  "approved",
  "rejected",
  "suspended",
];

function isUserRole(value: string): value is UserRole {
  return USER_ROLES.includes(value as UserRole);
}

function isRelayMemberStatus(value: string): value is RelayMemberStatus {
  return RELAY_MEMBER_STATUSES.includes(value as RelayMemberStatus);
}

function mapOwnerProfile(profile: OwnerProfileResponse): UserProfileDTO {
  return {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    fullName: profile.fullName,
    avatarUrl: profile.avatarUrl,
    avatarMediaAssetId: profile.avatarMediaAssetId,
    phone: profile.phone,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    address: profile.address,
    addressLine: profile.addressLine,
    country: profile.country,
    countryCode: profile.countryCode,
    administrativeAreaLevel1Id: profile.administrativeAreaLevel1Id,
    administrativeAreaLevel2Id: profile.administrativeAreaLevel2Id,
    localityGeographyId: profile.localityGeographyId,
    occupation: profile.occupation,
    role: isUserRole(profile.role) ? profile.role : "user",
    relayStatus: isRelayMemberStatus(profile.relayStatus)
      ? profile.relayStatus
      : "none",
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

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

    return {
      success: true,
      data: mapOwnerProfile(profileResponse),
    };
  } catch {
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Không thể tải hồ sơ lúc này. Vui lòng thử lại.",
      },
    };
  }
}

/**
 * Cập nhật các trường hồ sơ chủ tài khoản được phép chỉnh sửa.
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
          details: {
            fieldErrors: validation.error.flatten().fieldErrors,
          },
        },
      };
    }

    const updateData: UpdateProfileRequest = {};

    if (validation.data.fullName !== undefined) {
      updateData.fullName = validation.data.fullName;
    }
    if (validation.data.phone !== undefined) {
      updateData.phone = validation.data.phone || null;
    }
    if (validation.data.dateOfBirth !== undefined) {
      updateData.dateOfBirth = validation.data.dateOfBirth || null;
    }
    if (validation.data.gender !== undefined) {
      updateData.gender = validation.data.gender;
    }
    if (validation.data.addressLine !== undefined) {
      updateData.addressLine = validation.data.addressLine || null;
    }
    if (validation.data.countryCode !== undefined) {
      updateData.countryCode = validation.data.countryCode || null;
    }
    if (validation.data.administrativeAreaLevel1Id !== undefined) {
      updateData.administrativeAreaLevel1Id =
        validation.data.administrativeAreaLevel1Id;
    }
    if (validation.data.administrativeAreaLevel2Id !== undefined) {
      updateData.administrativeAreaLevel2Id =
        validation.data.administrativeAreaLevel2Id;
    }
    if (validation.data.localityGeographyId !== undefined) {
      updateData.localityGeographyId = validation.data.localityGeographyId;
    }
    if (validation.data.occupation !== undefined) {
      updateData.occupation = validation.data.occupation || null;
    }

    const apiClient = await getServerApiClient();
    const {
      data: updated,
      error: updateError,
      response,
    } = await apiClient.PATCH("/api/v1/public/users/me/profile", {
      body: updateData,
    });

    if (updateError || !updated) {
      return {
        success: false,
        error: {
          code: updateError?.code ?? "UPDATE_FAILED",
          message: updateError?.message ?? "Cập nhật hồ sơ thất bại",
          details: updateError?.details,
          requestId: updateError?.requestId,
          status: response.status,
        },
      };
    }

    return {
      success: true,
      message: "Cập nhật hồ sơ cá nhân thành công!",
      data: mapOwnerProfile(updated),
    };
  } catch {
    return {
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Không thể cập nhật hồ sơ lúc này. Vui lòng thử lại.",
      },
    };
  }
}
