import { Controller, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { SessionGuard } from "src/auth/guards/session.guard";
import { User } from "src/users/user.entity";
import { TicketsService } from "../service/tickets.service";

@Controller("tickets")
@UseGuards(SessionGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post(":id/serve")
  serve(@CurrentUser() user: User, @Param("id") id: string) {
    return this.ticketsService.serve(user.tenantId, id);
  }

  @Post(":id/complete")
  complete(@CurrentUser() user: User, @Param("id") id: string) {
    return this.ticketsService.complete(user.tenantId, id);
  }

  @Post(":id/no-show")
  markNoShow(@CurrentUser() user: User, @Param("id") id: string) {
    return this.ticketsService.markNoShow(user.tenantId, id);
  }

  @Post(":id/cancel")
  cancel(@CurrentUser() user: User, @Param("id") id: string) {
    return this.ticketsService.cancel(user.tenantId, id);
  }
}
