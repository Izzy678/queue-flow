import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  businessName!: string;

  @IsOptional()
  @IsIn(["one", "multiple"])
  locationCount?: "one" | "multiple";
}

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}
