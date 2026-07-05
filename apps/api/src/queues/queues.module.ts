import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BranchesModule } from "../branches/branches.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { Branch } from "../branches/entity/branch.entity";
import { RolesGuard } from "../auth/guards/roles.guard";
import { QueuesController } from "./controller/queues.controller";
import { PublicQueuesController } from "./controller/public-queues.controller";
import { TicketsController } from "./controller/tickets.controller";
import { Queue } from "./entity/queue.entity";
import { Ticket } from "./entity/ticket.entity";
import { QueuesService } from "./service/queues.service";
import { TicketsService } from "./service/tickets.service";

@Module({
  imports: [
    BranchesModule,
    NotificationsModule,
    TypeOrmModule.forFeature([Queue, Ticket, Branch]),
  ],
  controllers: [QueuesController, PublicQueuesController, TicketsController],
  providers: [QueuesService, TicketsService, RolesGuard],
  exports: [QueuesService, TicketsService],
})
export class QueuesModule {}
