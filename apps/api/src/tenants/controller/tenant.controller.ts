import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { SessionGuard } from "src/auth/guards/session.guard";
import { User, UserRole } from "src/users/user.entity";
import { UpdateTenantDto } from "../dto/tenant.dto";
import { TenantService } from "../service/tenant.service";

@Controller("tenant")
@UseGuards(SessionGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  findOne(@CurrentUser() user: User) {
    return this.tenantService.findOne(user.tenantId);
  }

  @Patch()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER)
  update(@CurrentUser() user: User, @Body() dto: UpdateTenantDto) {
    return this.tenantService.update(user.tenantId, dto);
  }
}
