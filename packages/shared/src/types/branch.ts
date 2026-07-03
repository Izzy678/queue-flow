export enum BranchStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Branch {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  status: BranchStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  name: string;
}

export interface UpdateBranchRequest {
  name?: string;
  status?: BranchStatus;
}
