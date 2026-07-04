export interface AnalyticsBranchBreakdown {
  branchId: string;
  branchName: string;
  ticketsServed: number;
  noShows: number;
  avgWaitMinutes: number | null;
}

export interface AnalyticsQueueBreakdown {
  queueId: string;
  queueName: string;
  branchId: string;
  branchName: string;
  ticketsServed: number;
  noShows: number;
  avgWaitMinutes: number | null;
}

export interface AnalyticsReport {
  from: string;
  to: string;
  ticketsServed: number;
  noShows: number;
  cancelled: number;
  avgWaitMinutes: number | null;
  byBranch: AnalyticsBranchBreakdown[];
  byQueue: AnalyticsQueueBreakdown[];
}
