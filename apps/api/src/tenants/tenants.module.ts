import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Tenant } from "./tenant.entity";
import { TenantController } from "./controller/tenant.controller";
import { TenantService } from "./service/tenant.service";

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  controllers: [TenantController],
  providers: [TenantService, RolesGuard],
  exports: [TenantService],
})
export class TenantsModule {}
