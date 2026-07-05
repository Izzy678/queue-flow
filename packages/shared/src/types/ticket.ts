export enum TicketStatus {
  WAITING = "waiting",
  CALLED = "called",
  SERVING = "serving",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export interface Ticket {
  id: string;
  tenantId: string;
  branchId: string;
  queueId: string;
  queueName: string;
  branchName: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  status: TicketStatus;
  position: number | null;
  waitMinutes: number | null;
  calledAt: string | null;
  servingAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JoinQueueRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  joinToken: string;
}

export interface PublicTicketStatus {
  id: string;
  ticketNumber: string;
  queueName: string;
  branchName: string;
  status: TicketStatus;
  position: number | null;
  waitMinutes: number | null;
}
