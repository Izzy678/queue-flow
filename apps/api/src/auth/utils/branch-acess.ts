import { ForbiddenException } from "@nestjs/common";
import { User } from "../../users/user.entity";

export function assertBranchAccess(user: User, branchId: string): void {
  if (user.branchIds?.length && !user.branchIds.includes(branchId)) {
    throw new ForbiddenException("You do not have access to this branch");
  }
}

export function getUserBranchIds(user: User): string[] | null {
  return user.branchIds?.length ? user.branchIds : null;
}