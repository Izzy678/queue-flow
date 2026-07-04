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
  ) {}

  @Get("dashboard/stats")
  getDashboardStats(@CurrentUser() user: User) {
    return this.ticketsService.getDashboardStats(
      user.tenantId,
      getUserBranchIds(user)
    );
  }

  @Get("analytics")
  getAnalytics(
    @CurrentUser() user: User,
    @Query("from") from?: string,
    @Query("to") to?: string,
    @Query("branchId") branchId?: string
  ) {
    if (branchId) assertBranchAccess(user, branchId);

    return this.ticketsService.getAnalytics(user.tenantId, {
      from,
      to,
      branchId,
      branchIds: branchId ? undefined : getUserBranchIds(user) ?? undefined,
    });
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
  async getBoard(@CurrentUser() user: User, @Param("id") id: string) {
    const queue = await this.queuesService.getQueueOrThrow(user.tenantId, id);
    assertBranchAccess(user, queue.branchId);
    return this.ticketsService.getBoard(user.tenantId, id);
  }

  @Get(":id")
  async findOne(@CurrentUser() user: User, @Param("id") id: string) {
    const queue = await this.queuesService.getQueueOrThrow(user.tenantId, id);
    assertBranchAccess(user, queue.branchId);
    return this.queuesService.findOne(user.tenantId, id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@CurrentUser() user: User, @Body() dto: CreateQueueDto) {
    assertBranchAccess(user, dto.branchId);
    return this.queuesService.create(user.tenantId, dto);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body() dto: UpdateQueueDto
  ) {
    const queue = await this.queuesService.getQueueOrThrow(user.tenantId, id);
    assertBranchAccess(user, queue.branchId);
    return this.queuesService.update(user.tenantId, id, dto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  async remove(@CurrentUser() user: User, @Param("id") id: string) {
    const queue = await this.queuesService.getQueueOrThrow(user.tenantId, id);
    assertBranchAccess(user, queue.branchId);
    return this.queuesService.remove(user.tenantId, id);
  }

  @Post(":id/call-next")
  async callNext(@CurrentUser() user: User, @Param("id") id: string) {
    const queue = await this.queuesService.getQueueOrThrow(user.tenantId, id);
    assertBranchAccess(user, queue.branchId);
    return this.ticketsService.callNext(user.tenantId, id);
  }
}
