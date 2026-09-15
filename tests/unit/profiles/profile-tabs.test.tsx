import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("server-only", () => ({}));
vi.mock("@/features/profiles/actions/profile.actions", () => ({
  updateProfile: vi.fn(),
}));
vi.mock("@/features/geography/actions/geography.actions", () => ({
  getPublicProvinces: vi.fn().mockResolvedValue([]),
  getPublicWards: vi.fn().mockResolvedValue([]),
}));
vi.mock("@/features/activity/components/user-activity-panel", () => ({
  UserActivityPanel: () => (
    <div data-testid="user-activity-panel">Lịch sử hoạt động mock</div>
  ),
}));
vi.mock(
  "@/features/profiles/actions/notification-preferences.actions",
  () => ({
    getNotificationPreferencesAction: vi.fn().mockResolvedValue({
      success: true,
      items: [],
    }),
    updateNotificationPreferenceAction: vi.fn(),
  }),
);

import { ProfileForm } from "@/features/profiles/components/profile-form";
import type { UserProfileDTO } from "@/types/profile.types";

describe("Profile Tabs and Modular Components", () => {
  const mockProfile: UserProfileDTO = {
    id: "usr-123",
    email: "user@example.com",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    avatarUrl: null,
    avatarMediaAssetId: null,
    phone: "0901234567",
    address: "Hà Nội - Phường Dịch Vọng Hậu - Số 10 Cầu Giấy",
    addressLine: null,
    country: null,
    countryCode: null,
    administrativeAreaLevel1Id: null,
    administrativeAreaLevel2Id: null,
    localityGeographyId: null,
    occupation: null,
    role: "USER" as any,
    relayStatus: "NONE" as any,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };

  it("renders all 4 tabs in TabsList", () => {
    render(<ProfileForm profile={mockProfile} />);

    expect(screen.getByRole("button", { name: /Thông tin cá nhân/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Bảo mật/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Thông báo/i })).toBeDefined();
    expect(screen.getByRole("button", { name: /Lịch sử hoạt động/i })).toBeDefined();
  });

  it("renders ProfileInfoTab by default (defaultValue='info')", () => {
    render(<ProfileForm profile={mockProfile} />);

    expect(screen.getByText("Minh bạch quyền riêng tư")).toBeDefined();
    expect(screen.getByText("Nguyễn Văn A")).toBeDefined();

    // Chuyển sang chế độ chỉnh sửa sẽ xuất hiện input
    const editBtn = screen.getByRole("button", { name: /Chỉnh sửa/i });
    fireEvent.click(editBtn);
    expect(screen.getByDisplayValue("Nguyễn Văn A")).toBeDefined();
  });

  it("instantly switches to ProfileSecurityTab without URL latency", () => {
    render(<ProfileForm profile={mockProfile} />);

    const securityBtn = screen.getByRole("button", { name: /Bảo mật/i });
    fireEvent.click(securityBtn);

    expect(screen.getByText("Trung tâm Bảo mật")).toBeDefined();
  });

  it("instantly switches to ProfileNotificationsTab without URL latency", async () => {
    render(<ProfileForm profile={mockProfile} />);

    const notifBtn = screen.getByRole("button", { name: /Thông báo/i });
    fireEvent.click(notifBtn);

    await waitFor(() => {
      expect(screen.getByText("Cài đặt Thông báo")).toBeDefined();
    });
  });

  it("instantly switches to ProfileActivityTab without URL latency", () => {
    render(<ProfileForm profile={mockProfile} />);

    const activityBtn = screen.getByRole("button", { name: /Lịch sử hoạt động/i });
    fireEvent.click(activityBtn);

    expect(screen.getByTestId("user-activity-panel")).toBeDefined();
  });
});
