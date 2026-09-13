import type { UserRole, RelayMemberStatus } from "./auth.types";

export interface UserProfileDTO {
  id: string;
  email: string;
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  avatarMediaAssetId: string | null;
  phone: string | null;
  dateOfBirth?: string | null;
  gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
  address?: string | null;
  addressLine: string | null;
  country: string | null;
  countryCode: string | null;
  administrativeAreaLevel1Id: string | null;
  administrativeAreaLevel2Id: string | null;
  localityGeographyId: string | null;
  occupation: string | null;
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
  fullName?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
  /** @deprecated Use the structured address fields for new consumers. */
  address?: string | null;
  addressLine?: string | null;
  countryCode?: string | null;
  administrativeAreaLevel1Id?: string | null;
  administrativeAreaLevel2Id?: string | null;
  localityGeographyId?: string | null;
  occupation?: string | null;
}
