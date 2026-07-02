import type {
  AuthMeResponse,
  Branch,
  CreateBranchRequest,
  CreateTeamMemberRequest,
  LoginRequest,
  RegisterRequest,
  TeamMember,
  Tenant,
  UpdateBranchRequest,
  UpdateTeamMemberRequest,
  UpdateTenantRequest,
} from "@queueflow/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type { AuthMeResponse, Branch, TeamMember, Tenant };

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
