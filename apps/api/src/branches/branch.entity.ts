import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Tenant } from "../tenants/tenant.entity";

export enum BranchStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("branches")
export class Branch {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  tenantId!: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.branches, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenantId" })
  tenant!: Tenant;

  @Column()
  name!: string;

  @Column({ type: "enum", enum: BranchStatus, default: BranchStatus.ACTIVE })
  status!: BranchStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
