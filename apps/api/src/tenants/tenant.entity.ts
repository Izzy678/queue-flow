import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Branch } from "../branches/branch.entity";

export enum TenantType {
  ORGANIZATION = "organization",
  STANDALONE_LOCATION = "standalone_location",
}

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @Column({ type: "enum", enum: TenantType })
  type!: TenantType;

  @OneToMany(() => User, (user) => user.tenant)
  users!: User[];

  @OneToMany(() => Branch, (branch) => branch.tenant)
  branches!: Branch[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
