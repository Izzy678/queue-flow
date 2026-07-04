import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { SessionGuard } from "src/auth/guards/session.guard";
import { assertBranchAccess } from "src/auth/utils/branch-acess";
import { User } from "src/users/user.entity";
import { TicketsService } from "../service/tickets.service";

@Controller("tickets")
@UseGuards(SessionGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post(":id/serve")
  async serve(@CurrentUser() user: User, @Param("id") id: string) {
    const ticket = await this.ticketsService.getTicketOrThrow(user.tenantId, id);
    assertBranchAccess(user, ticket.branchId);
    return this.ticketsService.serve(user.tenantId, id);
  }

  @Post(":id/complete")
  async complete(@CurrentUser() user: User, @Param("id") id: string) {
    const ticket = await this.ticketsService.getTicketOrThrow(user.tenantId, id);
    assertBranchAccess(user, ticket.branchId);
    return this.ticketsService.complete(user.tenantId, id);
  }

  @Post(":id/no-show")
  async markNoShow(@CurrentUser() user: User, @Param("id") id: string) {
    const ticket = await this.ticketsService.getTicketOrThrow(user.tenantId, id);
    assertBranchAccess(user, ticket.branchId);
    return this.ticketsService.markNoShow(user.tenantId, id);
  }

  @Post(":id/cancel")
  async cancel(@CurrentUser() user: User, @Param("id") id: string) {
    const ticket = await this.ticketsService.getTicketOrThrow(user.tenantId, id);
    assertBranchAccess(user, ticket.branchId);
    return this.ticketsService.cancel(user.tenantId, id);
  }
}
