import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { UserRole } from "../user.entity";

const INVITE_ROLES = [UserRole.ADMIN, UserRole.STAFF] as const;

export class CreateTeamMemberDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsIn(INVITE_ROLES)
  role!: (typeof INVITE_ROLES)[number];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  branchIds?: string[];
}

export class UpdateTeamMemberDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsIn(INVITE_ROLES)
  role?: (typeof INVITE_ROLES)[number];

  @IsOptional()
  @IsArray()
  @IsUUID("4", { each: true })
  branchIds?: string[] | null;
}
