import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Tenant } from "src/tenants/tenant.entity";
import { Queue, QueueStatus } from "src/queues/entity/queue.entity";
import { Ticket, TicketStatus } from "src/queues/entity/ticket.entity";
import { Branch, BranchStatus } from "../entity/branch.entity";
import { JoinTokenService } from "./join-token.service";

@Injectable()
export class PublicBranchService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
    @InjectRepository(Queue)
    private readonly queuesRepository: Repository<Queue>,
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    private readonly joinTokenService: JoinTokenService
  ) {}

  async getBranchLanding(
    tenantSlug: string,
    branchSlug: string,
    token: string
  ) {
    const branch = await this.resolveBranch(tenantSlug, branchSlug);
    await this.joinTokenService.validateToken(token, branch.id);

    if (branch.status !== BranchStatus.ACTIVE) {
      throw new NotFoundException("Branch not available");
    }

    const tenant = branch.tenant;
    const queues = await this.queuesRepository.find({
      where: {
        branchId: branch.id,
        status: QueueStatus.ACTIVE,
      },
      order: { createdAt: "ASC" },
    });

    const queueSummaries = await Promise.all(
      queues.map(async (queue) => {
        const [waitingCount, servingCount] = await Promise.all([
          this.ticketsRepository.count({
            where: { queueId: queue.id, status: TicketStatus.WAITING },
          }),
          this.ticketsRepository.count({
            where: {
              queueId: queue.id,
              status: TicketStatus.SERVING,
            },
          }),
        ]);

        return {
          id: queue.id,
          name: queue.name,
          color: queue.color,
          waitingCount,
          servingCount,
        };
      })
    );

    return {
      tenantName: tenant.name,
      tenantSlug: tenant.slug,
      branchName: branch.name,
      branchSlug: branch.slug,
      queues: queueSummaries,
    };
  }

  async resolveBranch(tenantSlug: string, branchSlug: string) {
    const tenant = await this.tenantsRepository.findOne({
      where: { slug: tenantSlug },
    });

    if (!tenant) {
      throw new NotFoundException("Organization not found");
    }

    const branch = await this.branchesRepository.findOne({
      where: { tenantId: tenant.id, slug: branchSlug },
      relations: { tenant: true },
    });

    if (!branch) {
      throw new NotFoundException("Branch not found");
    }

    return branch;
  }

  async validateJoinTokenForQueue(queueId: string, joinToken: string) {
    const queue = await this.queuesRepository.findOne({
      where: { id: queueId },
    });

    if (!queue || queue.status !== QueueStatus.ACTIVE) {
      throw new NotFoundException("Queue not available");
    }

    try {
      await this.joinTokenService.validateToken(joinToken, queue.branchId);
    } catch {
      throw new UnauthorizedException(
        "This QR code has expired. Please scan the code on the screen at the branch."
      );
    }

    return queue;
  }
}
