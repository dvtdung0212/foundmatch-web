import { describe, it, expect } from "vitest";
import {
  magicLinkSchema,
  verifyOtpSchema,
  signUpSchema,
  signInWithPasswordSchema,
} from "@/features/auth/schemas/auth.schema";
import { updateProfileSchema } from "@/features/profiles/schemas/profile.schema";
import { DEMO_PERSONAS } from "@/types/auth.types";

describe("Auth & Profile Schemas Validation", () => {
  it("validates valid email for Magic Link", () => {
    const valid = magicLinkSchema.safeParse({ email: "user@example.com" });
    expect(valid.success).toBe(true);
    if (valid.success) {
      expect(valid.data.email).toBe("user@example.com");
    }
  });

  it("rejects invalid email formats", () => {
    const invalid = magicLinkSchema.safeParse({ email: "invalid-email" });
    expect(invalid.success).toBe(false);
  });

  it("validates OTP token code length", () => {
    const validOtp = verifyOtpSchema.safeParse({
      email: "user@example.com",
      token: "123456",
    });
    expect(validOtp.success).toBe(true);

    const invalidOtp = verifyOtpSchema.safeParse({
      email: "user@example.com",
      token: "123",
    });
    expect(invalidOtp.success).toBe(false);
  });

  it("validates sign up schema with username and password match", () => {
    const validSignUp = signUpSchema.safeParse({
      email: "newuser@example.com",
      username: "newuser_99",
      fullName: "New User",
      password: "password1234",
      confirmPassword: "password1234",
    });
    expect(validSignUp.success).toBe(true);

    const mismatchedPass = signUpSchema.safeParse({
      email: "newuser@example.com",
      username: "newuser_99",
      fullName: "New User",
      password: "password123",
      confirmPassword: "differentpassword",
    });
    expect(mismatchedPass.success).toBe(false);

    const invalidUsername = signUpSchema.safeParse({
      email: "newuser@example.com",
      username: "invalid user!",
      fullName: "New User",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(invalidUsername.success).toBe(false);
  });

  it("validates sign in with identifier (email or username) and password", () => {
    const validEmailSignIn = signInWithPasswordSchema.safeParse({
      identifier: "user@example.com",
      password: "mysecretpassword",
    });
    expect(validEmailSignIn.success).toBe(true);

    const validUsernameSignIn = signInWithPasswordSchema.safeParse({
      identifier: "john_doe",
      password: "mysecretpassword",
    });
    expect(validUsernameSignIn.success).toBe(true);
  });

  it("validates update profile input", () => {
    const validProfile = updateProfileSchema.safeParse({
      fullName: "Nguyen Van A",
      phone: "0912345678",
      avatarUrl: "https://example.com/avatar.jpg",
    });
    expect(validProfile.success).toBe(true);
  });

  it("contains 4 pre-configured demo personas", () => {
    expect(DEMO_PERSONAS).toHaveLength(4);
    expect(DEMO_PERSONAS.map((p) => p.role)).toContain("moderator");
  });
});
