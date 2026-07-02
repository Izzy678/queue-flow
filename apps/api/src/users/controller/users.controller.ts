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
import { User, UserRole } from "../user.entity";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "../dto/user.dto";
import { UsersService } from "../service/users.service";

@Controller("users")
@UseGuards(SessionGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.usersService.findAll(user.tenantId);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@CurrentUser() user: User, @Body() dto: CreateTeamMemberDto) {
    return this.usersService.create(user, dto);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateTeamMemberDto
  ) {
    return this.usersService.update(user, id, dto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  remove(@CurrentUser() user: User, @Param("id") id: string) {
    return this.usersService.remove(user, id);
  }
}
