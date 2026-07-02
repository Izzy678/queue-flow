import { UserRole } from "./auth";

export interface TeamMember {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: UserRole;
  branchIds: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole.ADMIN | UserRole.STAFF;
  branchIds?: string[];
}

export interface UpdateTeamMemberRequest {
  name?: string;
  role?: UserRole.ADMIN | UserRole.STAFF;
  branchIds?: string[] | null;
}
