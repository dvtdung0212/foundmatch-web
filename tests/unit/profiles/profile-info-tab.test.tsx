import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/features/profiles/actions/profile.actions", () => ({
  updateProfile: vi.fn(),
}));
vi.mock("@/features/geography/actions/geography.actions", () => ({
  getPublicProvinces: vi.fn(),
  getPublicWards: vi.fn(),
}));

import {
  getPublicProvinces,
  getPublicWards,
} from "@/features/geography/actions/geography.actions";
import { updateProfile } from "@/features/profiles/actions/profile.actions";
import { ProfileInfoTab } from "@/features/profiles/components/tabs/profile-info-tab";
import type { UserProfileDTO } from "@/types/profile.types";

const PROVINCE_ID = "22222222-2222-4222-8222-222222222222";
const WARD_ID = "33333333-3333-4333-8333-333333333333";

const profile: UserProfileDTO = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "user@example.com",
  username: "nguyenvana",
  fullName: "Nguyễn Văn A",
  avatarUrl: null,
  avatarMediaAssetId: null,
  phone: "0901234567",
  dateOfBirth: null,
  gender: "prefer_not_to_say",
  address: null,
  addressLine: null,
  country: "Việt Nam",
  countryCode: "VN",
  administrativeAreaLevel1Id: null,
  administrativeAreaLevel2Id: null,
  localityGeographyId: null,
  occupation: null,
  role: "user",
  relayStatus: "none",
  createdAt: "2026-01-01T00:00:00Z",
  updatedAt: "2026-01-01T00:00:00Z",
};

describe("ProfileInfoTab", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getPublicProvinces).mockResolvedValue([
      { id: PROVINCE_ID, code: "01", name: "Hà Nội" },
    ]);
    vi.mocked(getPublicWards).mockResolvedValue([
      {
        id: WARD_ID,
        code: "00001",
        name: "Phường Ba Đình",
        parentId: PROVINCE_ID,
      },
    ]);
    vi.mocked(updateProfile).mockResolvedValue({
      success: true,
      data: {
        ...profile,
        addressLine: "24 Đặng Tất",
        administrativeAreaLevel1Id: PROVINCE_ID,
        localityGeographyId: WARD_ID,
      },
    });
  });

  it("requires confirmation and submits structured geography identifiers", async () => {
    render(<ProfileInfoTab profile={profile} />);

    fireEvent.click(screen.getByRole("button", { name: /Chỉnh sửa/i }));
    const provinceInput = screen.getByLabelText("Tỉnh / Thành phố");
    await waitFor(() => expect(getPublicProvinces).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(provinceInput.hasAttribute("disabled")).toBe(false),
    );
    fireEvent.focus(provinceInput);
    fireEvent.click(await screen.findByText("Hà Nội"));

    await waitFor(() =>
      expect(getPublicWards).toHaveBeenCalledWith(PROVINCE_ID),
    );

    fireEvent.focus(screen.getByLabelText("Phường / Xã"));
    fireEvent.click(await screen.findByText("Phường Ba Đình"));
    fireEvent.change(screen.getByLabelText("Địa chỉ cụ thể"), {
      target: { value: "24 Đặng Tất" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Lưu$/i }));

    expect(updateProfile).not.toHaveBeenCalled();
    expect(await screen.findByText("Xác nhận cập nhật hồ sơ")).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: /Xác nhận lưu/i }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          addressLine: "24 Đặng Tất",
          administrativeAreaLevel1Id: PROVINCE_ID,
          administrativeAreaLevel2Id: null,
          countryCode: "VN",
          localityGeographyId: WARD_ID,
        }),
      );
    });

    const submitted = vi.mocked(updateProfile).mock.calls[0]?.[0];
    expect(submitted).not.toHaveProperty("address");
  });

  it("does not mutate profile data when confirmation is cancelled", async () => {
    render(<ProfileInfoTab profile={profile} />);

    fireEvent.click(screen.getByRole("button", { name: /Chỉnh sửa/i }));
    fireEvent.change(screen.getByLabelText("Họ và tên"), {
      target: { value: "Nguyễn Văn B" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Lưu$/i }));
    fireEvent.click(screen.getByRole("button", { name: /^Hủy$/i }));

    await waitFor(() => {
      expect(screen.queryByText("Xác nhận cập nhật hồ sơ")).toBeNull();
    });
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("shows Zod validation only after submission and skips confirmation", async () => {
    render(<ProfileInfoTab profile={profile} />);

    fireEvent.click(screen.getByRole("button", { name: /Chỉnh sửa/i }));
    fireEvent.change(screen.getByLabelText("Họ và tên"), {
      target: { value: "A" },
    });

    expect(screen.queryByText("Họ tên phải có ít nhất 2 ký tự")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^Lưu$/i }));

    expect(
      await screen.findByText("Họ tên phải có ít nhất 2 ký tự"),
    ).toBeDefined();
    expect(screen.queryByText("Xác nhận cập nhật hồ sơ")).toBeNull();
    expect(updateProfile).not.toHaveBeenCalled();
  });

  it("maps backend field errors to the related input", async () => {
    vi.mocked(updateProfile).mockResolvedValueOnce({
      success: false,
      error: {
        code: "PROFILE_PHONE_ALREADY_USED",
        message: "Số điện thoại đã được sử dụng.",
        details: {
          fieldErrors: {
            phone: ["Số điện thoại đã được sử dụng."],
          },
        },
        requestId: "request-profile-1",
        status: 409,
      },
    });
    render(<ProfileInfoTab profile={profile} />);

    fireEvent.click(screen.getByRole("button", { name: /Chỉnh sửa/i }));
    fireEvent.change(screen.getByLabelText("Số điện thoại"), {
      target: { value: "0909999999" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Lưu$/i }));
    fireEvent.click(
      await screen.findByRole("button", { name: /Xác nhận lưu/i }),
    );

    expect(await screen.findByText("Số điện thoại chưa hợp lệ.")).toBeDefined();
    expect(updateProfile).toHaveBeenCalledOnce();
  });
});
