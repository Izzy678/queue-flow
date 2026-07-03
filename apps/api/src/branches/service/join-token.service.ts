import { randomBytes } from "crypto";
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import { BranchJoinToken } from "../entity/branch-join-token.entity";
import { Branch } from "../entity/branch.entity";

export const JOIN_TOKEN_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class JoinTokenService {
  constructor(
    @InjectRepository(BranchJoinToken)
    private readonly tokensRepository: Repository<BranchJoinToken>,
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>
  ) {}

  async createToken(tenantId: string, branchId: string) {
    await this.getBranchOrThrow(tenantId, branchId);

    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + JOIN_TOKEN_TTL_MS);

    const record = this.tokensRepository.create({
      branchId,
      tenantId,
      token,
      expiresAt,
    });

    await this.tokensRepository.save(record);

    return { token, expiresAt: expiresAt.toISOString() };
  }

  async validateToken(token: string, branchId: string) {
    const record = await this.tokensRepository.findOne({
      where: {
        token,
        branchId,
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!record) {
      throw new UnauthorizedException(
        "This QR code has expired. Please scan the code on the screen at the branch."
      );
    }

    return record;
  }

  private async getBranchOrThrow(tenantId: string, branchId: string) {
    const branch = await this.branchesRepository.findOne({
      where: { id: branchId, tenantId },
    });

    if (!branch) {
      throw new NotFoundException("Branch not found");
    }

    return branch;
  }
}
