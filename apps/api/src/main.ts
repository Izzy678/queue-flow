import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3001);
  const corsOrigin = config.get<string>("CORS_ORIGIN", "http://localhost:3000");
  const databaseUrl = config.get<string>("DATABASE_URL");
  const sessionSecret = config.get<string>(
    "SESSION_SECRET",
    "dev-session-secret-change-in-production"
  );

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const PgSession = connectPgSimple(session);
  app.use(
    session({
      store: new PgSession({
        conString: databaseUrl,
        createTableIfMissing: true,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite: "lax",
        secure: config.get("NODE_ENV") === "production",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix("api");

  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
