import { Controller, Get, Param, Post, Body } from "@nestjs/common";
import { JoinQueueDto } from "../dto/ticket.dto";
import { QueuesService } from "../service/queues.service";
import { TicketsService } from "../service/tickets.service";

@Controller("public")
export class PublicQueuesController {
  constructor(
    private readonly queuesService: QueuesService,
    private readonly ticketsService: TicketsService
  ) {}

  @Get("queues/:id")
  getQueue(@Param("id") id: string) {
    return this.queuesService.getPublicQueue(id);
  }

  @Post("queues/:id/join")
  joinQueue(@Param("id") id: string, @Body() dto: JoinQueueDto) {
    return this.ticketsService.joinPublic(id, dto);
  }

  @Get("tickets/:id")
  getTicket(@Param("id") id: string) {
    return this.ticketsService.getPublicTicket(id);
  }
}
