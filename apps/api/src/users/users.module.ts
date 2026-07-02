import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch } from "src/branches/entity/branch.entity";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { User } from "./user.entity";
import { UsersController } from "./controller/users.controller";
import { UsersService } from "./service/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, Branch])],
  controllers: [UsersController],
  providers: [UsersService, RolesGuard],
  exports: [UsersService],
})
export class UsersModule {}
