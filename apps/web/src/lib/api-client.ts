import type {
  AuthMeResponse,
  Branch,
  BranchJoinToken,
  CreateBranchRequest,
  CreateQueueRequest,
  CreateTeamMemberRequest,
  DashboardStats,
  JoinQueueRequest,
  LoginRequest,
  PublicBranchLanding,
  PublicQueueInfo,
  PublicTicketStatus,
  Queue,
  QueueBoard,
  RegisterRequest,
  TeamMember,
  Tenant,
  Ticket,
  UpdateBranchRequest,
  UpdateQueueRequest,
  UpdateTeamMemberRequest,
  UpdateTenantRequest,
} from "@queueflow/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type {
  AuthMeResponse,
  Branch,
  DashboardStats,
  Queue,
  QueueBoard,
  TeamMember,
  Tenant,
  Ticket,
};

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => ({}));
  const message = (body as { message?: string | string[] }).message;
  if (Array.isArray(message)) return message[0] ?? "Request failed";
  return message ?? "Request failed";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json() as Promise<T>;
}

export function login(email: string, password: string) {
  const payload: LoginRequest = { email, password };
  return apiFetch<AuthMeResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function register(payload: RegisterRequest) {
  return apiFetch<AuthMeResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return apiFetch<AuthMeResponse>("/auth/me");
}

export function logout() {
  return apiFetch<{ message: string }>("/auth/logout", { method: "POST" });
}

export function getBranches() {
  return apiFetch<Branch[]>("/branches");
}

export function createBranch(payload: CreateBranchRequest) {
  return apiFetch<Branch>("/branches", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBranch(id: string, payload: UpdateBranchRequest) {
  return apiFetch<Branch>(`/branches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteBranch(id: string) {
  return apiFetch<{ message: string }>(`/branches/${id}`, {
    method: "DELETE",
  });
}

export function createBranchJoinToken(branchId: string) {
  return apiFetch<BranchJoinToken>(`/branches/${branchId}/join-token`, {
    method: "POST",
  });
}

export function getTenant() {
  return apiFetch<Tenant>("/tenant");
}

export function updateTenant(payload: UpdateTenantRequest) {
  return apiFetch<Tenant>("/tenant", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getTeamMembers() {
  return apiFetch<TeamMember[]>("/users");
}

export function createTeamMember(payload: CreateTeamMemberRequest) {
  return apiFetch<TeamMember>("/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTeamMember(id: string, payload: UpdateTeamMemberRequest) {
  return apiFetch<TeamMember>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteTeamMember(id: string) {
  return apiFetch<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
}

export function getDashboardStats() {
  return apiFetch<DashboardStats>("/queues/dashboard/stats");
}

export function getQueues(branchId?: string) {
  const query = branchId ? `?branchId=${branchId}` : "";
  return apiFetch<Queue[]>(`/queues${query}`);
}

export function getQueue(id: string) {
  return apiFetch<Queue>(`/queues/${id}`);
}

export function getQueueBoard(id: string) {
  return apiFetch<QueueBoard>(`/queues/${id}/board`);
}

export function createQueue(payload: CreateQueueRequest) {
  return apiFetch<Queue>("/queues", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateQueue(id: string, payload: UpdateQueueRequest) {
  return apiFetch<Queue>(`/queues/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteQueue(id: string) {
  return apiFetch<{ message: string }>(`/queues/${id}`, {
    method: "DELETE",
  });
}

export function callNextTicket(queueId: string) {
  return apiFetch<Ticket>(`/queues/${queueId}/call-next`, { method: "POST" });
}

export function serveTicket(ticketId: string) {
  return apiFetch<Ticket>(`/tickets/${ticketId}/serve`, { method: "POST" });
}

export function completeTicket(ticketId: string) {
  return apiFetch<Ticket>(`/tickets/${ticketId}/complete`, { method: "POST" });
}

export function markTicketNoShow(ticketId: string) {
  return apiFetch<Ticket>(`/tickets/${ticketId}/no-show`, { method: "POST" });
}

export function cancelTicket(ticketId: string) {
  return apiFetch<Ticket>(`/tickets/${ticketId}/cancel`, { method: "POST" });
}

async function publicFetch<T>(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(await parseError(res));
  }

  return res.json() as Promise<T>;
}

export function getPublicBranchLanding(
  tenantSlug: string,
  branchSlug: string,
  token: string
) {
  return publicFetch<PublicBranchLanding>(
    `/public/branches/${tenantSlug}/${branchSlug}?token=${encodeURIComponent(token)}`
  );
}

export function getPublicQueue(queueId: string) {
  return publicFetch<PublicQueueInfo>(`/public/queues/${queueId}`);
}

export function joinPublicQueue(queueId: string, payload: JoinQueueRequest) {
  return publicFetch<Ticket>(`/public/queues/${queueId}/join`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPublicTicket(ticketId: string) {
  return publicFetch<PublicTicketStatus>(`/public/tickets/${ticketId}`);
}
