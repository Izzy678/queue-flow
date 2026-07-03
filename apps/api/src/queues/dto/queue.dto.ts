import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { QueueStatus } from "../entity/queue.entity";

export class CreateQueueDto {
  @IsUUID()
  branchId!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name!: string;

  @IsString()
  @Matches(/^[A-Z0-9]{1,3}$/, {
    message: "Prefix must be 1-3 uppercase letters or numbers",
  })
  prefix!: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: "Color must be a hex code" })
  color?: string;
}

export class UpdateQueueDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{1,3}$/, {
    message: "Prefix must be 1-3 uppercase letters or numbers",
  })
  prefix?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, { message: "Color must be a hex code" })
  color?: string;

  @IsOptional()
  @IsEnum(QueueStatus)
  status?: QueueStatus;
}
