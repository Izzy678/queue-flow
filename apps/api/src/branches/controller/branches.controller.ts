import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { SessionGuard } from "src/auth/guards/session.guard";
import { User, UserRole } from "src/users/user.entity";
import { CreateBranchDto, UpdateBranchDto } from "../dto/branch.dto";
import { BranchesService } from "../service/branches.service";


@Controller("branches")
@UseGuards(SessionGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.branchesService.findAll(user.tenantId);
  }

  @Get(":id")
  findOne(@CurrentUser() user: User, @Param("id") id: string) {
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
}
