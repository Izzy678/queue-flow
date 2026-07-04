import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { SessionGuard } from "src/auth/guards/session.guard";
import { User, UserRole } from "src/users/user.entity";
import { CreateQueueDto, UpdateQueueDto } from "../dto/queue.dto";
import { QueuesService } from "../service/queues.service";
import { TicketsService } from "../service/tickets.service";
import { assertBranchAccess, getUserBranchIds } from "../../auth/utils/branch-acess";

@Controller("queues")
@UseGuards(SessionGuard)
export class QueuesController {
  constructor(
    private readonly queuesService: QueuesService,
    private readonly ticketsService: TicketsService
  ) { }

  @Get("dashboard/stats")
  getDashboardStats(@CurrentUser() user: User) {
    return this.ticketsService.getDashboardStats(user.tenantId);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query("branchId") branchId?: string) {
    if (branchId) assertBranchAccess(user, branchId);

    return this.queuesService.findAll(
      user.tenantId,
      branchId,
      getUserBranchIds(user)
    );
  }

  @Get(":id/board")
  getBoard(@CurrentUser() user: User, @Param("id") id: string) {
    return this.ticketsService.getBoard(user.tenantId, id);
  }

  @Get(":id")
  findOne(@CurrentUser() user: User, @Param("id") id: string) {
    return this.queuesService.findOne(user.tenantId, id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@CurrentUser() user: User, @Body() dto: CreateQueueDto) {
    return this.queuesService.create(user.tenantId, dto);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateQueueDto
  ) {
    return this.queuesService.update(user.tenantId, id, dto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  remove(@CurrentUser() user: User, @Param("id") id: string) {
    return this.queuesService.remove(user.tenantId, id);
  }

  @Post(":id/call-next")
  callNext(@CurrentUser() user: User, @Param("id") id: string) {
    return this.ticketsService.callNext(user.tenantId, id);
  }
}
