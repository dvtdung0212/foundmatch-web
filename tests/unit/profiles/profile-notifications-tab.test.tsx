import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("server-only", () => ({}));

const mockGetNotificationPreferencesAction = vi.fn();
const mockUpdateNotificationPreferenceAction = vi.fn();

vi.mock(
  "@/features/profiles/actions/notification-preferences.actions",
  () => ({
    getNotificationPreferencesAction: () =>
      mockGetNotificationPreferencesAction(),
    updateNotificationPreferenceAction: (input: any) =>
      mockUpdateNotificationPreferenceAction(input),
  }),
);

import { ProfileNotificationsTab } from "@/features/profiles/components/tabs/profile-notifications-tab";

describe("ProfileNotificationsTab", () => {
  const mockPreferences = [
    {
      category: "ACCOUNT_SECURITY",
      name: "Bảo mật & Tài khoản",
      description: "Cảnh báo đăng nhập mới, đổi mật khẩu",
      emailEnabled: true,
      inAppEnabled: true,
      isMandatory: true,
    },
    {
      category: "REPORT",
      name: "Báo cáo đồ vật",
      description: "Cập nhật tiến trình kiểm duyệt tin",
      emailEnabled: true,
      inAppEnabled: true,
      isMandatory: false,
    },
    {
      category: "COMMUNITY_NEWS",
      name: "Tin tức & Cộng đồng",
      description: "Tin tức cộng đồng và mẹo tìm đồ",
      emailEnabled: false,
      inAppEnabled: false,
      isMandatory: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially and then displays categories", async () => {
    mockGetNotificationPreferencesAction.mockResolvedValue({
      success: true,
      items: mockPreferences,
    });

    render(<ProfileNotificationsTab />);

    expect(
      screen.getByText("Đang tải tùy chọn thông báo của bạn..."),
    ).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("Cài đặt Thông báo")).toBeDefined();
      expect(screen.getByText("Bảo mật & Tài khoản")).toBeDefined();
      expect(screen.getByText("Báo cáo đồ vật")).toBeDefined();
      expect(screen.getByText("Tin tức & Cộng đồng")).toBeDefined();
    });

    // Check mandatory badge
    expect(screen.getByText("Bắt buộc")).toBeDefined();
  });

  it("disables switches for mandatory category ACCOUNT_SECURITY", async () => {
    mockGetNotificationPreferencesAction.mockResolvedValue({
      success: true,
      items: mockPreferences,
    });

    render(<ProfileNotificationsTab />);

    await waitFor(() => {
      expect(screen.getByText("Bảo mật & Tài khoản")).toBeDefined();
    });

    const securityEmailSwitch = screen.getByRole("switch", {
      name: /Bật\/tắt thông báo email cho Bảo mật & Tài khoản/i,
    });
    const securityInAppSwitch = screen.getByRole("switch", {
      name: /Bật\/tắt thông báo trên web cho Bảo mật & Tài khoản/i,
    });

    expect(securityEmailSwitch).toHaveProperty("disabled", true);
    expect(securityInAppSwitch).toHaveProperty("disabled", true);
    expect(securityEmailSwitch.getAttribute("aria-checked")).toBe("true");
  });

  it("allows toggling non-mandatory category and invokes action", async () => {
    mockGetNotificationPreferencesAction.mockResolvedValue({
      success: true,
      items: mockPreferences,
    });

    mockUpdateNotificationPreferenceAction.mockResolvedValue({
      success: true,
      items: [
        mockPreferences[0],
        { ...mockPreferences[1], emailEnabled: false },
        mockPreferences[2],
      ],
    });

    render(<ProfileNotificationsTab />);

    await waitFor(() => {
      expect(screen.getByText("Báo cáo đồ vật")).toBeDefined();
    });

    const reportEmailSwitch = screen.getByRole("switch", {
      name: /Bật\/tắt thông báo email cho Báo cáo đồ vật/i,
    });

    expect(reportEmailSwitch.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(reportEmailSwitch);

    await waitFor(() => {
      expect(mockUpdateNotificationPreferenceAction).toHaveBeenCalledWith({
        category: "REPORT",
        emailEnabled: false,
      });
      expect(screen.getByText("Đã lưu thay đổi")).toBeDefined();
    });
  });

  it("rolls back switch and displays feedback alert on error", async () => {
    mockGetNotificationPreferencesAction.mockResolvedValue({
      success: true,
      items: mockPreferences,
    });

    mockUpdateNotificationPreferenceAction.mockResolvedValue({
      success: false,
      error: {
        code: "SERVER_ERROR",
        message: "Máy chủ gặp sự cố khi lưu.",
      },
    });

    render(<ProfileNotificationsTab />);

    await waitFor(() => {
      expect(screen.getByText("Báo cáo đồ vật")).toBeDefined();
    });

    const reportEmailSwitch = screen.getByRole("switch", {
      name: /Bật\/tắt thông báo email cho Báo cáo đồ vật/i,
    });

    fireEvent.click(reportEmailSwitch);

    await waitFor(() => {
      expect(screen.getByText("Máy chủ gặp sự cố khi lưu.")).toBeDefined();
      // Rolled back to true
      expect(reportEmailSwitch.getAttribute("aria-checked")).toBe("true");
    });
  });
});
