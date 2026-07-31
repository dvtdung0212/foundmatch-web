export type UserRole =
  "guest" | "user" | "relay_member" | "moderator" | "admin";

export type RelayMemberStatus =
  "none" | "pending" | "approved" | "rejected" | "suspended";

export interface AuthSessionUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  avatarUrl?: string;
}

export interface AuthActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface DemoPersona {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  description: string;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    email: "finder@example.com",
    name: "Nguyen Van Finder",
    role: "user",
    description: "Người nhặt được đồ (Finder)",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    email: "owner@example.com",
    name: "Tran Thi Owner",
    role: "user",
    description: "Chủ sở hữu đồ bị mất (Owner)",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    email: "relay@example.com",
    name: "Le Relay Member",
    role: "relay_member",
    description: "Thành viên Relay hỗ trợ bàn giao",
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    email: "moderator@example.com",
    name: "Pham Moderator",
    role: "moderator",
    description: "Kiểm duyệt viên & Xử lý tranh chấp",
  },
];
