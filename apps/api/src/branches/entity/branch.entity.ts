import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Tenant } from "../../tenants/tenant.entity";

export enum BranchStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@Entity("branches")
@Unique(["tenantId", "slug"])
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

  @Column({ type: "varchar", nullable: true })
  slug!: string | null;

  @Column({ type: "enum", enum: BranchStatus, default: BranchStatus.ACTIVE })
  status!: BranchStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
