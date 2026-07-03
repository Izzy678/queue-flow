import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, DataSource, In, Repository } from "typeorm";
import { PublicBranchService } from "src/branches/service/public-branch.service";
import { Queue, QueueStatus } from "../entity/queue.entity";
import { Ticket, TicketStatus } from "../entity/ticket.entity";
import { JoinQueueDto } from "../dto/ticket.dto";
import { QueuesService } from "./queues.service";

@Injectable()
export class TicketsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly queuesService: QueuesService,
    private readonly publicBranchService: PublicBranchService,
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    @InjectRepository(Queue)
    private readonly queuesRepository: Repository<Queue>
  ) {}

  async joinPublic(queueId: string, dto: JoinQueueDto) {
    await this.publicBranchService.validateJoinTokenForQueue(
      queueId,
      dto.joinToken
    );

    const queue = await this.queuesRepository.findOne({
      where: { id: queueId },
      relations: { branch: true },
    });

    if (!queue || queue.status !== QueueStatus.ACTIVE) {
      throw new NotFoundException("Queue not available");
    }

    return this.createTicket(queue, dto);
  }

  async getPublicTicket(ticketId: string) {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId },
      relations: { queue: true, branch: true },
    });

    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }

    const position = await this.getWaitingPosition(ticket);
    return this.toPublicResponse(ticket, position);
  }

  async getBoard(tenantId: string, queueId: string) {
    const queue = await this.queuesService.getQueueOrThrow(tenantId, queueId);
    const tickets = await this.ticketsRepository.find({
      where: {
        queueId,
        status: In([
          TicketStatus.WAITING,
          TicketStatus.CALLED,
          TicketStatus.SERVING,
        ]),
      },
      relations: { queue: true, branch: true },
      order: { createdAt: "ASC" },
    });

    const servedToday = await this.countServedToday(queue.tenantId, queueId);
    const queueResponse = await this.queuesService.findOne(tenantId, queueId);

    const mapped = await Promise.all(
      tickets.map((ticket) => this.toResponse(ticket))
    );

    return {
      queue: queueResponse,
      waiting: mapped.filter((t) => t.status === TicketStatus.WAITING),
      called: mapped.filter((t) => t.status === TicketStatus.CALLED),
      serving: mapped.filter((t) => t.status === TicketStatus.SERVING),
      servedToday,
    };
  }

  async callNext(tenantId: string, queueId: string) {
    await this.queuesService.getQueueOrThrow(tenantId, queueId);

    const ticket = await this.ticketsRepository.findOne({
      where: { queueId, status: TicketStatus.WAITING },
      relations: { queue: true, branch: true },
      order: { createdAt: "ASC" },
    });

    if (!ticket) {
      throw new BadRequestException("No customers waiting in this queue");
    }

    ticket.status = TicketStatus.CALLED;
    ticket.calledAt = new Date();
    const saved = await this.ticketsRepository.save(ticket);
    return this.toResponse(saved);
  }

  async serve(tenantId: string, ticketId: string) {
    const ticket = await this.getTicketOrThrow(tenantId, ticketId);

    if (ticket.status !== TicketStatus.CALLED) {
      throw new BadRequestException("Only called tickets can be served");
    }

    ticket.status = TicketStatus.SERVING;
    ticket.servingAt = new Date();
    const saved = await this.ticketsRepository.save(ticket);
    return this.toResponse(saved);
  }

  async complete(tenantId: string, ticketId: string) {
    const ticket = await this.getTicketOrThrow(tenantId, ticketId);

    if (
      ticket.status !== TicketStatus.SERVING &&
      ticket.status !== TicketStatus.CALLED
    ) {
      throw new BadRequestException("Ticket cannot be completed");
    }

    ticket.status = TicketStatus.COMPLETED;
    ticket.completedAt = new Date();
    if (!ticket.servingAt) {
      ticket.servingAt = new Date();
    }
    const saved = await this.ticketsRepository.save(ticket);
    return this.toResponse(saved);
  }

  async markNoShow(tenantId: string, ticketId: string) {
    const ticket = await this.getTicketOrThrow(tenantId, ticketId);

    if (ticket.status !== TicketStatus.CALLED) {
      throw new BadRequestException("Only called tickets can be marked no-show");
    }

    ticket.status = TicketStatus.NO_SHOW;
    ticket.completedAt = new Date();
    const saved = await this.ticketsRepository.save(ticket);
    return this.toResponse(saved);
  }

  async cancel(tenantId: string, ticketId: string) {
    const ticket = await this.getTicketOrThrow(tenantId, ticketId);

    if (
      ticket.status === TicketStatus.COMPLETED ||
      ticket.status === TicketStatus.CANCELLED
    ) {
      throw new BadRequestException("Ticket cannot be cancelled");
    }

    ticket.status = TicketStatus.CANCELLED;
    ticket.completedAt = new Date();
    const saved = await this.ticketsRepository.save(ticket);
    return this.toResponse(saved);
  }

  async getDashboardStats(tenantId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const queues = await this.queuesService.findAll(tenantId);
    const activeQueues = queues.filter((q) => q.status === QueueStatus.ACTIVE);

    const waitingCount = activeQueues.reduce((sum, q) => sum + q.waitingCount, 0);
    const servingCount = activeQueues.reduce((sum, q) => sum + q.servingCount, 0);

    const servedToday = await this.ticketsRepository.count({
      where: {
        tenantId,
        status: TicketStatus.COMPLETED,
        completedAt: Between(startOfDay, new Date()),
      },
    });

    const currentServing = await this.ticketsRepository.findOne({
      where: { tenantId, status: TicketStatus.SERVING },
      order: { servingAt: "DESC" },
    });

    const recentTickets = await this.ticketsRepository.find({
      where: { tenantId },
      relations: { queue: true, branch: true },
      order: { updatedAt: "DESC" },
      take: 10,
    });

    const avgWaitMinutes = await this.calculateAvgWaitMinutes(tenantId, startOfDay);
    const throughput = await this.getHourlyThroughput(tenantId);

    return {
      activeQueues: activeQueues.length,
      waitingCount,
      servingCount,
      servedToday,
      currentTicket: currentServing?.ticketNumber ?? null,
      avgWaitMinutes,
      queueSummaries: activeQueues,
      recentTickets: await Promise.all(
        recentTickets.map((ticket) => this.toResponse(ticket))
      ),
      throughput,
    };
  }

  private async createTicket(queue: Queue, dto: JoinQueueDto) {
    return this.dataSource.transaction(async (manager) => {
      const lockedQueue = await manager.findOne(Queue, {
        where: { id: queue.id },
        lock: { mode: "pessimistic_write" },
      });

      if (!lockedQueue || lockedQueue.status !== QueueStatus.ACTIVE) {
        throw new NotFoundException("Queue not available");
      }

      lockedQueue.ticketCounter += 1;
      await manager.save(lockedQueue);

      const ticketNumber = `${lockedQueue.prefix}-${String(lockedQueue.ticketCounter).padStart(3, "0")}`;

      const ticket = manager.create(Ticket, {
        tenantId: lockedQueue.tenantId,
        branchId: lockedQueue.branchId,
        queueId: lockedQueue.id,
        ticketNumber,
        sequenceNumber: lockedQueue.ticketCounter,
        customerName: dto.customerName.trim(),
        customerPhone: dto.customerPhone?.trim() || null,
        status: TicketStatus.WAITING,
        calledAt: null,
        servingAt: null,
        completedAt: null,
      });

      const saved = await manager.save(ticket);
      saved.queue = queue;
      saved.branch = queue.branch;
      return this.toResponse(saved);
    });
  }

  private async getTicketOrThrow(tenantId: string, ticketId: string) {
    const ticket = await this.ticketsRepository.findOne({
      where: { id: ticketId, tenantId },
      relations: { queue: true, branch: true },
    });

    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }

    return ticket;
  }

  private async getWaitingPosition(ticket: Ticket) {
    if (ticket.status !== TicketStatus.WAITING) {
      return null;
    }

    const ahead = await this.ticketsRepository.count({
      where: {
        queueId: ticket.queueId,
        status: TicketStatus.WAITING,
      },
    });

    const earlier = await this.ticketsRepository
      .createQueryBuilder("ticket")
      .where("ticket.queueId = :queueId", { queueId: ticket.queueId })
      .andWhere("ticket.status = :status", { status: TicketStatus.WAITING })
      .andWhere("ticket.createdAt < :createdAt", { createdAt: ticket.createdAt })
      .getCount();

    return earlier + 1;
  }

  private async countServedToday(tenantId: string, queueId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return this.ticketsRepository.count({
      where: {
        tenantId,
        queueId,
        status: TicketStatus.COMPLETED,
        completedAt: Between(startOfDay, new Date()),
      },
    });
  }

  private async calculateAvgWaitMinutes(tenantId: string, startOfDay: Date) {
    const tickets = await this.ticketsRepository.find({
      where: {
        tenantId,
        status: TicketStatus.COMPLETED,
        completedAt: Between(startOfDay, new Date()),
      },
    });

    const waits = tickets
      .filter((t) => t.servingAt)
      .map((t) => (t.servingAt!.getTime() - t.createdAt.getTime()) / 60000);

    if (waits.length === 0) return null;
    return Math.round(waits.reduce((a, b) => a + b, 0) / waits.length);
  }

  private async getHourlyThroughput(tenantId: string) {
    const now = new Date();
    const hours: number[] = [];

    for (let i = 11; i >= 0; i -= 1) {
      const hourStart = new Date(now);
      hourStart.setMinutes(0, 0, 0);
      hourStart.setHours(now.getHours() - i);

      const hourEnd = new Date(hourStart);
      hourEnd.setHours(hourStart.getHours() + 1);

      const count = await this.ticketsRepository.count({
        where: {
          tenantId,
          status: TicketStatus.COMPLETED,
          completedAt: Between(hourStart, hourEnd),
        },
      });

      hours.push(count);
    }

    return hours;
  }

  private getWaitMinutes(ticket: Ticket) {
    const end = ticket.servingAt ?? new Date();
    return Math.max(0, Math.round((end.getTime() - ticket.createdAt.getTime()) / 60000));
  }

  private async toResponse(ticket: Ticket) {
    const position = await this.getWaitingPosition(ticket);

    return {
      id: ticket.id,
      tenantId: ticket.tenantId,
      branchId: ticket.branchId,
      queueId: ticket.queueId,
      queueName: ticket.queue?.name ?? "",
      branchName: ticket.branch?.name ?? "",
      ticketNumber: ticket.ticketNumber,
      customerName: ticket.customerName,
      customerPhone: ticket.customerPhone,
      status: ticket.status,
      position,
      waitMinutes: this.getWaitMinutes(ticket),
      calledAt: ticket.calledAt?.toISOString() ?? null,
      servingAt: ticket.servingAt?.toISOString() ?? null,
      completedAt: ticket.completedAt?.toISOString() ?? null,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    };
  }

  private async toPublicResponse(ticket: Ticket, position: number | null) {
    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
      queueName: ticket.queue.name,
      branchName: ticket.branch.name,
      status: ticket.status,
      position,
      waitMinutes: this.getWaitMinutes(ticket),
    };
  }
}
