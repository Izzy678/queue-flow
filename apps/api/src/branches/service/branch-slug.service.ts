import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Branch } from "../entity/branch.entity";

@Injectable()
export class BranchSlugService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>
  ) {}

  async generateUniqueSlug(tenantId: string, name: string): Promise<string> {
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
