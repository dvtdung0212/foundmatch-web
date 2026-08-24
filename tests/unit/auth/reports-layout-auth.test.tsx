import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ReportsLayout from "@/app/reports/layout";

const getCurrentProfile = vi.fn();

vi.mock("@/features/profiles/actions/profile.actions", () => ({
  getCurrentProfile: () => getCurrentProfile(),
}));

vi.mock("@/components/layout/navbar", () => ({
  Navbar: ({ profile }: { profile?: { id: string } | null }) => (
    <div data-testid="navbar-profile">{profile?.id ?? "anonymous"}</div>
  ),
}));

vi.mock("@/components/layout/footer", () => ({
  Footer: () => <footer>Footer</footer>,
}));

describe("ReportsLayout auth projection", () => {
  it("loads the current profile before rendering the navbar", async () => {
    getCurrentProfile.mockResolvedValue({
      success: true,
      data: { id: "user-1", email: "member@example.com" },
    });

    render(await ReportsLayout({ children: <div>Reports</div> }));

    expect(getCurrentProfile).toHaveBeenCalledOnce();
    expect(screen.getByTestId("navbar-profile")).toHaveTextContent("user-1");
  });
});
