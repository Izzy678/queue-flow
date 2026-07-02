import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch } from "../branches/entity/branch.entity";
import { Tenant } from "../tenants/tenant.entity";
import { User } from "../users/user.entity";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { SessionSerializer } from "./serializers/session.serializer";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Tenant, Branch]),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
