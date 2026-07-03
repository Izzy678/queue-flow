import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";

@Entity("branch_join_tokens")
export class BranchJoinToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  @Index()
  branchId!: string;

  @Column()
  tenantId!: string;

  @Column({ unique: true })
  token!: string;

  @Column({ type: "timestamptz" })
  expiresAt!: Date;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
