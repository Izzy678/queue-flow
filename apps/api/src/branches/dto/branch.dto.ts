import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";
import { BranchStatus } from "../entity/branch.entity";

export class CreateBranchDto {
  @IsString()
  @MinLength(1)
  name!: string;
}

export class UpdateBranchDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(BranchStatus)
  status?: BranchStatus;
}
