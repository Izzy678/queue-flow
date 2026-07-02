import { TenantType } from "./auth";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: TenantType;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTenantRequest {
  name: string;
}
