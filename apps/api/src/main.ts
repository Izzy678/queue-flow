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
  const databaseUrl = config.get<string>("DATABASE_URL");
  const sessionSecret = config.get<string>(
    "SESSION_SECRET",
    "dev-session-secret-change-in-production",
  );
  const isProduction = config.get("NODE_ENV") === "production";

  // Reflect the request Origin (cannot use "*" with credentials: true).
  app.enableCors({
    origin: ["http://localhost:3000", "https://queue-flow-web-two.vercel.app"],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
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
        // Cross-site frontend ↔ API (e.g. Vercel → Railway) needs SameSite=None.
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix("api");

  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}

bootstrap();
