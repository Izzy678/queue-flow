import { Controller, Get, Param, Query } from "@nestjs/common";
import { PublicBranchService } from "../service/public-branch.service";

@Controller("public/branches")
export class PublicBranchesController {
  constructor(private readonly publicBranchService: PublicBranchService) {}

  @Get(":tenantSlug/:branchSlug")
  getLanding(
    @Param("tenantSlug") tenantSlug: string,
    @Param("branchSlug") branchSlug: string,
    @Query("token") token: string
  ) {
    return this.publicBranchService.getBranchLanding(
      tenantSlug,
      branchSlug,
      token
    );
  }
}
