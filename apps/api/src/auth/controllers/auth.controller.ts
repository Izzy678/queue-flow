import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request } from "express";
import { User } from "../../users/user.entity";
import { CurrentUser } from "../decorators/current-user.decorator";
import { LoginDto, RegisterDto } from "../dto/auth.dto";
import { SessionGuard } from "../guards/session.guard";
import { AuthService } from "../services/auth.service";

function loginAsync(req: Request, user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function logoutAsync(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.logout((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterDto, @Req() req: Request) {
    const { user, auth } = await this.authService.register(dto);
    await loginAsync(req, user);
    return auth;
  }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  async login(@Body() _dto: LoginDto, @CurrentUser() user: User, @Req() req: Request) {
    await loginAsync(req, user);
    return this.authService.getAuthContext(user.id);
  }

  @Post("logout")
  @UseGuards(SessionGuard)
  async logout(@Req() req: Request) {
    await logoutAsync(req);
    return { message: "Logged out" };
  }

  @Get("me")
  @UseGuards(SessionGuard)
  me(@CurrentUser() user: User) {
    return this.authService.getAuthContext(user.id);
  }
}
