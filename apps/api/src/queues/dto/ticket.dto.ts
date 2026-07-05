import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class JoinQueueDto {
  @IsString()
  @MinLength(1)
  customerName!: string;

  @IsEmail()
  customerEmail!: string;

  @IsOptional()
  @IsString()
  customerPhone?: string;

  @IsString()
  @MinLength(1)
  joinToken!: string;
}
