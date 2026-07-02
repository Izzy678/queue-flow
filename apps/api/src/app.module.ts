import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { BranchesModule } from "./branches/branches.module";
import { HealthModule } from "./health/health.module";
import { TenantsModule } from "./tenants/tenants.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get<string>("DATABASE_URL"),
        autoLoadEntities: true,
        synchronize: configService.get("NODE_ENV") !== "production",
        ssl: { rejectUnauthorized: true },
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    AuthModule,
    BranchesModule,
    TenantsModule,
    UsersModule,
  ],
})
export class AppModule {}
