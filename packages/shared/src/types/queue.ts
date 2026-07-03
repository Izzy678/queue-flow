import type { Ticket } from "./ticket";

export enum QueueStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface Queue {
  id: string;
  tenantId: string;
  branchId: string;
  branchName: string;
  name: string;
  prefix: string;
  color: string;
  status: QueueStatus;
  waitingCount: number;
  servingCount: number;
  calledCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQueueRequest {
  branchId: string;
  name: string;
  prefix: string;
  color?: string;
}

export interface UpdateQueueRequest {
  name?: string;
  prefix?: string;
  color?: string;
  status?: QueueStatus;
}

export interface QueueBoard {
  queue: Queue;
  waiting: Ticket[];
  called: Ticket[];
  serving: Ticket[];
  servedToday: number;
}

export interface PublicQueueInfo {
  id: string;
  name: string;
  branchName: string;
  status: QueueStatus;
  waitingCount: number;
}

export interface DashboardStats {
  activeQueues: number;
  waitingCount: number;
  servingCount: number;
  servedToday: number;
  currentTicket: string | null;
  avgWaitMinutes: number | null;
  queueSummaries: Queue[];
  recentTickets: Ticket[];
  throughput: number[];
}
