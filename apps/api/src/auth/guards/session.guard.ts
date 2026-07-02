import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { User } from "../../users/user.entity";

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ isAuthenticated: () => boolean; user?: User }>();

    if (!request.isAuthenticated?.() || !request.user) {
      throw new UnauthorizedException("Not authenticated");
    }

    return true;
  }
}
