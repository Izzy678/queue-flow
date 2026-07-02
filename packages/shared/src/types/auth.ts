export enum TenantType {
  ORGANIZATION = "organization",
  STANDALONE_LOCATION = "standalone_location",
}

export enum UserRole {
  OWNER = "owner",
  ADMIN = "admin",
  STAFF = "staff",
}

export type LocationCount = "one" | "multiple";

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  businessName: string;
  locationCount?: LocationCount;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
}

export interface AuthTenant {
  id: string;
  name: string;
  slug: string;
  type: TenantType;
}

export interface AuthBranch {
  id: string;
  name: string;
  status: string;
}

export interface AuthMeResponse {
  user: AuthUser;
  tenant: AuthTenant;
  branches: AuthBranch[];
}
