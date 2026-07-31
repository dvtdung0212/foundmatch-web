import type { UserRole, RelayMemberStatus } from "./auth.types";

export interface UserProfileDTO {
  id: string;
  email: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  role: UserRole;
  relayStatus: RelayMemberStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfileDTO {
  id: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  relayStatus: RelayMemberStatus;
}

export interface UpdateProfileInput {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
}
