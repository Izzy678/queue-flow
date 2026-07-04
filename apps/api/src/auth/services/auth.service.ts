import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { DataSource, Repository } from "typeorm";
import { Branch, BranchStatus } from "../../branches/entity/branch.entity";
import { Tenant, TenantType } from "../../tenants/tenant.entity";
import { User, UserRole } from "../../users/user.entity";
import { RegisterDto } from "../dto/auth.dto";
import { getUserBranchIds } from "../utils/branch-acess";

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException("An account with this email already exists");
    }

    const tenantType =
      dto.locationCount === "multiple"
        ? TenantType.ORGANIZATION
        : TenantType.STANDALONE_LOCATION;

    const slug = await this.generateUniqueSlug(dto.businessName);
    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const result = await this.dataSource.transaction(async (manager) => {
      const tenant = manager.create(Tenant, {
        name: dto.businessName.trim(),
        slug,
        type: tenantType,
      });
      await manager.save(tenant);

      const user = manager.create(User, {
        tenantId: tenant.id,
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        name: dto.name.trim(),
        role: UserRole.OWNER,
        branchIds: null,
      });
      await manager.save(user);

      const branchSlug = await this.generateUniqueBranchSlug(tenant.id, "Main");
      const branch = manager.create(Branch, {
        tenantId: tenant.id,
        name: "Main",
        slug: branchSlug,
        status: BranchStatus.ACTIVE,
      });
      await manager.save(branch);

      return { user, tenant, branch };
    });

    return {
      user: result.user,
      auth: this.buildAuthResponse(result.user, result.tenant, [result.branch]),
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!user) return null;

    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  async getAuthContext(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const tenant = await this.tenantsRepository.findOne({
      where: { id: user.tenantId },
    });
    if (!tenant) {
      throw new UnauthorizedException("Tenant not found");
    }

    const allBranches = await this.branchesRepository.find({
      where: { tenantId: tenant.id },
      order: { createdAt: "ASC" },
    });

    const allowed = getUserBranchIds(user);
    const branches = allowed
      ? allBranches.filter((branch) => allowed.includes(branch.id))
      : allBranches;

    return this.buildAuthResponse(user, tenant, branches);
  }

  private buildAuthResponse(user: User, tenant: Tenant, branches: Branch[]) {
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        type: tenant.type,
      },
      branches: branches.map((b) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        status: b.status,
      })),
    };
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "workspace";

    let slug = base;
    let attempt = 0;

    while (
      await this.tenantsRepository.findOne({ where: { slug } })
    ) {
      attempt += 1;
      slug = `${base}-${attempt}`;
    }

    return slug;
  }

  private async generateUniqueBranchSlug(
    tenantId: string,
    name: string
  ): Promise<string> {
    const base =
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || "branch";

    let slug = base;
    let attempt = 0;

    while (
      await this.branchesRepository.findOne({ where: { tenantId, slug } })
    ) {
      attempt += 1;
      slug = `${base}-${attempt}`;
    }

    return slug;
  }
}
