import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CurrentUser } from "../../auth/decorators/current-user.decorator";
import { Roles } from "../../auth/decorators/roles.decorator";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { SessionGuard } from "../../auth/guards/session.guard";
import { User, UserRole } from "../../users/user.entity";
import { CreateBranchDto, UpdateBranchDto } from "../dto/branch.dto";
import { BranchesService } from "../service/branches.service";
import { JoinTokenService } from "../service/join-token.service";
import { assertBranchAccess, getUserBranchIds } from "../../auth/utils/branch-acess";

@Controller("branches")
@UseGuards(SessionGuard)
export class BranchesController {
  constructor(
    private readonly branchesService: BranchesService,
    private readonly joinTokenService: JoinTokenService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  async findAll(@CurrentUser() user: User) {
    const branches = await this.branchesService.findAll(user.tenantId);
    const allowed  =  getUserBranchIds(user);
    return allowed
      ? branches.filter((branch) => allowed.includes(branch.id))
      : branches;
  }

  @Post(":id/join-token")
  createJoinToken(@CurrentUser() user: User, @Param("id") id: string) {
    assertBranchAccess(user, id);
    return this.buildJoinTokenResponse(user.tenantId, id);
  }

  @Get(":id")
  findOne(@CurrentUser() user: User, @Param("id") id: string) {
    assertBranchAccess(user, id);
    return this.branchesService.findOne(user.tenantId, id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@CurrentUser() user: User, @Body() dto: CreateBranchDto) {
    return this.branchesService.create(user.tenantId, dto);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateBranchDto
  ) {
    return this.branchesService.update(user.tenantId, id, dto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  remove(@CurrentUser() user: User, @Param("id") id: string) {
    return this.branchesService.remove(user.tenantId, id);
  }

  private async buildJoinTokenResponse(tenantId: string, branchId: string) {
    const branch = await this.branchesService.getBranchOrThrow(
      tenantId,
      branchId
    );
    const tenant = branch.tenant;
    const { token, expiresAt } = await this.joinTokenService.createToken(
      tenantId,
      branchId
    );

    const webUrl =
      this.configService.get<string>("WEB_URL") ?? "http://localhost:3000";
    const joinUrl = `${webUrl}/w/${tenant.slug}/${branch.slug}?t=${token}`;

    return { token, expiresAt, joinUrl };
  }
}
