import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BranchesService } from "./service/branches.service";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { BranchesController } from "./controller/branches.controller";
import { Branch } from "./entity/branch.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  controllers: [BranchesController],
  providers: [BranchesService, RolesGuard],
  exports: [BranchesService],
})
export class BranchesModule {}
