import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("server-only", () => ({}));

const getWebSessionsMock = vi.fn();
const revokeWebSessionMock = vi.fn();
const revokeOtherWebSessionsMock = vi.fn();

vi.mock("@/features/profiles/actions/security.actions", () => ({
  getWebSessionsAction: () => getWebSessionsMock(),
  revokeWebSessionAction: (id: string) => revokeWebSessionMock(id),
  revokeOtherWebSessionsAction: () => revokeOtherWebSessionsMock(),
}));

import { DeviceSessionsCard } from "@/features/profiles/components/tabs/device-sessions-card";

describe("DeviceSessionsCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders single real active session when API returns 1 session", async () => {
    getWebSessionsMock.mockResolvedValue({
      success: true,
      sessions: [
        {
          id: "sess-current",
          deviceName: 'MacBook Pro 16" (macOS)',
          clientName: "Safari 17",
          location: "TP. Hồ Chí Minh, Việt Nam",
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "laptop",
        },
      ],
    });

    render(<DeviceSessionsCard />);

    await waitFor(() => {
      expect(screen.getByText("Thiết bị đã đăng nhập (1)")).toBeDefined();
      expect(screen.getByText('MacBook Pro 16" (macOS)')).toBeDefined();
      expect(screen.getByText("Thiết bị hiện tại")).toBeDefined();
      expect(
        screen.getByText(/Safari 17 · TP\. Hồ Chí Minh, Việt Nam/),
      ).toBeDefined();
    });

    // Should NOT contain any fake mock devices
    expect(screen.queryByText(/iPhone 14 Pro/i)).toBeNull();
    expect(screen.queryByText(/Windows PC/i)).toBeNull();
  });

  it("renders multiple real active sessions when API returns multiple devices", async () => {
    getWebSessionsMock.mockResolvedValue({
      success: true,
      sessions: [
        {
          id: "sess-1",
          deviceName: 'MacBook Pro 16" (macOS)',
          clientName: "Safari 17",
          location: null,
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "laptop",
        },
        {
          id: "sess-2",
          deviceName: "Samsung Galaxy S24 (Android 14)",
          clientName: "Chrome 125",
          location: "Đà Nẵng, Việt Nam",
          createdAt: "2026-09-10T08:00:00Z",
          lastSeenAt: "2026-09-10T08:00:00Z",
          isCurrent: false,
          deviceType: "phone",
        },
      ],
    });

    render(<DeviceSessionsCard />);

    await waitFor(() => {
      expect(screen.getByText("Thiết bị đã đăng nhập (2)")).toBeDefined();
      expect(screen.getByText('MacBook Pro 16" (macOS)')).toBeDefined();
      expect(screen.getByText("Thiết bị hiện tại")).toBeDefined();
      expect(screen.getByText("Samsung Galaxy S24 (Android 14)")).toBeDefined();
      expect(
        screen.getByText(/Chrome 125 · Đà Nẵng, Việt Nam/),
      ).toBeDefined();
    });
  });

  it("has accessible list semantics and role attributes", async () => {
    getWebSessionsMock.mockResolvedValue({
      success: true,
      sessions: [
        {
          id: "sess-1",
          deviceName: "Windows PC (Windows 11)",
          clientName: "Chrome 125",
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "desktop",
        },
      ],
    });

    render(<DeviceSessionsCard />);

    await waitFor(() => {
      const list = screen.getByRole("list", { name: "Danh sách thiết bị đã đăng nhập" });
      expect(list).toBeDefined();

      const items = screen.getAllByRole("listitem");
      expect(items.length).toBe(1);
    });
  });

  it("opens modal and revokes a session successfully", async () => {
    getWebSessionsMock.mockResolvedValue({
      success: true,
      sessions: [
        {
          id: "sess-1",
          deviceName: "Windows PC (Windows 11)",
          clientName: "Edge 124",
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "desktop",
        },
        {
          id: "sess-2",
          deviceName: "iPad Pro (iPadOS 17)",
          clientName: "Safari 17",
          createdAt: "2026-09-11T08:00:00Z",
          lastSeenAt: "2026-09-11T08:00:00Z",
          isCurrent: false,
          deviceType: "laptop",
        },
      ],
    });

    revokeWebSessionMock.mockResolvedValue({
      success: true,
      message: "Đã đăng xuất thiết bị thành công.",
    });

    render(<DeviceSessionsCard />);

    await waitFor(() => {
      expect(screen.getByText("Thiết bị đã đăng nhập (2)")).toBeDefined();
    });

    const logoutBtn = screen.getByRole("button", { name: /Đăng xuất khỏi iPad Pro/i });
    fireEvent.click(logoutBtn);

    // Modal opens
    await waitFor(() => {
      expect(screen.getByText("Đăng xuất khỏi thiết bị?")).toBeDefined();
    });

    const confirmBtn = screen.getByRole("button", { name: "Đăng xuất" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(revokeWebSessionMock).toHaveBeenCalledWith("sess-2");
      expect(screen.getByText("Đã đăng xuất thiết bị thành công.")).toBeDefined();
      expect(screen.getByText("Thiết bị đã đăng nhập (1)")).toBeDefined();
    });
  });

  it("displays error feedback when revoking fails", async () => {
    getWebSessionsMock.mockResolvedValue({
      success: true,
      sessions: [
        {
          id: "sess-1",
          deviceName: "Windows PC (Windows 11)",
          clientName: "Edge 124",
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "desktop",
        },
        {
          id: "sess-2",
          deviceName: "iPad Pro (iPadOS 17)",
          clientName: "Safari 17",
          createdAt: "2026-09-11T08:00:00Z",
          lastSeenAt: "2026-09-11T08:00:00Z",
          isCurrent: false,
          deviceType: "laptop",
        },
      ],
    });

    revokeWebSessionMock.mockResolvedValue({
      success: false,
      error: { message: "Không thể thu hồi phiên này." },
    });

    render(<DeviceSessionsCard />);

    await waitFor(() => {
      expect(screen.getByText("Thiết bị đã đăng nhập (2)")).toBeDefined();
    });

    const logoutBtn = screen.getByRole("button", { name: /Đăng xuất khỏi iPad Pro/i });
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getByText("Đăng xuất khỏi thiết bị?")).toBeDefined();
    });

    const confirmBtn = screen.getByRole("button", { name: "Đăng xuất" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText("Không thể thu hồi phiên này.")).toBeDefined();
      expect(screen.getByText("Thiết bị đã đăng nhập (2)")).toBeDefined();
    });
  });

  it("refetches active sessions when refresh button is clicked", async () => {
    getWebSessionsMock.mockResolvedValueOnce({
      success: true,
      sessions: [
        {
          id: "sess-1",
          deviceName: "Windows PC",
          clientName: "Chrome",
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "desktop",
        },
      ],
    });

    render(<DeviceSessionsCard />);

    await waitFor(() => {
      expect(screen.getByText("Thiết bị đã đăng nhập (1)")).toBeDefined();
    });

    getWebSessionsMock.mockResolvedValueOnce({
      success: true,
      sessions: [
        {
          id: "sess-1",
          deviceName: "Windows PC",
          clientName: "Chrome",
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "desktop",
        },
        {
          id: "sess-2",
          deviceName: "iPhone (iOS 18)",
          clientName: "Safari",
          createdAt: "2026-09-12T01:30:00Z",
          lastSeenAt: "2026-09-12T01:30:00Z",
          isCurrent: false,
          deviceType: "phone",
        },
      ],
    });

    const refreshBtn = screen.getByRole("button", { name: "Làm mới danh sách phiên" });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(screen.getByText("Thiết bị đã đăng nhập (2)")).toBeDefined();
      expect(screen.getByText("iPhone (iOS 18)")).toBeDefined();
    });
  });

  it("opens modal and revokes all other sessions successfully", async () => {
    getWebSessionsMock.mockResolvedValue({
      success: true,
      sessions: [
        {
          id: "sess-1",
          deviceName: "Windows PC",
          clientName: "Chrome",
          createdAt: "2026-09-12T01:00:00Z",
          lastSeenAt: "2026-09-12T01:00:00Z",
          isCurrent: true,
          deviceType: "desktop",
        },
        {
          id: "sess-2",
          deviceName: "iPhone (iOS 18)",
          clientName: "Safari",
          createdAt: "2026-09-12T01:30:00Z",
          lastSeenAt: "2026-09-12T01:30:00Z",
          isCurrent: false,
          deviceType: "phone",
        },
      ],
    });

    revokeOtherWebSessionsMock.mockResolvedValue({
      success: true,
      message: "Đã đăng xuất tất cả các thiết bị khác thành công.",
    });

    render(<DeviceSessionsCard />);

    await waitFor(() => {
      expect(screen.getByText(/Đăng xuất tất cả thiết bị khác/i)).toBeDefined();
    });

    const revokeAllBtn = screen.getByRole("button", {
      name: /Đăng xuất tất cả thiết bị khác/i,
    });
    fireEvent.click(revokeAllBtn);

    await waitFor(() => {
      expect(screen.getByText("Đăng xuất tất cả thiết bị khác?")).toBeDefined();
    });

    const confirmBtn = screen.getByRole("button", { name: "Đăng xuất tất cả" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(revokeOtherWebSessionsMock).toHaveBeenCalled();
      expect(
        screen.getByText("Đã đăng xuất tất cả các thiết bị khác thành công."),
      ).toBeDefined();
      expect(screen.getByText("Thiết bị đã đăng nhập (1)")).toBeDefined();
    });
  });
});
