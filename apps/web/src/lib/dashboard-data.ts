export const dashboardOverview = {
  activeQueues: 4,
  avgWaitMinutes: 8,
  currentTicket: "A-042",
  servedToday: 847,
  throughput: [30, 45, 38, 62, 55, 78, 65, 82, 70, 90, 85, 95],
} as const;

export const dashboardBranches = [
  {
    id: "downtown",
    name: "Downtown",
    queues: 4,
    served: 234,
    avgWait: "8 min",
    waiting: 31,
    status: "active" as const,
  },
  {
    id: "westside",
    name: "Westside",
    queues: 3,
    served: 189,
    avgWait: "12 min",
    waiting: 18,
    status: "active" as const,
  },
  {
    id: "airport",
    name: "Airport",
    queues: 6,
    served: 412,
    avgWait: "15 min",
    waiting: 47,
    status: "busy" as const,
  },
  {
    id: "mall",
    name: "Mall",
    queues: 2,
    served: 156,
    avgWait: "5 min",
    waiting: 9,
    status: "active" as const,
  },
] as const;

export const dashboardQueues = [
  { name: "General", waiting: 12, serving: 3, color: "#6366f1", branch: "Downtown" },
  { name: "Priority", waiting: 4, serving: 1, color: "#f59e0b", branch: "Downtown" },
  { name: "Express", waiting: 8, serving: 2, color: "#22c55e", branch: "Airport" },
  { name: "Returns", waiting: 6, serving: 1, color: "#8b5cf6", branch: "Mall" },
] as const;

export const recentTickets = [
  { ticket: "A-041", customer: "Maria L.", queue: "General", status: "serving" as const, wait: "3 min" },
  { ticket: "A-042", customer: "James K.", queue: "General", status: "waiting" as const, wait: "5 min" },
  { ticket: "B-018", customer: "Sarah T.", queue: "Priority", status: "called" as const, wait: "1 min" },
  { ticket: "A-043", customer: "David R.", queue: "General", status: "waiting" as const, wait: "8 min" },
  { ticket: "C-007", customer: "Emma W.", queue: "Express", status: "waiting" as const, wait: "2 min" },
] as const;
