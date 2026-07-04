import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tenant } from "../tenants/tenant.entity";
import { Queue } from "../queues/entity/queue.entity";
import { Ticket } from "../queues/entity/ticket.entity";
import { RolesGuard } from "../auth/guards/roles.guard";
import { BranchesController } from "./controller/branches.controller";
import { PublicBranchesController } from "./controller/public-branches.controller";
import { BranchJoinToken } from "./entity/branch-join-token.entity";
import { Branch } from "./entity/branch.entity";
import { BranchesService } from "./service/branches.service";
import { BranchSlugService } from "./service/branch-slug.service";
import { JoinTokenService } from "./service/join-token.service";
import { PublicBranchService } from "./service/public-branch.service";

@Module({
  imports: [TypeOrmModule.forFeature([Branch, BranchJoinToken, Tenant, Queue, Ticket])],
  controllers: [BranchesController, PublicBranchesController],
  providers: [
    BranchesService,
    BranchSlugService,
    JoinTokenService,
    PublicBranchService,
    RolesGuard,
  ],
  exports: [BranchesService, JoinTokenService, PublicBranchService],
})
export class BranchesModule {}
