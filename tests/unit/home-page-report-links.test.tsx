import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomePage from "@/app/page";

vi.mock("@/features/profiles/actions/profile.actions", () => ({
  getCurrentProfile: vi.fn().mockResolvedValue({ success: true, data: null }),
}));
vi.mock("@/components/layout/navbar", () => ({ Navbar: () => null }));
vi.mock("@/components/layout/footer", () => ({ Footer: () => null }));

describe("HomePage report actions", () => {
  it("links lost and found actions to the existing creation routes", async () => {
    render(await HomePage());

    expect(screen.getByRole("link", { name: /Tôi bị mất đồ/i })).toHaveAttribute(
      "href",
      "/reports/create/lost",
    );
    expect(
      screen.getByRole("link", { name: /Tôi nhặt được đồ/i }),
    ).toHaveAttribute("href", "/reports/create/found");
  });
});
