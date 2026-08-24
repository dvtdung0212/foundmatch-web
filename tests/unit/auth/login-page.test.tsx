import { describe, expect, it, vi } from "vitest";
import LoginPage from "@/app/(auth)/login/page";

const mocks = vi.hoisted(() => ({
  redirect: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  getCurrentProfile: vi.fn(),
}));

vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

vi.mock("@/features/profiles/actions/profile.actions", () => ({
  getCurrentProfile: () => mocks.getCurrentProfile(),
}));

vi.mock("@/components/layout/navbar", () => ({
  Navbar: () => null,
}));

vi.mock("@/components/layout/footer", () => ({
  Footer: () => null,
}));

vi.mock("@/features/auth/components/login-form", () => ({
  LoginForm: () => null,
}));

describe("LoginPage", () => {
  it("redirects an authenticated user to home", async () => {
    mocks.getCurrentProfile.mockResolvedValue({
      success: true,
      data: { id: "user-1", email: "member@example.com" },
    });

    await expect(LoginPage()).rejects.toThrow("NEXT_REDIRECT");
    expect(mocks.redirect).toHaveBeenCalledWith("/");
  });
});
