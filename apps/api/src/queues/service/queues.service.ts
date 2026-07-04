import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Branch } from "src/branches/entity/branch.entity";
import { Queue, QueueStatus } from "../entity/queue.entity";
import { Ticket, TicketStatus } from "../entity/ticket.entity";
import { CreateQueueDto, UpdateQueueDto } from "../dto/queue.dto";

@Injectable()
export class QueuesService {
  constructor(
    @InjectRepository(Queue)
    private readonly queuesRepository: Repository<Queue>,
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>
  ) {}

  async findAll(
    tenantId: string,
    branchId?: string,
    allowedBranchIds?: string[] | null
  ) {
    let where: { tenantId: string; branchId?: string | ReturnType<typeof In> };

    if (branchId) {
      where = { tenantId, branchId };
    } else if (allowedBranchIds?.length) {
      where = { tenantId, branchId: In(allowedBranchIds) };
    } else {
      where = { tenantId };
    }

    const queues = await this.queuesRepository.find({
      where,
      relations: { branch: true },
      order: { createdAt: "ASC" },
    });

    return Promise.all(queues.map((queue) => this.toResponse(queue)));
  }

  async findOne(tenantId: string, id: string) {
    const queue = await this.getQueueOrThrow(tenantId, id);
    return this.toResponse(queue);
  }

  async create(tenantId: string, dto: CreateQueueDto) {
    const branch = await this.branchesRepository.findOne({
      where: { id: dto.branchId, tenantId },
    });

    if (!branch) {
      throw new NotFoundException("Branch not found");
    }

    const prefix = dto.prefix.toUpperCase();
    const existing = await this.queuesRepository.findOne({
      where: { tenantId, branchId: dto.branchId, prefix },
    });

    if (existing) {
      throw new BadRequestException(
        "A queue with this prefix already exists at this branch"
      );
    }

    const queue = this.queuesRepository.create({
      tenantId,
      branchId: dto.branchId,
      name: dto.name.trim(),
      prefix,
      color: dto.color ?? "#6366f1",
      status: QueueStatus.ACTIVE,
      ticketCounter: 0,
    });

    const saved = await this.queuesRepository.save(queue);
    saved.branch = branch;
    return this.toResponse(saved);
  }

  async update(tenantId: string, id: string, dto: UpdateQueueDto) {
    const queue = await this.getQueueOrThrow(tenantId, id);

    if (dto.prefix !== undefined) {
      const prefix = dto.prefix.toUpperCase();
      const existing = await this.queuesRepository.findOne({
        where: { tenantId, branchId: queue.branchId, prefix },
      });
      if (existing && existing.id !== queue.id) {
        throw new BadRequestException(
          "A queue with this prefix already exists at this branch"
        );
      }
      queue.prefix = prefix;
    }

    if (dto.name !== undefined) queue.name = dto.name.trim();
    if (dto.color !== undefined) queue.color = dto.color;
    if (dto.status !== undefined) queue.status = dto.status;

    const saved = await this.queuesRepository.save(queue);
    return this.toResponse(saved);
  }

  async remove(tenantId: string, id: string) {
    const queue = await this.getQueueOrThrow(tenantId, id);

    const activeTickets = await this.ticketsRepository.count({
      where: {
        queueId: queue.id,
        status: TicketStatus.WAITING,
      },
    });

    if (activeTickets > 0) {
      throw new BadRequestException(
        "Cannot delete a queue with waiting customers"
      );
    }

    await this.queuesRepository.remove(queue);
    return { message: "Queue deleted" };
  }

  async getQueueOrThrow(tenantId: string, id: string) {
    const queue = await this.queuesRepository.findOne({
      where: { id, tenantId },
      relations: { branch: true },
    });

    if (!queue) {
      throw new NotFoundException("Queue not found");
    }

    return queue;
  }

  async getPublicQueue(id: string) {
    const queue = await this.queuesRepository.findOne({
      where: { id },
      relations: { branch: true },
    });

    if (!queue || queue.status !== QueueStatus.ACTIVE) {
      throw new NotFoundException("Queue not available");
    }

    const waitingCount = await this.ticketsRepository.count({
      where: { queueId: queue.id, status: TicketStatus.WAITING },
    });

    return {
      id: queue.id,
      name: queue.name,
      branchName: queue.branch.name,
      status: queue.status,
      waitingCount,
    };
  }

  private async toResponse(queue: Queue) {
    const [waitingCount, servingCount, calledCount] = await Promise.all([
      this.ticketsRepository.count({
        where: { queueId: queue.id, status: TicketStatus.WAITING },
      }),
      this.ticketsRepository.count({
        where: { queueId: queue.id, status: TicketStatus.SERVING },
      }),
      this.ticketsRepository.count({
        where: { queueId: queue.id, status: TicketStatus.CALLED },
      }),
    ]);

    return {
      id: queue.id,
      tenantId: queue.tenantId,
      branchId: queue.branchId,
      branchName: queue.branch?.name ?? "",
      name: queue.name,
      prefix: queue.prefix,
      color: queue.color,
      status: queue.status,
      waitingCount,
      servingCount,
      calledCount,
      createdAt: queue.createdAt.toISOString(),
      updatedAt: queue.updatedAt.toISOString(),
    };
  }
}
