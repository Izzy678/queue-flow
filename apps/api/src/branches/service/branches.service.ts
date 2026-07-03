import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Branch, BranchStatus } from "../entity/branch.entity";
import { CreateBranchDto, UpdateBranchDto } from "../dto/branch.dto";
import { BranchSlugService } from "./branch-slug.service";

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
    private readonly branchSlugService: BranchSlugService
  ) {}

  async findAll(tenantId: string) {
    const branches = await this.branchesRepository.find({
      where: { tenantId },
      order: { createdAt: "ASC" },
    });

    await Promise.all(branches.map((branch) => this.ensureSlug(branch)));

    return branches.map((branch) => this.toResponse(branch));
  }

  async findOne(tenantId: string, id: string) {
    const branch = await this.getBranchOrThrow(tenantId, id);
    await this.ensureSlug(branch);
    return this.toResponse(branch);
  }

  async create(tenantId: string, dto: CreateBranchDto) {
    const slug = await this.branchSlugService.generateUniqueSlug(
      tenantId,
      dto.name
    );

    const branch = this.branchesRepository.create({
      tenantId,
      name: dto.name.trim(),
      slug,
      status: BranchStatus.ACTIVE,
    });
    const saved = await this.branchesRepository.save(branch);
    return this.toResponse(saved);
  }

  async update(tenantId: string, id: string, dto: UpdateBranchDto) {
    const branch = await this.getBranchOrThrow(tenantId, id);

    if (dto.name !== undefined) {
      branch.name = dto.name.trim();
    }
    if (dto.status !== undefined) {
      branch.status = dto.status;
    }

    const saved = await this.branchesRepository.save(branch);
    return this.toResponse(saved);
  }

  async remove(tenantId: string, id: string) {
    const branch = await this.getBranchOrThrow(tenantId, id);

    const count = await this.branchesRepository.count({ where: { tenantId } });
    if (count <= 1) {
      throw new BadRequestException("Cannot delete the only branch");
    }

    await this.branchesRepository.remove(branch);
    return { message: "Branch deleted" };
  }

  async getBranchOrThrow(tenantId: string, id: string) {
    const branch = await this.branchesRepository.findOne({
      where: { id, tenantId },
      relations: { tenant: true },
    });

    if (!branch) {
      throw new NotFoundException("Branch not found");
    }

    await this.ensureSlug(branch);
    return branch;
  }

  private async ensureSlug(branch: Branch) {
    if (branch.slug) return branch;

    branch.slug = await this.branchSlugService.generateUniqueSlug(
      branch.tenantId,
      branch.name
    );
    return this.branchesRepository.save(branch);
  }

  private toResponse(branch: Branch) {
    return {
      id: branch.id,
      tenantId: branch.tenantId,
      name: branch.name,
      slug: branch.slug ?? "",
      status: branch.status,
      createdAt: branch.createdAt.toISOString(),
      updatedAt: branch.updatedAt.toISOString(),
    };
  }
}
