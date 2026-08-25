import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Navbar } from "@/components/layout/navbar";

vi.mock("@/components/ui/logo", () => ({
  Logo: () => <span>FoundMatch</span>,
}));
vi.mock("@/features/auth/components/user-menu", () => ({
  UserMenu: () => <span>User menu</span>,
}));

describe("Navbar", () => {
  it("uses an absolute report creation URL from nested routes", () => {
    render(<Navbar profile={null} />);

    expect(screen.getByRole("link", { name: "Báo cáo" })).toHaveAttribute(
      "href",
      "/reports/create",
    );
  });
});
