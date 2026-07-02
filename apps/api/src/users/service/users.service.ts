import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { In, Repository } from "typeorm";
import { Branch } from "src/branches/entity/branch.entity";
import { User, UserRole } from "../user.entity";
import { CreateTeamMemberDto, UpdateTeamMemberDto } from "../dto/user.dto";

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>
  ) {}

  async findAll(tenantId: string) {
    const users = await this.usersRepository.find({
      where: { tenantId },
      order: { createdAt: "ASC" },
    });
    return users.map((user) => this.toResponse(user));
  }

  async create(actor: User, dto: CreateTeamMemberDto) {
    this.assertCanManageTeam(actor);

    if (actor.role === UserRole.ADMIN && dto.role === UserRole.ADMIN) {
      throw new ForbiddenException("Admins can only invite staff members");
    }

    const existing = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }

    await this.validateBranchIds(actor.tenantId, dto.branchIds);

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = this.usersRepository.create({
      tenantId: actor.tenantId,
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      name: dto.name.trim(),
      role: dto.role,
      branchIds: dto.branchIds ?? null,
    });

    const saved = await this.usersRepository.save(user);
    return this.toResponse(saved);
  }

  async update(actor: User, id: string, dto: UpdateTeamMemberDto) {
    this.assertCanManageTeam(actor);

    const user = await this.getTeamMemberOrThrow(actor.tenantId, id);
    this.assertCanModifyMember(actor, user);

    if (
      dto.role === UserRole.ADMIN &&
      actor.role === UserRole.ADMIN
    ) {
      throw new ForbiddenException("Only owners can assign admin roles");
    }

    if (dto.name !== undefined) {
      user.name = dto.name.trim();
    }
    if (dto.role !== undefined) {
      user.role = dto.role;
    }
    if (dto.branchIds !== undefined) {
      await this.validateBranchIds(actor.tenantId, dto.branchIds ?? undefined);
      user.branchIds = dto.branchIds;
    }

    const saved = await this.usersRepository.save(user);
    return this.toResponse(saved);
  }

  async remove(actor: User, id: string) {
    this.assertCanManageTeam(actor);

    if (actor.id === id) {
      throw new BadRequestException("You cannot remove your own account");
    }

    const user = await this.getTeamMemberOrThrow(actor.tenantId, id);
    this.assertCanModifyMember(actor, user);

    if (user.role === UserRole.OWNER) {
      throw new BadRequestException("Cannot remove the workspace owner");
    }

    await this.usersRepository.remove(user);
    return { message: "Team member removed" };
  }

  private assertCanManageTeam(actor: User) {
    if (actor.role === UserRole.STAFF) {
      throw new ForbiddenException("Insufficient permissions");
    }
  }

  private assertCanModifyMember(actor: User, target: User) {
    if (target.role === UserRole.OWNER) {
      throw new ForbiddenException("Cannot modify the workspace owner");
    }

    if (
      actor.role === UserRole.ADMIN &&
      target.role === UserRole.ADMIN
    ) {
      throw new ForbiddenException("Admins cannot modify other admins");
    }
  }

  private async getTeamMemberOrThrow(tenantId: string, id: string) {
    const user = await this.usersRepository.findOne({
      where: { id, tenantId },
    });

    if (!user) {
      throw new NotFoundException("Team member not found");
    }

    return user;
  }

  private async validateBranchIds(
    tenantId: string,
    branchIds?: string[]
  ) {
    if (!branchIds?.length) return;

    const branches = await this.branchesRepository.find({
      where: { id: In(branchIds), tenantId },
    });

    if (branches.length !== branchIds.length) {
      throw new BadRequestException("One or more branches are invalid");
    }
  }

  private toResponse(user: User) {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      role: user.role,
      branchIds: user.branchIds,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
