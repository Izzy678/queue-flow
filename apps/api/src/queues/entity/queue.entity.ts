import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Branch } from "../../branches/entity/branch.entity";
import { Ticket } from "./ticket.entity";


export enum QueueStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("queues")
export class Queue {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tenantId!: string;

  @Column()
  branchId!: string;

  @ManyToOne(() => Branch, { onDelete: "CASCADE" })
  @JoinColumn({ name: "branchId" })
  branch!: Branch;

  @Column()
  name!: string;

  @Column({ length: 3 })
  prefix!: string;

  @Column({ default: "#6366f1" })
  color!: string;

  @Column({ type: "enum", enum: QueueStatus, default: QueueStatus.ACTIVE })
  status!: QueueStatus;

  @Column({ default: 0 })
  ticketCounter!: number;

  @OneToMany(() => Ticket, (ticket) => ticket.queue)
  tickets!: Ticket[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
