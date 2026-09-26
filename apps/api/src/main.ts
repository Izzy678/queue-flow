import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>("PORT", 3001);
  const databaseUrl = config.get<string>("DATABASE_URL");
  const sessionSecret = config.get<string>(
    "SESSION_SECRET",
    "dev-session-secret-change-in-production",
  );
  const isProduction = config.get("NODE_ENV") === "production";

  // Needed when the API sits behind Railway/Render/etc. reverse proxies.
  app.set("trust proxy", 1);

  app.enableCors({
    origin: true,
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
        // Browser talks to the Next.js proxy (same-site); Lax is enough.
        sameSite: "lax",
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
