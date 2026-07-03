export interface BranchJoinToken {
  token: string;
  expiresAt: string;
  joinUrl: string;
}

export interface PublicBranchLanding {
  tenantName: string;
  tenantSlug: string;
  branchName: string;
  branchSlug: string;
  queues: PublicBranchQueue[];
}

export interface PublicBranchQueue {
  id: string;
  name: string;
  color: string;
  waitingCount: number;
  servingCount: number;
}
