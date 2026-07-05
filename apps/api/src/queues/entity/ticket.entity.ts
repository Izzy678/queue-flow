import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Branch } from "../../branches/entity/branch.entity";
import { Queue } from "./queue.entity";

export enum TicketStatus {
  WAITING = "waiting",
  CALLED = "called",
  SERVING = "serving",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

@Entity("tickets")
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  branchId!: string;

  @Column()
  queueId!: string;

  @ManyToOne(() => Queue, (queue) => queue.tickets, { onDelete: "CASCADE" })
  @JoinColumn({ name: "queueId" })
  queue!: Queue;

  @ManyToOne(() => Branch, { onDelete: "CASCADE" })
  @JoinColumn({ name: "branchId" })
  branch!: Branch;

  @Column()
  ticketNumber!: string;

  @Column()
  sequenceNumber!: number;

  @Column()
  customerName!: string;

  @Column({ type: "varchar", nullable: true })
  customerEmail!: string | null;

  @Column({ type: "varchar", nullable: true })
  customerPhone!: string | null;

  @Column({ type: "enum", enum: TicketStatus, default: TicketStatus.WAITING })
  status!: TicketStatus;

  @Column({ type: "timestamptz", nullable: true })
  calledAt!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  servingAt!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  completedAt!: Date | null;

  @Column({ type: "timestamptz", nullable: true })
  almostTurnNotifiedAt!: Date | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
